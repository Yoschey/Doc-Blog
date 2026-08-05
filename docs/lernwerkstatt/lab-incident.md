---
title: "Lab 5: Incident Response"
description: Eine simulierte Störung mit Rollen, Timeline, Diagnose, Wiederherstellung und Review bearbeiten.
learning:
  level: Übung · Aufbau
  duration: 120 Minuten
  goals:
    - Incident-Rollen und Kommunikationsrhythmus anwenden.
    - Auswirkung begrenzen und Ursachenanalyse auseinanderhalten.
    - eine faktenbasierte Timeline und konkrete Folgeaufgaben erstellen.
  terms: [Incident, Severity, Timeline, Mitigation, Postmortem]
  practice: Führt die Simulation mit mindestens drei Personen durch. Eine Person beobachtet ausschließlich Kommunikation, Entscheidungsprotokoll und Sicherheitsgrenzen.
  next: /examples/incident-checkliste
---

# Lab 5: Incident Response

## Ziel

Dieses Tabletop-Lab benötigt kein Produktivsystem. Das Team reagiert auf schrittweise freigegebene Informationen, führt eine Timeline und entscheidet unter Zeitdruck. Bewertet werden Klarheit, Belege und sichere Koordination – nicht Heldentum.

## Rollen

- **Incident Commander:** priorisiert, verteilt Arbeit und hält Überblick.
- **Technical Lead:** koordiniert Diagnose und Wiederherstellung.
- **Communications Lead:** erstellt regelmäßige, verständliche Updates.
- **Observer:** notiert Prozessbeobachtungen, greift aber nicht fachlich ein.

Bei drei Personen können Technical und Communications Lead kombiniert werden.

## Ausgangslage

> Dienstag, 09:05 Uhr. Der Checkout einer fiktiven Shop-Anwendung meldet erhöhte Fehlerraten. Das Dashboard zeigt seit wenigen Minuten mehr HTTP 502. Ein Deployment wurde um 08:55 Uhr abgeschlossen.

Das Team hat eine Architektur aus Load Balancer, zwei App-Instanzen und einer Datenbank. Es gibt keine echten Systeme; alle weiteren Daten werden durch die Spielleitung als Karten oder Chatnachrichten geliefert.

## Injects für die Spielleitung

Gib den nächsten Hinweis nur frei, wenn das Team eine passende Frage oder Messung formuliert.

1. **09:08:** 502-Rate 22 %, nur Checkout betroffen; Produktseiten funktionieren.
2. **09:12:** Eine App-Instanz meldet Datenbank-Timeouts, die andere nicht.
3. **09:16:** Das Deployment enthielt eine neue Connection-Pool-Konfiguration.
4. **09:20:** Auf Instanz B ist der Maximalwert `5`, auf Instanz A `50`.
5. **09:25:** Traffic kann kontrolliert von Instanz B genommen werden.
6. **09:30:** Nach Herausnahme sinkt die Fehlerquote auf 0,4 %.
7. **09:40:** Die frühere Konfiguration ist versioniert; ein korrigiertes Deployment wäre möglich.

## Aufgaben des Teams

### Erkennen und einordnen

- Symptom und Auswirkung präzise formulieren.
- vorläufige Severity mit Begründung setzen.
- Rollen und Kommunikationskanal festlegen.
- Zeitpunkt des nächsten Updates nennen.

### Diagnostizieren

- Fakten und Hypothesen sichtbar trennen.
- mindestens zwei plausible Hypothesen führen.
- pro Hypothese eine unterscheidende Messung nennen.
- Änderungen seit dem letzten gesunden Zustand prüfen.

### Stabilisieren

- Mitigation mit Risiko, Owner, Rückweg und Erfolgsmetrik beschreiben.
- Vor Ausführung eine zweite Person prüfen lassen.
- nach der Maßnahme Nutzerwirkung und Systemsignale verifizieren.

### Kommunizieren

Jedes Update enthält:

```text
Status:
Auswirkung:
Aktuelle Maßnahmen:
Nächster Schritt:
Nächstes Update:
```

Keine unbestätigte Ursache als Tatsache kommunizieren.

## Timeline-Vorlage

| Zeit | Beobachtung/Entscheidung | Quelle | Owner |
|---|---|---|---|
| 09:05 | Alarm zu HTTP 502 | Dashboard | Monitoring |
| … | … | … | … |

## Abschluss

Der Incident darf erst beendet werden, wenn:

- Nutzerfunktion mit derselben Messung wieder gesund ist,
- temporäre Maßnahme und aktueller Systemzustand dokumentiert sind,
- Bereitschaft oder Service Owner informiert ist,
- Folgearbeit einen Owner hat.

## Mini-Postmortem

Beantwortet ohne Schuldzuweisung:

1. Welche technischen und organisatorischen Faktoren ermöglichten die Störung?
2. Welche Schutzmaßnahme hätte früh erkannt oder begrenzt?
3. Welche Information fehlte während der Reaktion?
4. Welche zwei Maßnahmen haben das beste Verhältnis aus Wirkung und Aufwand?
5. Wie wird die Wirksamkeit dieser Maßnahmen später geprüft?

## Bewertungsbeobachtung

Der Observer achtet auf:

- klare Rollen statt paralleler Führung,
- dokumentierte Entscheidungen,
- Trennung von Fakt und Vermutung,
- kleine, reversible Maßnahmen,
- feste Update-Zeiten,
- psychologische Sicherheit und respektvolle Sprache.

Nutze zusätzlich die [Incident-Checkliste](../examples/incident-checkliste).
