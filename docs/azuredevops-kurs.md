# 💠 Umfassender Kurs zu **Azure DevOps Pipelines**

> Ein praxisorientierter Komplettkurs für Einsteiger und Fortgeschrittene, die mit Azure DevOps Pipelines CI/CD-Prozesse aufbauen, automatisieren und verwalten wollen.

---

## 📘 Kursübersicht

### 🎯 Lernziele

Nach Abschluss dieses Kurses kannst du:

- CI/CD-Konzepte verstehen und praktisch anwenden

- YAML-basierte Azure DevOps Pipelines erstellen

- Build-, Test- und Release-Pipelines konfigurieren

- Artefakte und Umgebungen verwalten

- Variable Groups, Secrets und Templates einsetzen

- Multi-Stage-Pipelines und Deployments automatisieren

- Integration mit Git, Docker, Kubernetes, Terraform und Azure Cloud nutzen

---

## 🧭 Kapitel 1: Einführung in Azure DevOps

### Was ist Azure DevOps?

Azure DevOps ist Microsofts Plattform für den gesamten Software-Lifecycle. Sie kombiniert:

- **Azure Repos** (Quellcodeverwaltung mit Git)

- **Azure Pipelines** (CI/CD)

- **Azure Boards** (Agile Planung, Backlogs, Kanban)

- **Azure Artifacts** (Pakete & Abhängigkeiten)

- **Azure Test Plans** (Testmanagement)

### Vorteile von Azure Pipelines

- YAML-basiert → Infrastructure as Code  

- Multi-Plattform (Windows, Linux, macOS)  

- Integriert mit GitHub, Bitbucket, Azure Repos  

- Cloud-gehostet oder Self-Hosted Agents  

- Kostenlose Minuten (bis 1.800/Monat für OSS)

---

## ⚙️ Kapitel 2: Grundlagen Continuous Integration (CI)

### CI-Konzepte

Continuous Integration bedeutet, Code regelmäßig zu integrieren und automatisiert zu testen.  

**Ziel:** Fehler frühzeitig erkennen.

**Typischer CI-Ablauf:**

1. Code wird in Repository gepusht  

2. Pipeline triggert Build  

3. Tests laufen automatisch  

4. Artefakt wird erzeugt (z. B. .zip, .dll, .jar)

### YAML-Grundstruktur

```yaml

trigger:

  - main

pool:

  vmImage: 'ubuntu-latest'

steps:

  - script: echo "Hello, Azure DevOps!"

    displayName: 'Beispiel-Task'

```

### Erste Pipeline anlegen

1. In Azure DevOps: **Pipelines → New Pipeline**

2. Quelle wählen: *Azure Repos, GitHub, Bitbucket*

3. Pipeline-Konfiguration: *YAML*

4. Datei `.azure-pipelines.yml` im Repo erstellen

---

## 🔧 Kapitel 3: Pipeline-Aufbau und Syntax

### Wichtige YAML-Abschnitte

| Abschnitt   | Beschreibung                                                   |
| ----------- | -------------------------------------------------------------- |
| `trigger`   | Definiert, wann die Pipeline ausgeführt wird                   |
| `pool`      | Wählt Agent-Typ (Windows, Linux, macOS)                        |
| `variables` | Definiert Variablen                                            |
| `steps`     | Enthält Tasks, Scripte oder Vorlagen                           |
| `stages`    | Gruppiert Steps in logische Phasen (z. B. Build, Test, Deploy) |
| `jobs`      | Parallel laufende Einheiten innerhalb einer Stage              |

### Beispiel mit Variablen und mehreren Jobs

```yaml

trigger:

  - main

variables:

  buildConfiguration: 'Release'

stages:

- stage: Build

  jobs:

  - job: BuildApp

    steps:

    - script: dotnet build --configuration $(buildConfiguration)

      displayName: 'Build .NET Anwendung'

- stage: Test

  dependsOn: Build

  jobs:

  - job: RunTests

    steps:

    - script: dotnet test

      displayName: 'Unit Tests ausführen'

```

---

## 🧰 Kapitel 4: Tasks, Agents & Artefakte

### Tasks

Tasks sind die Arbeitsschritte einer Pipeline.  

Beispiele:

- `Bash@3` → Bash-Script ausführen  

- `PowerShell@2` → PowerShell-Command  

- `DotNetCoreCLI@2` → .NET-Builds und Tests  

- `PublishBuildArtifacts@1` → Artefakte veröffentlichen  

### Agents

Azure stellt **gehostete Agents** bereit oder du kannst eigene **Self-Hosted Agents** konfigurieren.

```bash

# Beispiel: Self-Hosted Agent installieren

./config.sh --url https://dev.azure.com/<org> --auth pat --token <TOKEN>

sudo ./svc.sh install

sudo ./svc.sh start

```

### Artefakte

Artefakte sind Build-Ergebnisse, die zwischen Stages geteilt werden.  

Beispiel:

```yaml

- task: PublishBuildArtifacts@1

  inputs:

    PathtoPublish: 'dist'

    ArtifactName: 'drop'

```

---

## 🧩 Kapitel 5: Variablen, Secrets & Templates

### Variablen

Inline oder in Gruppen definiert:

```yaml

variables:

  environment: 'dev'

```

### Variable Groups

Azure DevOps → Pipelines → Library → *Variable Groups*  

Verwende z. B. API-Keys, Passwörter, etc.

### Secrets

In der Variable Group `Keep this value secret` aktivieren.  

Zugriff:

```yaml

- script: echo $(mySecretVar)

```

### Templates

Für wiederverwendbare YAML-Komponenten:

```yaml

# build.yml

steps:

  - script: npm ci

  - script: npm run build

# azure-pipelines.yml

extends:

  template: build.yml

```

---

## 🚀 Kapitel 6: Multi-Stage Pipelines (Build → Test → Deploy)

Beispiel:

```yaml

stages:

- stage: Build

  jobs:

  - job: build

    steps:

    - script: npm install && npm run build

      displayName: 'Build Projekt'

- stage: Test

  dependsOn: Build

  jobs:

  - job: test

    steps:

    - script: npm test

      displayName: 'Run Unit Tests'

- stage: Deploy

  dependsOn: Test

  condition: succeeded()

  jobs:

  - deployment: deployWeb

    environment: production

    strategy:

      runOnce:

        deploy:

          steps:

          - script: echo "Deploying to Production"

```

---

## ☁️ Kapitel 7: Deployments mit Azure (Web Apps, Containers, Terraform)

### Azure Web App Deployment

```yaml

- task: AzureWebApp@1

  inputs:

    azureSubscription: 'my-service-connection'

    appType: 'webApp'

    appName: 'myapp-prod'

    package: '$(System.DefaultWorkingDirectory)/drop/*.zip'

```

### Terraform Integration

```yaml

- task: TerraformCLI@1

  inputs:

    command: 'apply'

    workingDirectory: 'infra/'

```

### Kubernetes (AKS)

```yaml

- task: Kubernetes@1

  inputs:

    connectionType: 'Azure Resource Manager'

    azureSubscription: 'my-azure-sub'

    namespace: 'default'

    command: 'apply'

    arguments: '-f k8s/deployment.yaml'

```

---

## 🧠 Kapitel 8: Erweiterte Themen

### Matrix Builds

```yaml

strategy:

  matrix:

    Linux:

      imageName: 'ubuntu-latest'

    Windows:

      imageName: 'windows-latest'

```

### Conditional Steps

```yaml

- script: echo "Nur auf main"

  condition: eq(variables['Build.SourceBranch'], 'refs/heads/main')

```

### Caching

```yaml

- task: Cache@2

  inputs:

    key: 'npm | "$(Agent.OS)" | package-lock.json'

    path: 'node_modules'

    restoreKeys: |

      npm | "$(Agent.OS)"

```

### Notifications

Integration mit Teams oder Slack per Webhook:

```yaml

- task: SlackNotification@1

  inputs:

    text: 'Build erfolgreich abgeschlossen!'

```

---

## 📦 Kapitel 9: Artefakte & Releases

- **Build-Artefakte** → Zwischenergebnisse (z. B. ZIPs, DLLs)

- **Release-Pipelines** → Deployment mit Genehmigungen & Gates

- **Environments** → Dev, Test, Stage, Prod (mit RBAC & Approval Flow)

**Beispiel-Release-Pipeline (klassisch):**

1. Build-Artefakt aus CI übernehmen  

2. Deployment Stage „Dev“ → automatisiert  

3. Stage „Prod“ → mit Approval durch Teamlead

---

## 🔒 Kapitel 10: Sicherheit, Compliance & Governance

### Zugriffskontrolle

- **RBAC** (Rollenbasiert) für Projekte, Environments, Service Connections  

- **Service Principals** für Cloud Deployments  

### Sicherheitsfeatures

- Secrets in Key Vault speichern  

- Pipeline Permissions für Service Connections einschränken  

- Branch Policies für Pull Requests aktivieren

---

## 🧭 Kapitel 11: Praktische Beispiele

### 1️⃣ .NET Build & Test

```yaml

trigger:

  - main

pool:

  vmImage: 'windows-latest'

steps:

  - task: UseDotNet@2

    inputs:

      packageType: 'sdk'

      version: '8.0.x'

  - script: dotnet build --configuration Release

  - script: dotnet test

```

### 2️⃣ Node.js Build + Docker Push

```yaml

steps:

  - task: Docker@2

    inputs:

      command: 'buildAndPush'

      repository: 'myapp'

      dockerfile: 'Dockerfile'

      containerRegistry: 'myContainerRegistry'

```

### 3️⃣ MkDocs + PDF-Export (aus vorherigem Beispiel)

```yaml

steps:

  - task: UsePythonVersion@0

    inputs:

      versionSpec: '3.12'

  - script: pip install -r requirements.txt

  - script: ENABLE_PDF_EXPORT=1 mkdocs build

  - task: PublishBuildArtifacts@1

    inputs:

      PathtoPublish: 'site'

```

---

## 🏁 Kapitel 12: Best Practices & Troubleshooting

### Best Practices

- YAML-Pipelines versionieren (Code = Dokumentation)

- Wiederverwendbare Templates

- Stages klein und modular halten

- Tests früh & automatisiert ausführen

- Artefakte signieren

- Secrets niemals hardcoden

### Troubleshooting

| Problem | Ursache | Lösung |
|----------|----------|--------|
| Pipeline hängt bei Checkout | Rechte auf Repo fehlen | Service Connection prüfen |
| "Permission Denied" | Agent läuft mit falschem Benutzer | Agent-Konfiguration prüfen |
| Build findet keine Dependencies | Cache oder Pfad falsch | Cache-Schlüssel und Pfade anpassen |
| YAML Syntaxfehler | Falsche Einrückung | `yamllint` oder Online Validator nutzen |

---

## 🎓 Abschluss

Herzlichen Glückwunsch!  

Du hast die Grundlagen, die fortgeschrittenen Konzepte und Best Practices für **Azure DevOps Pipelines** gelernt.  

Damit kannst du komplette CI/CD-Workflows automatisieren und produktiv einsetzen.

**Nächste Schritte:**

- Erstelle eigene Multi-Stage Pipelines

- Binde Tests, Deployments und Infrastructure-as-Code ein

- Nutze Pipelines als Baustein für DevOps-Automatisierung

---

📚 **Empfohlene Ressourcen**

- [Offizielle Microsoft-Dokumentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops)

- [YAML Schema Reference](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)

- [Azure CLI für DevOps](https://learn.microsoft.com/en-us/cli/azure/devops)

- [Best Practices für Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/pipeline-best-practices)

---

© 2025 – DevOps Training Guide by Yoschey  
