---
title: PowerShell für Fortgeschrittene
description: Von einzelnen Skripten zu Modulen, Remoting, Parallelität, APIs, Tests und produktionsreifer Automation.
learning:
  level: Aufbau
  duration: 60 Minuten
  goals:
    - ein Skript in kleine testbare Funktionen und ein Modul strukturieren.
    - Parallelität, Remoting und Wiederholungen anhand ihrer Risiken bewerten.
    - Automation mit strukturiertem Logging, Tests und sicheren Identitäten betreiben.
  terms: [Modul, Remoting, Parallelität, API, Idempotenz]
  practice: Wähle eine bisher manuelle Prüfung und entwirf ein PowerShell-Modul mit öffentlicher Funktion, internen Helfern, Pester-Tests, strukturiertem Ergebnis und Betriebsvertrag.
  check:
    - question: Wann macht Parallelität ein Skript schlechter?
      answer: Wenn Ziele gemeinsame Limits oder Zustand teilen, Ergebnisse ungeordnet werden, Fehler schwer zuzuordnen sind oder die Aufgabe ohnehin nicht laufzeitkritisch ist.
    - question: Warum sollte ein Modul nur wenige Funktionen exportieren?
      answer: Eine kleine öffentliche Oberfläche bleibt verständlich, stabil und testbar; interne Helfer können ohne Nutzervertrag geändert werden.
    - question: Was braucht ein sicherer API-Retry?
      answer: Einen vorübergehenden Fehler, idempotente oder geschützte Operation, begrenzte Versuche, Backoff/Jitter und einen klaren Endfehler.
  next: /windows/pester-testing
---

# PowerShell für Fortgeschrittene

Fortgeschrittene PowerShell bedeutet nicht möglichst kurze Einzeiler. Gute Automation hat einen klaren Vertrag, lässt sich testen, meldet Fehler maschinenlesbar und bleibt bei Wiederholung sicher.

## Vom Skript zum Modul

Eine mögliche Struktur:

```text
DeploymentTools/
├── DeploymentTools.psd1
├── DeploymentTools.psm1
├── Public/
│   └── Test-DeploymentReadiness.ps1
├── Private/
│   ├── Invoke-ApiRequest.ps1
│   └── Write-StructuredLog.ps1
└── Tests/
    ├── Unit/
    └── Integration/
```

Öffentliche Funktionen bilden den Nutzervertrag. Private Funktionen kapseln Details. Das Manifest beschreibt Version, kompatible PowerShell-Ausgabe und exportierte Befehle.

## Advanced Functions

```powershell
function Set-AppConfiguration {
    [CmdletBinding(SupportsShouldProcess, ConfirmImpact = 'Medium')]
    param(
        [Parameter(Mandatory, ValueFromPipelineByPropertyName)]
        [ValidateNotNullOrEmpty()]
        [string]$ComputerName,

        [Parameter(Mandatory)]
        [ValidateSet('Development', 'Test', 'Production')]
        [string]$Environment
    )

    process {
        if ($PSCmdlet.ShouldProcess($ComputerName, "Set configuration for $Environment")) {
            # Gezielte, idempotente Änderung
        }
    }
}
```

`SupportsShouldProcess` ermöglicht `-WhatIf` und `-Confirm`. Es ersetzt keine Validierung, zeigt aber vor verändernden Aktionen das Ziel.

## Strukturierte Logs

Menschen lesen Text, Systeme verarbeiten Felder:

```powershell
$event = [pscustomobject]@{
    TimestampUtc = (Get-Date).ToUniversalTime().ToString('O')
    Level = 'Information'
    Operation = 'ConfigurationCheck'
    ComputerName = 'server-lab-01'
    Success = $true
    DurationMs = 184
    CorrelationId = [guid]::NewGuid().ToString()
}

$event | ConvertTo-Json -Compress
```

Keine Tokens, Passwörter oder vertraulichen Inhalte loggen. Eine Correlation ID verbindet zusammengehörige Schritte.

## APIs robust aufrufen

```powershell
function Invoke-ApiRequest {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [uri]$Uri,

        [ValidateRange(1, 5)]
        [int]$MaximumAttempts = 3
    )

    for ($attempt = 1; $attempt -le $MaximumAttempts; $attempt++) {
        try {
            return Invoke-RestMethod -Uri $Uri -Method Get -TimeoutSec 10 -ErrorAction Stop
        }
        catch {
            if ($attempt -eq $MaximumAttempts) { throw }
            $delay = [math]::Pow(2, $attempt - 1) + (Get-Random -Minimum 0.0 -Maximum 0.5)
            Start-Sleep -Seconds $delay
        }
    }
}
```

In echter Nutzung nur bei vorübergehenden Fehlern wiederholen, `Retry-After` beachten und keine nicht-idempotente Änderung blind erneut senden.

## Remoting

Remote-Automation erweitert die Fehler- und Sicherheitsfläche:

- Zielidentität und Hostschlüssel prüfen,
- minimale Rechte verwenden,
- fan-out begrenzen,
- Timeouts und Teilergebnisse behandeln,
- Ergebnis eindeutig dem Ziel zuordnen,
- keine Credentials in Argumenten oder Logs.

```powershell
$results = Invoke-Command -HostName $hosts -ScriptBlock {
    [pscustomobject]@{
        ComputerName = [Environment]::MachineName
        PowerShellVersion = $PSVersionTable.PSVersion.ToString()
        TimestampUtc = (Get-Date).ToUniversalTime()
    }
} -ThrottleLimit 5
```

Vertiefung: [PowerShell Remoting über SSH](/windows/powershell-remoting).

## Parallelität bewusst einsetzen

```powershell
$results = $hosts | ForEach-Object -Parallel {
    Test-Connection -TargetName $_ -Count 1 -TimeoutSeconds 2 -Quiet
} -ThrottleLimit 8
```

Vorher klären:

- verträgt das Ziel die parallele Last?
- sind Ergebnisse und Fehler pro Ziel zuordenbar?
- gibt es gemeinsame Dateien oder globale Limits?
- ist die Laufzeitersparnis relevant?
- wie wird abgebrochen und aufgeräumt?

## Konfiguration statt hartem Code

```powershell
$config = Get-Content -LiteralPath './config.json' -Raw |
    ConvertFrom-Json -ErrorAction Stop

if (-not $config.Environment -or -not $config.ApiBaseUri) {
    throw 'Configuration requires Environment and ApiBaseUri.'
}
```

Konfiguration validieren, bevor eine Änderung beginnt. Secrets werden zur Laufzeit aus einer vorgesehenen Quelle bezogen und nie mit der normalen Konfiguration eingecheckt.

## Tests und Qualitätsgrenzen

- Parser-/Style-Prüfung,
- Unit-Tests für reine Logik,
- Mocks an eigenen Schnittstellen,
- Integrationstests gegen isolierte Systeme,
- negativer Test und Exit Code,
- Signierung oder kontrollierte Herkunft, wenn die Umgebung dies fordert.

Mehr dazu im [Pester-Guide](/windows/pester-testing).

## Abschlussprojekt

Baue ein Modul, das einen freigegebenen Testdienst prüft und einen Report erzeugt:

1. Parameter und Konfiguration validieren.
2. Ziele mit begrenzter Parallelität prüfen.
3. Timeouts und Teilfehler pro Ziel erfassen.
4. strukturierte Objekte zurückgeben.
5. JSON und menschenlesbare Zusammenfassung erzeugen.
6. Unit- und Integrationstests trennen.
7. Exit Code für Pipeline-Nutzung definieren.
8. README mit Beispiel, Sicherheit, Grenzen und Rückweg schreiben.

**Primärquelle:** [Microsoft Learn: PowerShell](https://learn.microsoft.com/en-us/powershell/)
