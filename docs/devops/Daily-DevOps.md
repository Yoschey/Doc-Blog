---
title: Daily DevOps
description: Eine sichere Tagesroutine für Betrieb, Änderungen, Automatisierung und kontinuierliche Verbesserung.
learning:
  level: Einstieg · Praxis
  duration: 35 Minuten
  goals:
    - tägliche Betriebsarbeit nach Risiko und Nutzerwirkung priorisieren.
    - Routine, Störung, Änderung und Verbesserung unterscheiden.
    - kleine Automatisierungen mit Verifikation und Ownership planen.
  terms: [Triage, Change, Runbook, Alert, Automatisierung]
  practice: Beobachte einen Arbeitstag und ordne jede ungeplante Aufgabe einer Kategorie zu. Wähle anschließend eine wiederholte manuelle Tätigkeit und beschreibe sicheren Automatisierungsvertrag, Test und Rückweg.
  check:
    - question: Was hat morgens Vorrang vor neuen Änderungen?
      answer: Aktive Störungen, kritische Sicherheitsereignisse und unbehandelte Nutzerbeeinträchtigungen.
    - question: Wann lohnt sich Automatisierung?
      answer: Wenn ein Ablauf wiederholt, regelbasiert und messbar ist und Fehlerkosten sowie Pflegeaufwand die Umsetzung rechtfertigen.
    - question: Warum braucht auch eine Routineaufgabe einen Owner?
      answer: Ohne Verantwortung veralten Zeitplan, Berechtigungen, Abhängigkeiten und Fehlerbehandlung unbemerkt.
  next: /grundlagen/ci-cd-grundlagen
---

# Daily DevOps – ein Arbeitstag mit System

DevOps-Alltag besteht nicht nur aus Pipelines und Containern. Ein großer Teil ist das bewusste Steuern von Änderungen: Signale prüfen, Arbeit priorisieren, kleine sichere Schritte ausführen und wiederkehrende Reibung beseitigen.

## Tagesstart: erst Lagebild, dann neue Arbeit

Eine kompakte 15-Minuten-Routine:

1. aktive Incidents und Übergaben aus der Bereitschaft lesen,
2. kritische Alerts auf Owner und Status prüfen,
3. fehlgeschlagene Deployments, Backups und geplante Jobs kontrollieren,
4. heutige Changes und Wartungsfenster überblicken,
5. Risiken, Blocker und Verantwortliche im Team abgleichen.

Das ist keine Einladung, jedes Dashboard zu öffnen. Prüfe Signale, die eine Entscheidung auslösen.

## Arbeit richtig einordnen

| Kategorie | Beispiel | Reaktion |
|---|---|---|
| Incident | Nutzer können nicht bestellen | koordinieren, Wirkung begrenzen, kommunizieren |
| Security Event | verdächtige Token-Nutzung | nach Security-Prozess einstufen und eindämmen |
| Change | neue Version ausrollen | Plan, Review, Verifikation, Rückweg |
| Service Request | neue Berechtigung | Identität, Bedarf, Freigabe und Ablaufdatum prüfen |
| Problem | Fehler tritt wiederholt auf | Ursachenfaktoren und nachhaltige Maßnahme untersuchen |
| Verbesserung | manuelle Routine automatisieren | Nutzen, Vertrag, Test und Ownership definieren |

Dringlichkeit und Lautstärke sind nicht dasselbe. Eine laute Einzelanfrage kann weniger kritisch sein als ein still ausfallendes Backup.

## Vor jeder Änderung

Beantworte fünf Fragen:

1. Was ist der gewünschte Endzustand?
2. Welche Systeme oder Nutzer können betroffen sein?
3. Welche Voraussetzungen und Freigaben fehlen noch?
4. Wie wird Erfolg gemessen?
5. Was ist der Rückweg und wann wird er ausgelöst?

Ein Change ohne Verifikation ist nur eine ausgeführte Aktion.

## Kleine Automatisierungen mit großem Nutzen

Gute Einstiegskandidaten:

- Backup-Erfolg und Alter des letzten Restore-Tests melden,
- Ablaufdaten von Zertifikaten und Secrets überwachen,
- wiederkehrende Konfiguration validieren,
- Log- und Speicheraufbewahrung kontrollieren,
- API-Healthchecks mit Status, Inhalt und Latenz ausführen,
- Drift zwischen gewünschtem und tatsächlichem Zustand erkennen,
- Standardreports aus strukturierten Daten erzeugen,
- temporäre Lab-Ressourcen nach Ablauf abbauen.

Nicht jede manuelle Tätigkeit sollte sofort automatisiert werden. Ein seltener, unklarer und riskanter Ablauf braucht zunächst Standardisierung und ein Runbook.

## Vertrag einer Automatisierung

Für jedes Skript oder jeden Job dokumentieren:

| Punkt | Frage |
|---|---|
| Eingang | Welche Parameter, Dateien, APIs und Identitäten werden benötigt? |
| Ausgang | Welcher Zustand oder welches Artefakt entsteht? |
| Erfolg | Welche Messung und welcher Exit Code gelten als erfolgreich? |
| Fehler | Wie werden Teilfehler, Timeouts und Wiederholungen behandelt? |
| Idempotenz | Was passiert beim zweiten Lauf? |
| Sicherheit | Welche minimalen Rechte und Daten sind nötig? |
| Betrieb | Wer erhält einen Alert und welches Runbook gilt? |
| Lebenszyklus | Wer pflegt Abhängigkeiten und entfernt den Job später? |

## Beispiel: API-Prüfung

Eine gute Prüfung fragt nicht nur „Port offen?“:

```bash
response_file="$(mktemp)"
trap 'rm -f "$response_file"' EXIT

if curl --silent --show-error --fail \
  --connect-timeout 3 --max-time 10 \
  --output "$response_file" \
  https://example.test/health; then
  jq -e '.status == "ok"' "$response_file" >/dev/null
else
  printf 'health request failed\n' >&2
  exit 1
fi
```

Für Produktion fehlen je nach Umgebung noch Authentisierung, Zertifikatsanforderungen, Retry-Entscheidung, Telemetrie und ein kontrolliertes Ziel. Das Beispiel zeigt den Vertrag: enger Timeout, klarer Fehler und fachliche Inhaltsprüfung.

## Während des Tages: WIP begrenzen

Viele parallele Aufgaben verlängern die Durchlaufzeit und erschweren Übergaben. Halte sichtbar:

- aktuell bearbeitete Änderung,
- blockierende Abhängigkeit,
- nächste überprüfbare Lieferung,
- verantwortliche Person,
- spätesten Entscheidungspunkt.

Beende kleine Arbeit, bevor du weitere beginnst. Ungeplante Arbeit wird nicht „nebenbei“ unsichtbar erledigt, sondern erfasst und priorisiert.

## Tagesabschluss

- laufende Changes und Incidents sauber übergeben,
- temporäre Zugänge und Ressourcen entfernen,
- Pipeline- oder Jobfehler nicht ohne Owner liegen lassen,
- neue Erkenntnisse in Runbook oder Ticket sichern,
- eine wiederkehrende Reibung für spätere Verbesserung notieren.

## Wöchentliche Verbesserung

Wähle nicht zehn Optimierungen gleichzeitig. Eine nützliche Retrospektivfrage lautet:

> Welche wiederkehrende Wartezeit oder Fehlerquelle können wir diese Woche messbar verkleinern?

Beispiele für Erfolg:

- Pipelinefeedback von 18 auf 8 Minuten,
- Anteil unklarer Alerts reduziert,
- Restore-Test automatisiert und nachgewiesen,
- Standard-Change mit weniger manuellen Übergaben,
- Runbook nach echter Nutzung korrigiert.

## Verwandte Artikel

- [Was ist DevOps?](/grundlagen/was-ist-devops)
- [Systematisches Troubleshooting](/grundlagen/troubleshooting)
- [Runbook-Vorlage](/examples/runbook-vorlage)
- [Incident-Checkliste](/examples/incident-checkliste)
