---
title: PowerShell Fehlerbehandlung & Logging
description: Terminierende Fehler, try/catch/finally, Exit Codes und strukturierte Logs richtig einsetzen.
---

# PowerShell Fehlerbehandlung & Logging

Ein Automatisierungsskript ist erst dann zuverlässig, wenn sein Fehlerpfad genauso bewusst entworfen wurde wie der Erfolgsfall. PowerShell unterscheidet zwischen terminierenden und nicht terminierenden Fehlern – eine häufige Quelle für scheinbar erfolgreiche, tatsächlich aber unvollständige Läufe.

<div class="tag-row"><span class="tag">PowerShell</span><span class="tag">Exceptions</span><span class="tag">Logging</span><span class="tag">Automation</span></div>

## Zwei Fehlerarten

Viele Cmdlets melden einen Fehler, arbeiten aber mit dem nächsten Pipeline-Element weiter. Das ist interaktiv praktisch, in Automatisierung aber riskant.

```powershell
Get-Content -Path 'C:\missing.txt'
Write-Host 'Dieses Kommando kann trotzdem laufen.'
```

`try/catch` behandelt terminierende Fehler. Mit `-ErrorAction Stop` wird ein nicht terminierender Cmdlet-Fehler für diesen Aufruf terminierend:

```powershell
try {
    $content = Get-Content -Path 'C:\missing.txt' -ErrorAction Stop
}
catch {
    Write-Error "Datei konnte nicht gelesen werden: $($_.Exception.Message)"
}
```

## Ein belastbares Funktionsmuster

```powershell
function Get-Configuration {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [string] $Path
    )

    try {
        $raw = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
        return $raw | ConvertFrom-Json -ErrorAction Stop
    }
    catch [System.IO.FileNotFoundException] {
        throw "Konfiguration nicht gefunden: $Path"
    }
    catch [System.ArgumentException] {
        throw "Konfiguration enthält ungültiges JSON: $Path"
    }
    catch {
        throw "Konfiguration konnte nicht geladen werden: $($_.Exception.Message)"
    }
}
```

Merkmale:

- Parameter werden vor der eigentlichen Arbeit validiert.
- `-LiteralPath` interpretiert keine Wildcards.
- relevante Cmdlet-Fehler werden terminierend.
- bekannte Fehler erhalten verständliche Meldungen.
- unbekannte Fehler werden nicht verschluckt.

## `throw` oder `Write-Error`?

| Werkzeug | Verhalten | Geeignet für |
|---|---|---|
| `throw` | erzeugt terminierenden Fehler | Funktion kann Ergebnis nicht liefern |
| `Write-Error` | schreibt in Error-Stream | Fehlerobjekt melden, Aufrufer entscheidet |
| `Write-Warning` | Warnung, Lauf geht weiter | degradiertes, aber gültiges Ergebnis |
| `Write-Verbose` | optionale Diagnose | technische Details mit `-Verbose` |
| `Write-Information` | Information-Stream | strukturierte Betriebsinformationen |

Bibliotheksfunktionen sollten selten den gesamten Prozess mit `exit` beenden. Sie werfen einen Fehler; das aufrufende Skript entscheidet über Exit Code und Recovery.

## `finally` für Aufräumarbeiten

```powershell
$connection = $null

try {
    $connection = Open-ExampleConnection -ErrorAction Stop
    Invoke-ExampleTask -Connection $connection -ErrorAction Stop
}
catch {
    Write-Error $_
    throw
}
finally {
    if ($null -ne $connection) {
        Close-ExampleConnection -Connection $connection
    }
}
```

`finally` läuft unabhängig davon, ob der `try`-Block erfolgreich war oder einen Fehler ausgelöst hat. Typische Aufgaben sind Verbindungen schließen, Locks freigeben und temporäre Dateien entfernen.

## Fehlerobjekte untersuchen

Im Catch-Block ist `$_` das aktuelle Fehlerobjekt:

```powershell
catch {
    [pscustomobject]@{
        Message              = $_.Exception.Message
        ExceptionType        = $_.Exception.GetType().FullName
        FullyQualifiedErrorId = $_.FullyQualifiedErrorId
        Category             = $_.CategoryInfo.Category
        Target               = $_.CategoryInfo.TargetName
        Script               = $_.InvocationInfo.ScriptName
        Line                 = $_.InvocationInfo.ScriptLineNumber
    } | Format-List
}
```

Keine geheimen Argumente oder kompletten Objekte ungefiltert protokollieren.

## Strukturierte Logs

```powershell
function Write-StructuredLog {
    param(
        [ValidateSet('Debug', 'Information', 'Warning', 'Error')]
        [string] $Level,
        [string] $Event,
        [hashtable] $Data = @{}
    )

    $entry = [ordered]@{
        Timestamp = (Get-Date).ToUniversalTime().ToString('o')
        Level     = $Level
        Event     = $Event
        Data      = $Data
    }

    $entry | ConvertTo-Json -Compress -Depth 6
}

Write-StructuredLog -Level Information -Event 'deployment_started' -Data @{
    Environment = 'staging'
    Version     = '1.4.2'
}
```

Stabile Feldnamen sind wichtiger als bunte Konsolenausgabe. Ein Log-Aggregator kann JSON filtern, korrelieren und alarmieren.

## Exit Codes für CI und Scheduler

Am Rand der Anwendung wird ein Fehler in einen Prozessstatus übersetzt:

```powershell
try {
    Invoke-Main
    exit 0
}
catch {
    Write-Error $_
    exit 1
}
```

Wenn externe Programme aufgerufen werden, muss `$LASTEXITCODE` geprüft werden:

```powershell
git diff --quiet

if ($LASTEXITCODE -eq 1) {
    Write-Host 'Es gibt Änderungen.'
}
elseif ($LASTEXITCODE -ne 0) {
    throw "git diff ist mit Exit Code $LASTEXITCODE fehlgeschlagen."
}
```

Nicht jeder non-zero Code bedeutet dasselbe. Die Dokumentation des Programms entscheidet.

## Retry nur bei vorübergehenden Fehlern

```powershell
function Invoke-WithRetry {
    param(
        [scriptblock] $Operation,
        [int] $MaxAttempts = 4
    )

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            return & $Operation
        }
        catch {
            if ($attempt -eq $MaxAttempts) { throw }

            $delay = [Math]::Pow(2, $attempt)
            Write-Warning "Versuch $attempt fehlgeschlagen. Neuer Versuch in $delay Sekunden."
            Start-Sleep -Seconds $delay
        }
    }
}
```

Retries sind nur sicher, wenn die Operation idempotent ist oder einen Idempotency Key verwendet. Syntaxfehler, fehlende Berechtigungen und ungültige Eingaben werden durch Wiederholung nicht besser.

## Häufige Fehler

- leeres `catch {}` verschluckt die Ursache,
- globale `$ErrorActionPreference = 'SilentlyContinue'`,
- `Write-Host` als einziges Logging,
- Secrets in Exception- oder Request-Dumps,
- `exit` tief in wiederverwendbaren Funktionen,
- Retry für jeden Fehlertyp,
- Aufräumen nur im Erfolgsfall.

## Review-Checkliste

- [ ] Werden relevante Cmdlet-Fehler terminierend gemacht?
- [ ] Enthalten Meldungen genug Kontext ohne Secrets?
- [ ] Werden Ressourcen im `finally`-Block freigegeben?
- [ ] Wirft die Funktion Fehler statt den Prozess zu beenden?
- [ ] Prüft das Skript Exit Codes externer Programme?
- [ ] Sind Logs strukturiert und korrelierbar?
- [ ] Sind Retries begrenzt, verzögert und idempotent?
- [ ] Gibt es Pester-Tests für Fehlerpfade?

## Weiterführende Quellen

- [Microsoft Learn – about_Try_Catch_Finally](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_try_catch_finally)
- [Microsoft Learn – about_Error_Handling](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_error_handling)
- [Microsoft Learn – Everything about exceptions](https://learn.microsoft.com/en-us/powershell/scripting/learn/deep-dives/everything-about-exceptions)

Weiter: [Tests mit Pester](./pester-testing).
