---
title: PowerShell-Grundlagen
description: Objekte, Pipeline, Hilfe, Variablen, Funktionen und Fehler für sichere Automation verstehen.
learning:
  level: Einstieg
  duration: 60 Minuten
  goals:
    - die PowerShell-Objektpipeline von einer Textpipeline unterscheiden.
    - Befehle über Hilfe und Objekteigenschaften selbstständig erkunden.
    - eine kleine Funktion mit Parametern und klarer Ausgabe schreiben.
  terms: [Cmdlet, Objekt, Pipeline, Parameter, Funktion]
  practice: Löse fünf Aufgaben am Ende mit Objekten. Verwende Format-Table nur bei der Anzeige und exportiere dieselben Daten zusätzlich als JSON.
  check:
    - question: Warum sollte Format-Table am Ende einer Pipeline stehen?
      answer: Format-Cmdlets erzeugen Darstellungsobjekte für den Bildschirm. Danach sind die ursprünglichen Eigenschaften nicht mehr zuverlässig weiterzuverarbeiten.
    - question: Wie findest du passende Befehle ohne Suchmaschine?
      answer: Mit Get-Command, Get-Help und Get-Member; zuerst Verb oder Nomen suchen, dann Beispiele und Objekteigenschaften prüfen.
    - question: Was ist der Vorteil einer Funktion mit Parametern gegenüber kopierten Befehlen?
      answer: Sie definiert einen wiederverwendbaren Vertrag, kann Eingaben validieren, getestet und versioniert werden.
  next: /lernwerkstatt/lab-powershell
---

# PowerShell-Grundlagen – mit Objekten automatisieren

PowerShell übergibt zwischen Befehlen normalerweise **Objekte**, nicht nur Textzeilen. Eigenschaften wie `Name`, `Status` oder `Length` bleiben erhalten und können gezielt gefiltert, sortiert und exportiert werden.

## Befehle entdecken

PowerShell-Cmdlets folgen meist dem Muster `Verb-Nomen`:

```powershell
Get-Command -Verb Get -Noun '*Service*'
Get-Help Get-Service -Examples
Get-Help Get-Service -Full
```

Aktualisiere Hilfetexte auf einem freigegebenen System mit `Update-Help`. Die lokal installierte Hilfe passt zur vorhandenen Version besser als ein zufälliger Blogbeitrag.

## Objekte untersuchen

```powershell
Get-Service | Get-Member
Get-Service | Select-Object -First 1 | Format-List *
```

`Get-Member` zeigt Typ, Eigenschaften und Methoden. Danach kannst du objektbasiert arbeiten:

```powershell
Get-Service |
    Where-Object Status -eq 'Running' |
    Sort-Object DisplayName |
    Select-Object Name, DisplayName, Status
```

Erst ganz am Ende formatieren:

```powershell
$services = Get-Service |
    Where-Object Status -eq 'Running' |
    Select-Object Name, DisplayName, Status

$services | Format-Table
$services | ConvertTo-Json | Set-Content -Path './services.json' -Encoding utf8
```

## Variablen und Datentypen

```powershell
[string]$EnvironmentName = 'test'
[int]$Port = 8443
[datetime]$CheckedAt = Get-Date
[bool]$Enabled = $true
```

Doppelte Anführungszeichen interpolieren Variablen, einfache nicht:

```powershell
"Environment: $EnvironmentName"
'Environment: $EnvironmentName'
```

Für komplexe Ausdrücke in Strings:

```powershell
"Checked at $($CheckedAt.ToUniversalTime().ToString('O'))"
```

## Arrays und Hashtables

```powershell
$ports = @(80, 443, 8443)
$configuration = @{
    Environment = 'test'
    RetryCount = 3
    TimeoutSec = 10
}
```

Konfigurationsdaten lassen sich in ein Objekt überführen:

```powershell
$result = [pscustomobject]@{
    ComputerName = $env:COMPUTERNAME
    TimestampUtc = (Get-Date).ToUniversalTime()
    Ports = $ports
    Ready = $true
}
```

## Dateien sicher verarbeiten

```powershell
$labRoot = Join-Path $PWD 'lab-data'
New-Item -ItemType Directory -Path $labRoot -Force | Out-Null

$logPath = Join-Path $labRoot 'app.log'
Set-Content -Path $logPath -Value 'INFO started' -Encoding utf8
Add-Content -Path $logPath -Value 'ERROR sample failure' -Encoding utf8

Select-String -Path $logPath -Pattern 'ERROR' -SimpleMatch
```

`Join-Path` verhindert viele fehlerhafte Trennzeichen. Vor Lösch- oder Verschiebeaktionen Ziele auflösen und zunächst mit `-WhatIf` prüfen, wenn das Cmdlet es unterstützt.

## Eine Funktion mit Vertrag

```powershell
function Get-LargeFile {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [ValidateScript({ Test-Path -LiteralPath $_ -PathType Container })]
        [string]$Path,

        [ValidateRange(0, 1TB)]
        [long]$MinimumBytes = 10MB
    )

    Get-ChildItem -LiteralPath $Path -File -Recurse -ErrorAction Stop |
        Where-Object Length -ge $MinimumBytes |
        Select-Object FullName, Length, LastWriteTimeUtc
}
```

Aufruf:

```powershell
Get-LargeFile -Path $labRoot -MinimumBytes 1KB |
    Sort-Object Length -Descending
```

Die Funktion liefert Datenobjekte und entscheidet nicht über Bildschirmformat oder Export. Das macht sie wiederverwendbar.

## Fehler verstehen

Nicht jeder Fehler ist standardmäßig terminierend. Für kontrollierte Behandlung:

```powershell
try {
    $content = Get-Content -LiteralPath './required.conf' -ErrorAction Stop
}
catch [System.Management.Automation.ItemNotFoundException] {
    Write-Error "Configuration file is missing: $($_.Exception.Message)"
    exit 2
}
catch {
    Write-Error "Unexpected failure: $($_.Exception.Message)"
    exit 1
}
```

`Write-Host` ist für Benutzerhinweise, nicht für maschinenlesbare Ergebnisdaten. Nutze Output-Stream, Error-Stream und sinnvolle Exit Codes bewusst.

## Fünf Praxisaufgaben

1. Liste die fünf größten Dateien eines Lab-Ordners als Objekte.
2. Finde in `.log`-Dateien `ERROR` und gib Pfad, Zeilennummer und Text aus.
3. Erzeuge einen Systemreport mit Hostname, PowerShell-Version und UTC-Zeit als JSON.
4. Prüfe einen TCP-Port mit `Test-NetConnection` und forme ein kleines Ergebnisobjekt.
5. Schreibe eine Funktion, die einen Pfad validiert und die Gesamtgröße lesbar zurückgibt.

Für jede Aufgabe gilt:

- positiver und negativer Test,
- keine echten Unternehmensdaten,
- klare Ausgabeobjekte,
- Fehler führt zu einem nachvollziehbaren Befund,
- Beispielaufruf in der Hilfe.

## Weiterlernen

- [PowerShell für DevOps](/powershell-kurs)
- [Fehlerbehandlung & Logging](/windows/powershell-fehlerbehandlung)
- [Pester](/windows/pester-testing)
- [Lab 3](/lernwerkstatt/lab-powershell)

**Primärquelle:** [Microsoft Learn: PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
