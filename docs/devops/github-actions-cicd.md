---
title: GitHub Actions CI/CD
description: Robuste Workflows für Build, Test, Artefakte und sichere Deployments entwerfen.
---

# GitHub Actions CI/CD – vom Workflow zur Lieferstrecke

GitHub Actions automatisiert Aufgaben rund um ein Repository. Der eigentliche Wert entsteht aber nicht durch möglichst viel YAML, sondern durch eine Pipeline, die bei jeder Änderung schnell und nachvollziehbar dieselben Qualitätsregeln anwendet.

<div class="tag-row"><span class="tag">CI/CD</span><span class="tag">GitHub</span><span class="tag">Automation</span><span class="tag">OIDC</span></div>

## Das mentale Modell

Eine Workflow-Datei liegt unter `.github/workflows/` und besteht aus vier Ebenen:

| Ebene | Aufgabe | Beispiel |
|---|---|---|
| Event | Startet den Workflow | Pull Request, Push, Zeitplan |
| Workflow | Beschreibt den Gesamtprozess | CI, Release, Deployment |
| Job | Läuft auf einem Runner | Test, Build, Security Scan |
| Step | Führt Action oder Kommando aus | Checkout, `npm ci`, Test |

Jobs laufen standardmäßig parallel. Abhängigkeiten werden mit `needs` explizit modelliert. Das macht die Pipeline schneller und verhindert versteckte Reihenfolgen.

## Ein belastbarer Node-Workflow

```yaml
name: ci

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test --if-present
      - run: npm run build
```

Wichtige Details:

- `permissions` beginnt minimal und wird nur pro Job erweitert.
- `npm ci` installiert exakt den Lockfile-Zustand und verändert ihn nicht.
- `timeout-minutes` verhindert hängende Runner.
- `concurrency` beendet veraltete Läufe desselben Branches.
- Caching beschleunigt Downloads, ersetzt aber niemals den Lockfile.

::: warning Fremde Actions sind ausführbarer Code
In sicherheitskritischen Repositories sollten Actions auf einen vollständigen Commit-SHA gepinnt und automatisiert aktualisiert werden. Ein bewegliches Tag wie `@v4` ist bequem, aber weniger streng kontrolliert.
:::

## Pipeline in Stufen schneiden

Eine gute Lieferstrecke trennt unabhängige Entscheidungen:

1. **Validate:** Formatierung, statische Analyse und schnelle Tests.
2. **Build:** reproduzierbares Artefakt erzeugen.
3. **Verify:** Integrationstests, Scan und Signatur.
4. **Deploy staging:** technische Bereitstellung ohne Produktionsfreigabe.
5. **Deploy production:** geschützte Umgebung mit Freigaberegeln.

```yaml
jobs:
  build:
    # erzeugt ein unveränderliches Artefakt

  deploy-staging:
    needs: build
    environment: staging

  deploy-production:
    needs: deploy-staging
    environment: production
    if: github.ref == 'refs/heads/main'
```

Das gleiche Artefakt sollte durch alle Umgebungen wandern. Ein erneuter Build vor Produktion kann trotz identischem Commit ein anderes Ergebnis erzeugen.

## Artefakte statt Zufallszustand

Ein Artefakt ist das Ergebnis eines Builds: Paket, Container-Image, statische Website oder Prüfbericht. Es braucht mindestens:

- eine eindeutige Versions- oder Commit-Zuordnung,
- eine Prüfsumme,
- eine definierte Aufbewahrungsdauer,
- nachvollziehbare Build-Eingaben,
- möglichst eine Signatur oder Provenance.

Temporäre Dateien zwischen Jobs gehören in ein Workflow-Artefakt. Abhängigkeiten gehören in einen Cache. Diese beiden Mechanismen lösen unterschiedliche Probleme.

## Wiederverwendbare Workflows

Wenn mehrere Repositories denselben Prozess verwenden, sollte nicht überall YAML kopiert werden. Ein Workflow mit `workflow_call` definiert eine gemeinsame Schnittstelle:

```yaml
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '20'
    secrets:
      registry-token:
        required: false
```

Die zentrale Vorlage sollte versioniert werden. Änderungen an ihr sind Plattformänderungen und brauchen Review, Tests und eine Migrationsstrategie.

## Secrets vermeiden: OIDC verwenden

Für Cloud-Deployments sind langfristige Zugangsschlüssel in Repository-Secrets unnötig riskant. Mit OpenID Connect kann der Workflow ein kurzlebiges Token anfordern. Die Cloud prüft dabei Claims wie Repository, Branch und Environment.

Das Zielbild:

1. GitHub stellt eine signierte Identität für den konkreten Job aus.
2. Der Cloud-Provider prüft eine vorher definierte Vertrauensregel.
3. Der Job erhält zeitlich und fachlich begrenzte Rechte.
4. Nach dem Lauf bleibt kein langlebiger Schlüssel zurück.

## Pull Requests sinnvoll schützen

Branch Protection oder Rulesets sollten mindestens erzwingen:

- Pull Request statt Direkt-Push,
- erfolgreiche Pflichtchecks,
- aktuellen Branch vor dem Merge,
- Review für sensible Bereiche,
- keine Umgehung durch normale Projektrollen.

CODEOWNERS kann für `.github/workflows/**`, Infrastruktur und Security-Konfiguration zusätzliche Reviewer verlangen.

## Typische Anti-Patterns

| Anti-Pattern | Problem | Besser |
|---|---|---|
| Ein riesiger Job | kein Parallelismus, schlechte Diagnose | kleine Jobs mit klaren Outputs |
| `permissions: write-all` | unnötig großer Schaden bei Kompromittierung | minimale Rechte je Job |
| Build in jeder Umgebung | nicht reproduzierbare Releases | einmal bauen, Artefakt promoten |
| Geheimnisse in Logs | dauerhafte Kopien in fremdem Kontext | Maskierung, OIDC, keine Debug-Ausgabe |
| Deploy bei jedem PR | unkontrollierter Ressourcenverbrauch | Preview mit Limits und Cleanup |
| Nur Happy-Path-Tests | falsches Sicherheitsgefühl | Fehler-, Rollback- und Timeout-Pfade testen |

## Review-Checkliste

- [ ] Sind Events und Branch-Filter eng genug?
- [ ] Beginnen Token-Rechte mit `contents: read`?
- [ ] Sind externe Actions vertrauenswürdig und versioniert?
- [ ] Ist der Lockfile Teil des Builds?
- [ ] Werden Artefakte nur einmal gebaut?
- [ ] Haben Jobs Timeouts und sinnvolle Concurrency?
- [ ] Sind Produktionsumgebungen geschützt?
- [ ] Können langlebige Secrets durch OIDC ersetzt werden?
- [ ] Existiert ein getesteter Rollback-Weg?

## Weiterführende Quellen

- [GitHub Actions – Grundlagen](https://docs.github.com/en/actions)
- [Workflow-Syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [OpenID Connect in GitHub Actions](https://docs.github.com/en/actions/concepts/security/openid-connect)
- [Sichere Nutzung von GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use)

## Nächster Schritt

Nach einer stabilen CI-Pipeline lohnt sich der Blick auf [Container-Grundlagen](./container-grundlagen) und [CI/CD Security](../security/cicd-security).
