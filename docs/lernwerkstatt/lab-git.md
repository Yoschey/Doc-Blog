---
title: "Lab 1: Git-Teamworkflow"
description: Änderungen trennen, Branches vergleichen, Konflikte lösen und einen reviewbaren Pull Request vorbereiten.
learning:
  level: Übung · Einstieg
  duration: 90 Minuten
  goals:
    - Working Tree, Stage und Commit anhand realer Änderungen nachweisen.
    - einen absichtlichen Konflikt fachlich korrekt lösen.
    - einen Pull Request mit Kontext, Test und Risiko vorbereiten.
  terms: [Stage, Commit, Branch, Konflikt, Pull Request]
  practice: Führe das vollständige Lab durch und lasse den Verlauf von einer zweiten Person nur anhand deines Git-Logs und der PR-Beschreibung nachvollziehen.
  next: /grundlagen/netzwerk-grundlagen
---

# Lab 1: Git-Teamworkflow

## Szenario

Zwei Personen ergänzen gleichzeitig ein kleines Betriebs-Runbook. Du sollst deine Änderungen in zwei saubere Commits teilen, eine Änderung aus `main` integrieren und einen bewusst erzeugten Konflikt lösen.

## Voraussetzungen

- Git ist installiert und mit Name/E-Mail für das Lab konfiguriert.
- Du arbeitest in einem neuen lokalen Verzeichnis ohne echte Unternehmensdaten.
- Optional: leeres Test-Repository auf eurer freigegebenen Git-Plattform.

## Sicherheitsgrenzen

- Keine Zugangsdaten in Dateien oder Shell-Historie ablegen.
- Vor `restore`, `reset`, `rebase` oder Löschaktionen das exakte Ziel prüfen.
- Keinen Force-Push auf einen gemeinsam genutzten Branch ausführen.

## Aufgabe A: Änderungen gezielt committen

1. Repository mit `README.md`, `runbook.md` und `.gitignore` anlegen.
2. In `README.md` Ziel und Lernumgebung beschreiben.
3. In `runbook.md` die Überschriften „Symptom“, „Prüfung“, „Maßnahme“ und „Verifikation“ anlegen.
4. Beide Dateien gleichzeitig ändern.
5. Nur die README-Änderung stagen.
6. Mit zwei unterschiedlichen Diff-Befehlen belegen, was gestaged ist und was nicht.
7. Zwei thematisch getrennte Commits erzeugen.

**Abnahme:** `git log --stat --oneline -2` zeigt zwei verständliche Commits; `git status` ist sauber.

## Aufgabe B: Branch vergleichen

1. Branch `docs/add-rollback` erstellen.
2. Abschnitt „Rückweg“ im Runbook ergänzen.
3. Einen Commit erstellen.
4. Branch gegen `main` über Log und Diff vergleichen.

Beantworte in der Dokumentation:

- Welche Commits hat nur dein Branch?
- Welche Zeilen würden in einem Pull Request erscheinen?
- Welche lokalen Dateien sind absichtlich nicht versioniert?

## Aufgabe C: Konflikt kontrolliert erzeugen

1. Auf `main` dieselbe Zeile im Abschnitt „Maßnahme“ ändern und committen.
2. Zum Feature-Branch wechseln und dort diese Zeile anders ändern.
3. `main` in den Feature-Branch integrieren.
4. Den Konflikt nicht mechanisch, sondern anhand des gewünschten Runbooks lösen.
5. Markerfreiheit, Markdown und Git-Zustand prüfen.

**Abnahme:** Erkläre, warum die gewählte Endform beide Absichten korrekt oder bewusst nur eine davon enthält.

## Aufgabe D: Pull Request beschreiben

Erstelle lokal eine Datei `pr-description.md`:

```markdown
## Ziel

## Änderungen

## Testnachweis

## Risiko

## Rückweg

## Offene Fragen
```

Fülle sie so aus, dass eine Person ohne mündlichen Kontext die Änderung reviewen kann.

## Wissenscheck

1. Welcher Befehl zeigt nur vorgemerkte Änderungen?
2. Warum sind zwei kleine Commits hier hilfreicher als ein Sammelcommit?
3. Welche Information lädt `fetch`, ohne deinen aktuellen Branch zu verändern?
4. Wann würdest du `revert` statt einer Geschichtsänderung verwenden?

## Aufräumen

Wenn das Repository ausschließlich für das Lab angelegt wurde, darfst du es nach Abnahme über den normalen, sicheren Löschweg deiner Umgebung entfernen. Ein Remote-Repository nur nach Rücksprache löschen.
