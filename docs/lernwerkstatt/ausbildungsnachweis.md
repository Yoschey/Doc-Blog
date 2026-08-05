---
title: Vorlage für den Ausbildungsnachweis
description: Lernaktivitäten aus dem DevOps-Lernplan fachlich und ausbildungsgeeignet dokumentieren.
learning:
  level: Vorlage
  duration: 15 Minuten
  goals:
    - Tätigkeit, Lernziel und Lernergebnis voneinander unterscheiden.
    - technische Arbeit knapp und nachvollziehbar dokumentieren.
    - Datenschutz und Arbeitssicherheit sichtbar berücksichtigen.
  terms: [Ausbildungsnachweis, Lernziel, Tätigkeit, Reflexion, Datenschutz]
  practice: Fülle die Vorlage direkt nach einem Praxis-Lab aus und lasse eine fachfremde Person prüfen, ob Ziel, Vorgehen und Ergebnis verständlich sind.
  next: /lernwerkstatt/
---

# Vorlage für den Ausbildungsnachweis

Kopiere den folgenden Block pro Lernaktivität. Interne Hostnamen, Kundendaten, Secrets und sicherheitsrelevante Details gehören nicht in den Nachweis.

```markdown
## Lernaktivität: [kurzer Titel]

**Datum / Zeitraum:**
**Ausbildungsbereich:**
**Betreuung / Review:**
**Zeitaufwand:**

### Lernziel

Ich wollte lernen, …

### Ausgangslage

Die Aufgabe bestand darin, …
Verwendet wurde ausschließlich … [lokale/freigegebene Testumgebung].

### Durchgeführte Tätigkeiten

1. …
2. …
3. …

### Fachlicher Zusammenhang

Der Zusammenhang zwischen … und … ist …
Der wichtigste Fachbegriff war …, weil …

### Ergebnis und Prüfung

Das Ergebnis war …
Ich habe den Erfolg geprüft mit …

### Fehler und Lösungsweg

Aufgetreten ist …
Meine Hypothese war …
Die Messung … hat gezeigt, dass …

### Sicherheit, Datenschutz und Rückweg

- verwendete Testdaten:
- benötigte Berechtigungen:
- betrachtetes Risiko:
- Rückweg / Aufräumen:

### Reflexion

Gut funktioniert hat …
Beim nächsten Mal würde ich …
Als Nächstes möchte ich … lernen.

### Review

Feedback der betreuenden Person:
Vereinbarter nächster Schritt:
```

## Beispiel für eine gute Formulierung

Statt:

> Ich habe Git gemacht und einen Fehler behoben.

Besser:

> Ich habe in einem lokalen Git-Repository zwei gleichzeitige Dateiänderungen mit der Staging Area in getrennte Commits aufgeteilt. Anschließend habe ich einen Merge-Konflikt fachlich aufgelöst und mit `git diff`, `git status` und dem gerenderten Markdown geprüft. Dabei habe ich verstanden, dass ein Branch ein beweglicher Zeiger auf einen Commit ist und nicht einfach eine zweite Ordnerkopie.

## Prüffragen vor der Abgabe

- Ist erkennbar, **was ich selbst getan** habe?
- Habe ich erklärt, **warum** die Schritte nötig waren?
- Enthält der Text einen überprüfbaren Erfolgsnachweis?
- Habe ich Fehler und Erkenntnis statt nur das Endergebnis beschrieben?
- Sind Datenschutz, Rechte und Rückweg berücksichtigt?
- Habe ich interne Namen, Zugangsdaten und unnötige Sicherheitsdetails entfernt?

::: tip Kurz und konkret
Ein guter Nachweis muss kein Roman sein. Ein bis zwei präzise Absätze mit Fachzusammenhang und Reflexion sind wertvoller als eine lange Liste kopierter Befehle.
:::
