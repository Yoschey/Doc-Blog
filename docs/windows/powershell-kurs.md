# ⚙️ Umfassender Kurs: **PowerShell für DevOps-Engineers**

> Ein praxisorientierter Kurs für erfahrene IT-Professionals, Entwickler und DevOps-Engineers mit Bash-, Python- oder C#-Erfahrung, die PowerShell produktiv im Automatisierungs- und Infrastrukturumfeld einsetzen möchten.

---

## 📘 Kursübersicht

### 🎯 Lernziele

Nach Abschluss dieses Kurses kannst du:

- PowerShell als vollwertige Automatisierungssprache einsetzen

- Pipelines, CI/CD-Prozesse und Infrastruktur-Tasks mit PowerShell steuern

- Azure DevOps, Git, Docker und APIs mit PowerShell automatisieren

- Skripte modular, testbar und wiederverwendbar aufbauen

- Cross-Plattform PowerShell (Windows, Linux, macOS) sicher verwenden

---

## 🧭 Kapitel 1: PowerShell im DevOps-Kontext

### Warum PowerShell?

- Cross-Plattform seit PowerShell 7 (Core)
- Objektbasiert (nicht textbasiert wie Bash)
- Vollwertige Sprache mit .NET-Unterbau
- Native Integration in Windows & Azure
- Ideal für CI/CD, Infrastructure-as-Code und API-Integration

### Unterschiede zu Bash

| Konzept | Bash | PowerShell |
|----------|------|-------------|
| Datenmodell | Text | Objekte |
| Pipes | Zeichenketten | Objekte mit Typen |
| Schleifen | `for`, `while` | `foreach`, `ForEach-Object` |
| Funktionen | Shell Functions | Cmdlets, Funktionen, Module |
| Typensystem | Schwach | Stark (.NET) |

**Beispiel:**

```bash

# Bash

ps aux | grep nginx

# PowerShell

Get-Process | Where-Object { $_.ProcessName -eq "nginx" }

```

---

## 💻 Kapitel 2: PowerShell Core & Umgebung

### Installation

```bash

# macOS (Homebrew)

brew install --cask powershell

# Ubuntu / Debian

sudo apt install -y powershell

```

### Start

```bash

pwsh

```

### Version prüfen

```powershell

$PSVersionTable

```

### Module verwalten

```powershell

Get-Module -ListAvailable

Install-Module Az -Scope CurrentUser

Import-Module Az

```

---

## 🧩 Kapitel 3: Syntax & Sprachgrundlagen

### Variablen

```powershell

$Name = "DevOps Engineer"

$Count = 42

```

### Arrays & HashTables

```powershell

$Numbers = @(1, 2, 3, 4)

$User = @{ Name="Tobi"; Role="Admin"; Active=$true }

```

### Schleifen

```powershell

foreach ($num in $Numbers) {

    Write-Host "Zahl: $num"

}

```

### Bedingungen

```powershell

if ($User.Active) {

    Write-Host "$($User.Name) ist aktiv"

} else {

    Write-Host "Inaktiv"

}

```

---

## ⚙️ Kapitel 4: Pipeline & Objektfluss

PowerShells größtes Feature: **Objektbasierte Pipeline**.

```powershell

Get-Service | Where-Object { $_.Status -eq "Running" } | Sort-Object Name

```

Jedes Cmdlet gibt **Objekte** weiter – du kannst Eigenschaften direkt ansprechen:

```powershell

(Get-Process pwsh).Id

```

---

## 🧠 Kapitel 5: Funktionen, Module & Wiederverwendung

### Funktion definieren

```powershell

function Get-Greeting {

    param([string]$Name)

    return "Hello $Name!"

}

```

### Module erstellen

```bash

mkdir MyModule

cd MyModule

New-ModuleManifest -Path MyModule.psd1 -RootModule MyModule.psm1 -Author "You"

```

**Laden & testen:**

```powershell

Import-Module ./MyModule.psd1

Get-Module MyModule

```

---

## 🧰 Kapitel 6: PowerShell im DevOps-Alltag

### Beispiel: CI/CD Skripte in Azure DevOps

```powershell

Write-Host "##vso[task.setvariable variable=BuildVersion]1.0.$(Build.BuildId)"

```

### API Calls (REST)

```powershell

$uri = "https://api.github.com/repos/microsoft/PowerShell"

$response = Invoke-RestMethod -Uri $uri -Method GET

$response.stargazers_count

```

### JSON & YAML verarbeiten

```powershell

$data = Get-Content data.json | ConvertFrom-Json

Install-Module powershell-yaml

$data = Get-Content config.yml | ConvertFrom-Yaml

```

---

## 🐳 Kapitel 7: PowerShell + Docker, Git & CLI Tools

### Docker CLI

```powershell

docker ps | ConvertFrom-Csv

```

### Git Automation

```powershell

git status

Start-Process git -ArgumentList "pull" -NoNewWindow -Wait

```

---

## ☁️ Kapitel 8: Azure & Cloud-Automatisierung

### Azure Login

```powershell

Connect-AzAccount

```

### Ressourcen abrufen

```powershell

Get-AzResourceGroup

Get-AzVM

```

### Neue Ressource erstellen

```powershell

New-AzResourceGroup -Name "rg-demo" -Location "westeurope"

```

---

## 🧪 Kapitel 9: Testing & Qualitätssicherung

### Pester (Testing Framework)

```powershell

Install-Module Pester -Scope CurrentUser

Describe "Test Add-Function" {

    It "adds two numbers" {

        Add 2 3 | Should -Be 5

    }

}

```

### Linting & Style

```bash

Install-Module PSScriptAnalyzer

Invoke-ScriptAnalyzer .\scripts\

```

---

## 🧬 Kapitel 10: CI/CD-Pipelines mit PowerShell

### Beispiel: Build Script

```powershell

Write-Host "Starte Build..."

dotnet build src/ --configuration Release

```

### Beispiel: Pipeline YAML

```yaml

steps:

  - powershell: |

      ./scripts/build.ps1

    displayName: "Run Build Script"

```

---

## 🧠 Kapitel 11: Logging, Fehlerbehandlung, Robustheit

### Try/Catch

```powershell

try {

    Get-Content missing.txt

} catch {

    Write-Host "Fehler: $($_.Exception.Message)"

}

```

### Logging

```powershell

Start-Transcript -Path logs/session.log

Stop-Transcript

```

### Exit Codes für CI/CD

```powershell

if ($error.Count -gt 0) { exit 1 }

```

---

## 🧩 Kapitel 12: Cross-Plattform & Integration mit Linux/Unix

PowerShell 7 läuft auf macOS & Linux – du kannst:
- Shell-Kommandos (ls, grep, cat) direkt nutzen
- Shell-Skripte mit `.sh` kombinieren
- Dateien via `bash` oder `pwsh` ausführen

```bash

pwsh -File ./deploy.ps1

```

Oder innerhalb PowerShell:

```powershell

bash ./install.sh

```

---

## 🏁 Kapitel 13: Best Practices für DevOps mit PowerShell

✅ Modularisierung – kleine, wiederverwendbare Funktionen  

✅ Logging & Error Handling in jeder Pipeline  

✅ Keine Hardcoded Secrets (nutze Azure Key Vault oder SecretStore)  

✅ Skripte versionieren (Git)  

✅ Code-Analyse (PSScriptAnalyzer + Pester)  

✅ Cross-Platform testen (Linux, macOS, Windows)

---

## 📚 Kapitel 14: Ressourcen & Weiterführendes

| Thema | Quelle |
|--------|--------|
| PowerShell Doku | [https://learn.microsoft.com/powershell](https://learn.microsoft.com/powershell) |
| PowerShell Gallery | [https://www.powershellgallery.com](https://www.powershellgallery.com) |
| Pester Tests | [https://github.com/pester/Pester](https://github.com/pester/Pester) |
| PowerShell + Azure | [https://learn.microsoft.com/azure/developer/powershell](https://learn.microsoft.com/azure/developer/powershell) |
| PowerShell Blog | [https://devblogs.microsoft.com/powershell](https://devblogs.microsoft.com/powershell) |

---

© 2025 – PowerShell for DevOps Course