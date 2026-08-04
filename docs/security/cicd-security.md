---
title: CI/CD absichern
description: GitHub Actions, Runner, Tokens, Environments und Deployments mit minimalem Vertrauen betreiben.
---

# CI/CD absichern – die Pipeline ist Produktionsinfrastruktur

Eine CI/CD-Pipeline kann Code signieren, Images veröffentlichen, Infrastruktur verändern und Produktionsdaten erreichen. Wer die Pipeline kontrolliert, kontrolliert häufig den gesamten Lieferweg.

<div class="tag-row"><span class="tag">CI/CD</span><span class="tag">Least Privilege</span><span class="tag">Runner</span><span class="tag">OIDC</span></div>

## Bedrohungsmodell

Angriffsflächen sind unter anderem:

- bösartige Änderung im Pull Request,
- kompromittierte Drittanbieter-Action,
- überprivilegiertes Workflow-Token,
- langlebiger Self-hosted Runner,
- geleaktes Repository- oder Environment-Secret,
- manipulierte Abhängigkeit,
- ungeprüftes Artefakt zwischen Build und Deploy,
- unsichere Verarbeitung von Branch-, Issue- oder PR-Daten.

## Token-Rechte explizit machen

```yaml
permissions:
  contents: read

jobs:
  release:
    permissions:
      contents: read
      packages: write
      id-token: write
```

Rechte gehören an den kleinsten Job, der sie benötigt. Ein Testjob braucht normalerweise keinen Schreibzugriff auf Pakete oder Repository-Inhalte.

## Untrusted Input behandeln

Werte wie Branch-Name, Issue-Titel oder Pull-Request-Body sind Eingaben eines potenziellen Angreifers. Sie dürfen nicht ungequotet in Shell-Code interpoliert werden.

Riskant:

```yaml
- run: echo "${{ github.event.pull_request.title }}"
```

Besser über eine Umgebungsvariable und korrektes Quoting:

```yaml
- name: Print title
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: printf '%s\n' "$PR_TITLE"
```

Noch besser ist es, untrusted Text gar nicht in ausführbare Shell-Kontexte zu überführen.

## `pull_request_target` mit Vorsicht

Dieser Trigger läuft im Kontext des Ziel-Repositories und kann auf Secrets sowie ein schreibendes Token zugreifen. Wird danach ungeprüfter Code des Pull Requests ausgecheckt und ausgeführt, entsteht ein direkter Secret-Diebstahlpfad.

Sichere Nutzung beschränkt sich auf Aufgaben, die keinen PR-Code ausführen, etwa Labels oder Kommentare mit eng begrenzten Rechten.

## Drittanbieter-Actions

Prüffragen:

- Wer pflegt die Action?
- Welche Rechte und Eingaben benötigt sie?
- Läuft Node-, Docker- oder Composite-Code?
- Ist die Version auf einen Commit-SHA gepinnt?
- Gibt es automatisierte Updates und Review?
- Kann die Funktion durch wenige Shell-Zeilen ersetzt werden?

Weniger Abhängigkeiten bedeuten weniger Supply-Chain-Fläche. Gleichzeitig sollte komplexe Sicherheitslogik nicht leichtfertig selbst implementiert werden.

## Runner isolieren

GitHub-gehostete Runner sind für jeden Job frisch. Self-hosted Runner brauchen eigene Schutzmaßnahmen:

- ephemer statt dauerhaft wiederverwenden,
- ein Job pro Instanz,
- Netzwerksegmentierung,
- keine allgemeinen Cloud-Metadatenrechte,
- kein Docker Socket aus untrusted Jobs,
- sauberes Image und automatisches Recycling,
- getrennte Runner-Gruppen für Vertrauenszonen.

Öffentliche Repositories sollten untrusted Pull Requests niemals automatisch auf privilegierten Self-hosted Runnern ausführen.

## Environments als Sicherheitsgrenze

GitHub Environments können:

- Reviewer verlangen,
- erlaubte Branches begrenzen,
- Secrets nur für den Deployment-Job freigeben,
- Wartezeiten oder organisatorische Regeln abbilden.

Produktion sollte ein eigenes Environment sein. Der Job erhält dessen Secrets erst, nachdem alle Regeln erfüllt sind.

## OIDC statt Cloud-Key

Langfristige Cloud-Schlüssel in Secrets lassen sich durch föderierte Identität ersetzen:

```yaml
permissions:
  contents: read
  id-token: write
```

Die Vertrauensregel beim Provider sollte Claims begrenzen, zum Beispiel:

- genaues Repository,
- Produktions-Environment,
- erlaubter Branch oder Tag,
- erwarteter Workflow.

Nur `repo:organization/*` zu erlauben ist oft zu breit.

## Build und Deploy trennen

Der Build verarbeitet untrusted Quellcode und braucht möglichst keine Produktionsrechte. Deployment verarbeitet ein bereits geprüftes Artefakt und braucht keine Compiler oder Package-Installationen.

```text
Build (low trust) → signiertes Artefakt → Verify → Deploy (high trust)
```

Zwischen den Stufen werden Digest, Signatur und Provenance geprüft.

## Secrets und Logs

Maskierung ist eine letzte Schutzschicht, keine Garantie. Transformierte, gekürzte oder codierte Werte können die automatische Maskierung umgehen.

- kein `set -x` in Secret-Schritten,
- keine kompletten Umgebungs-Dumps,
- Outputs auf minimale Werte begrenzen,
- Debug-Artefakte vor Upload prüfen,
- Aufbewahrung sensibler Logs reduzieren,
- Rotationsprozess für versehentliche Ausgabe bereithalten.

## Schutzregeln für Workflow-Dateien

- CODEOWNERS für `.github/workflows/**`,
- Pflichtreview durch Plattform- oder Security-Owner,
- Ruleset gegen Direkt-Push,
- wiederverwendbare Workflows zentral versionieren,
- Änderungen an Berechtigungen im Diff besonders hervorheben.

## Security-Checkliste

- [ ] Workflow- und Job-Rechte sind minimal.
- [ ] Untrusted Input landet nicht direkt in Shell-Code.
- [ ] `pull_request_target` führt keinen PR-Code aus.
- [ ] Drittanbieter-Actions sind geprüft und gepinnt.
- [ ] Self-hosted Runner sind ephemer und segmentiert.
- [ ] Produktion nutzt ein geschütztes Environment.
- [ ] Cloud-Zugriff verwendet OIDC und enge Claims.
- [ ] Build und Deployment sind getrennte Vertrauenszonen.
- [ ] Artefakte werden per Digest und Herkunft geprüft.
- [ ] Workflow-Änderungen brauchen besondere Owner.

## Weiterführende Quellen

- [GitHub – Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub – OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)
- [OWASP CI/CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)

Grundlage dazu: [GitHub Actions CI/CD](../devops/github-actions-cicd).
