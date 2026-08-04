---
title: PowerShell testen mit Pester
description: Funktionen, Assertions, Mocks und CI-Tests für PowerShell mit Pester aufbauen.
---

# PowerShell testen mit Pester

Pester ist das Test- und Mocking-Framework für PowerShell. Gute Tests prüfen beobachtbares Verhalten: Rückgabewerte, Fehler, Seiteneffekte und Interaktion mit kontrollierten Abhängigkeiten.

<div class="tag-row"><span class="tag">PowerShell</span><span class="tag">Pester</span><span class="tag">Testing</span><span class="tag">CI</span></div>

## Testbaren Code schreiben

Schwer testbar:

```powershell
$users = Get-ADUser -Filter *
$users | Export-Csv C:\reports\users.csv
Send-MailMessage -To admin@example.com -Attachments C:\reports\users.csv
```

Testbarer wird der Code durch kleine Funktionen und explizite Ein-/Ausgaben:

```powershell
function Get-EnabledUserSummary {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [object[]] $User
    )

    process {
        $User |
            Where-Object Enabled |
            Select-Object Name, UserPrincipalName
    }
}
```

Die Funktion kennt weder Active Directory noch Dateisystem oder E-Mail. Diese Abhängigkeiten werden außerhalb orchestriert.

## Erster Test

Dateiname: `Get-EnabledUserSummary.Tests.ps1`

```powershell
BeforeAll {
    . "$PSScriptRoot/Get-EnabledUserSummary.ps1"
}

Describe 'Get-EnabledUserSummary' {
    It 'liefert nur aktivierte Benutzer' {
        $users = @(
            [pscustomobject]@{ Name = 'Ada';  UserPrincipalName = 'ada@example.com'; Enabled = $true }
            [pscustomobject]@{ Name = 'Grace'; UserPrincipalName = 'grace@example.com'; Enabled = $false }
        )

        $result = $users | Get-EnabledUserSummary

        $result | Should -HaveCount 1
        $result.Name | Should -Be 'Ada'
    }
}
```

Ausführen:

```powershell
Invoke-Pester -Path . -Output Detailed
```

## Struktur eines Tests

| Block | Zweck |
|---|---|
| `BeforeAll` | einmalige Vorbereitung |
| `Describe` | getestete Einheit oder Verhalten |
| `Context` | Szenario oder Ausgangslage |
| `BeforeEach` | frischer Zustand vor jedem Test |
| `It` | eine konkrete Erwartung |
| `AfterEach` | Cleanup nach jedem Test |

Ein `It`-Block sollte bei einem Fehler klar sagen, welches Verhalten gebrochen ist.

## Fehlerpfade testen

```powershell
function Get-RequiredSetting {
    param([hashtable] $Configuration, [string] $Name)

    if (-not $Configuration.ContainsKey($Name)) {
        throw "Pflichteinstellung fehlt: $Name"
    }

    return $Configuration[$Name]
}

Describe 'Get-RequiredSetting' {
    It 'wirft bei fehlender Einstellung' {
        { Get-RequiredSetting -Configuration @{} -Name 'Endpoint' } |
            Should -Throw '*Endpoint*'
    }
}
```

Die ScriptBlock-Klammern sind wichtig: Pester muss den Aufruf selbst ausführen, um den Fehler beobachten zu können.

## Mocks gezielt einsetzen

```powershell
function Restart-UnhealthyService {
    param([string] $Name)

    $service = Get-Service -Name $Name -ErrorAction Stop

    if ($service.Status -ne 'Running') {
        Restart-Service -Name $Name -ErrorAction Stop
        return $true
    }

    return $false
}

Describe 'Restart-UnhealthyService' {
    BeforeEach {
        Mock Get-Service {
            [pscustomobject]@{ Status = 'Stopped' }
        }
        Mock Restart-Service
    }

    It 'startet einen gestoppten Dienst neu' {
        Restart-UnhealthyService -Name 'Example' | Should -BeTrue
        Should -Invoke Restart-Service -Times 1 -Exactly -ParameterFilter {
            $Name -eq 'Example'
        }
    }
}
```

Mocks gehören an Systemgrenzen: Netzwerk, Zeit, Dateisystem, externe Cmdlets. Interne Hilfsfunktionen vollständig zu mocken koppelt Tests oft zu eng an die Implementierung.

## Testdaten und temporäre Dateien

Pester stellt `$TestDrive` als isoliertes temporäres Laufwerk bereit:

```powershell
It 'liest eine Konfigurationsdatei' {
    $path = Join-Path $TestDrive 'config.json'
    '{"enabled":true}' | Set-Content -Path $path

    $result = Get-Content $path -Raw | ConvertFrom-Json

    $result.enabled | Should -BeTrue
}
```

Tests sollten nicht von `C:\temp`, Benutzerprofilen oder bereits installierten Tools abhängen.

## Code Coverage mit Augenmaß

Coverage findet ungetestete Pfade, beweist aber keine Qualität. Ein Test, der jede Zeile ausführt und nichts Sinnvolles behauptet, erzeugt nur eine schöne Zahl.

Priorität:

1. kritische Geschäfts- oder Betriebsregeln,
2. Fehler- und Recovery-Pfade,
3. Eingabevalidierung,
4. Integrationen an Systemgrenzen,
5. erst danach reine Prozentoptimierung.

## Pester in GitHub Actions

```yaml
name: powershell-tests

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Pester
        shell: pwsh
        run: Install-Module Pester -Force -Scope CurrentUser
      - name: Run tests
        shell: pwsh
        run: Invoke-Pester -Path . -CI -Output Detailed
```

Für reproduzierbare CI sollte die freigegebene Pester-Version kontrolliert werden, statt unbemerkt immer die neueste Hauptversion zu installieren.

## Testpyramide für Automation

- viele schnelle Tests für pure Funktionen,
- einige Integrationstests gegen temporäre Ressourcen,
- wenige End-to-End-Tests in einer isolierten Umgebung,
- regelmäßige Restore-, Berechtigungs- und Fehlerproben.

## Anti-Patterns

- Tests benötigen das persönliche Benutzerprofil.
- produktive Systeme werden als Testumgebung verwendet.
- jeder interne Funktionsaufruf wird gemockt.
- nur Erfolgsfälle werden geprüft.
- Tests teilen veränderlichen globalen Zustand.
- Assertions prüfen die Implementierung statt das Ergebnis.
- flakey Tests werden einfach wiederholt statt repariert.

## Review-Checkliste

- [ ] Sind Ein- und Ausgaben der Funktion klar?
- [ ] Werden Systemgrenzen injiziert oder kontrolliert?
- [ ] Ist jeder Test unabhängig und deterministisch?
- [ ] Sind Fehler- und Grenzfälle enthalten?
- [ ] Nutzen Dateitests `$TestDrive`?
- [ ] Prüfen Mocks relevante Interaktionen mit Parametern?
- [ ] Läuft die Suite lokal und in CI gleich?
- [ ] Ist die Pester-Hauptversion kontrolliert?

## Weiterführende Quellen

- [Pester Quick Start](https://pester.dev/docs/quick-start)
- [Pester Test File Structure](https://pester.dev/docs/usage/test-file-structure)
- [Invoke-Pester](https://pester.dev/docs/commands/Invoke-Pester)

Grundlage: [Fehlerbehandlung & Logging](./powershell-fehlerbehandlung).
