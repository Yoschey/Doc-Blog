---
title: Git-Grundlagen für den Teamalltag
description: Repository, Working Tree, Stage, Commit, Branch und Remote sicher unterscheiden und anwenden.
learning:
  level: Einstieg
  duration: 40 Minuten
  goals:
    - Working Tree, Staging Area und Repository unterscheiden.
    - einen kleinen Branch- und Pull-Request-Workflow ausführen.
    - Änderungen vor Commit und Push gezielt kontrollieren.
  terms: [Repository, Commit, Branch, Remote, Pull Request]
  practice: Lege ein Übungs-Repository an, ändere zwei Dateien, stage nur eine davon und erkläre mit git diff sowie git diff --staged, was in den nächsten Commit gelangt.
  check:
    - question: Was speichert ein Commit?
      answer: Einen unveränderlichen Snapshot der versionierten Dateien samt Metadaten und Verweis auf den oder die Vorgänger.
    - question: Warum ist git fetch oft sicherer zum Prüfen als ein sofortiges git pull?
      answer: Fetch lädt Remote-Informationen, verändert aber den aktuellen Branch noch nicht. Die Differenz kann zuerst geprüft werden.
    - question: Was gehört nicht in ein Repository?
      answer: Secrets, private Schlüssel, produktive Zugangsdaten, große generierte Artefakte und lokale Abhängigkeiten.
  next: /lernwerkstatt/lab-git
---

# Git-Grundlagen für den Teamalltag

Git ist eine verteilte Versionsverwaltung. Jeder Clone enthält die Projektgeschichte und kann lokal Branches, Commits und Vergleiche erzeugen. GitHub, GitLab oder Azure Repos stellen zusätzlich Zusammenarbeit, Reviews, Rechte und Automatisierung bereit – sie sind nicht Git selbst.

## Das mentale Modell

| Bereich | Enthält | Typischer Befehl |
|---|---|---|
| Working Tree | deine sichtbaren, noch nicht vorgemerkten Änderungen | `git diff` |
| Staging Area | genau die Änderungen für den nächsten Commit | `git add`, `git diff --staged` |
| lokales Repository | gespeicherte Commits und Branches | `git commit`, `git log` |
| Remote-Repository | gemeinsam erreichbare Referenzen | `git fetch`, `git push` |

Ein Commit ist kein „Speichern“-Knopf für beliebige Zwischenstände. Er sollte eine verständliche, zusammengehörige Änderung enthalten.

## Ein Repository anlegen

```bash
mkdir git-lab
cd git-lab
git init
git branch -M main
printf '# Git-Lab\n' > README.md
git add README.md
git commit -m "docs: start git lab"
```

Vor jedem Commit lohnt sich diese Reihenfolge:

```bash
git status --short
git diff
git add README.md
git diff --staged
git commit -m "docs: explain lab purpose"
```

`git status` zeigt **welche** Dateien betroffen sind. `git diff` zeigt **wie** sie sich ändern. Beides beantwortet unterschiedliche Fragen.

## Branches richtig verstehen

Ein Branch ist ein beweglicher Name für einen Commit. Das Erstellen ist günstig:

```bash
git switch -c docs/add-troubleshooting-note
```

Arbeite mit kurzen Branches, die ein klares Ziel haben. Je länger ein Branch lebt, desto wahrscheinlicher weicht er vom Zielbranch ab und erzeugt schwer verständliche Konflikte.

```bash
git log --oneline --decorate --graph --all
```

Der Befehl zeigt die Geschichte als Graph. Ein Merge verbindet zwei Entwicklungslinien; ein Rebase setzt Commits auf eine neue Basis. Rebase verändert Commit-Identitäten und sollte bei bereits gemeinsam genutzten Branches nur nach Teamregel erfolgen.

## Remote, Fetch, Pull und Push

```bash
git remote -v
git fetch origin
git log --oneline HEAD..origin/main
git diff HEAD...origin/main
```

- `fetch` lädt Referenzen und Objekte, integriert sie aber nicht in deinen Branch.
- `pull` kombiniert Fetch mit Merge oder Rebase – abhängig von der Konfiguration.
- `push` veröffentlicht lokale Commits und verschiebt einen Remote-Branch.

Prüfe vor dem Push:

```bash
git status
git log --oneline origin/main..HEAD
git diff --check origin/main...HEAD
```

## Pull-Request-Workflow

1. Ziel und Umfang im Issue oder Ticket klären.
2. Aktuelles `main` abrufen.
3. Kurzen, beschreibenden Branch erstellen.
4. Kleine, überprüfbare Commits schreiben.
5. Tests lokal ausführen.
6. Branch pushen und Pull Request öffnen.
7. Kontext, Risiko, Testnachweis und Rückweg beschreiben.
8. Review-Kommentare fachlich bearbeiten.
9. Nach erfolgreicher CI mergen.
10. Deployment und Verhalten beobachten.

Ein Pull Request ist keine reine Freigabemaske. Er konserviert die technische Diskussion und macht Annahmen sichtbar.

## Gute Commit-Nachrichten

```text
fix: handle missing configuration file

Return a clear exit code instead of continuing with defaults.
This prevents deployments with an incomplete configuration.
```

Die erste Zeile beschreibt knapp die Änderung. Der optionale Text erklärt **warum** sie nötig war und welche Konsequenz sie hat. Ticketnummern ersetzen diese Erklärung nicht.

## Konflikte sicher lösen

1. Konfliktdateien mit `git status` ermitteln.
2. Beide Absichten verstehen – nicht nur Marker löschen.
3. Datei in die gewünschte Endform bringen.
4. Tests ausführen.
5. Gelöste Datei mit `git add` markieren.
6. Merge oder Rebase fortsetzen.

```bash
git diff --name-only --diff-filter=U
```

Bei Unsicherheit abbrechen und besprechen. `git merge --abort` oder `git rebase --abort` bringen dich normalerweise zum Zustand vor der Operation zurück.

## Fehler rückgängig machen

| Situation | Sicherer Weg |
|---|---|
| ungespeicherte Änderung verwerfen | Datei und Ziel exakt prüfen, dann `git restore DATEI` |
| Datei versehentlich gestaged | `git restore --staged DATEI` |
| lokalen Commit ergänzen | `git commit --amend`, solange nicht gemeinsam genutzt |
| veröffentlichten Commit neutralisieren | `git revert COMMIT` |
| falscher Inhalt im Remote | neuen Korrektur-Commit erstellen; Geschichte nicht ungeklärt umschreiben |

::: danger Secrets bleiben kompromittiert
Das Löschen eines Secrets im nächsten Commit macht ein bereits veröffentlichtes Secret nicht wieder sicher. Zugang sofort sperren oder rotieren und danach die Repository-Geschichte nach abgestimmtem Verfahren bereinigen.
:::

## `.gitignore` als Hygiene

```text
.env
.env.*
!.env.example
node_modules/
dist/
*.log
.idea/
.vscode/
```

Eine `.gitignore` entfernt keine bereits versionierten Dateien. Sie verhindert nur, dass neue unversionierte Treffer automatisch auftauchen.

## Dein nächster Schritt

Absolviere [Lab 1: Git-Teamworkflow](../lernwerkstatt/lab-git) und dokumentiere dabei jeden Zustandswechsel mit `git status` oder `git log`.

**Primärquellen:** [Git-Dokumentation](https://git-scm.com/docs), [GitHub: About Git](https://docs.github.com/en/get-started/using-git/about-git), [GitHub: Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world)
