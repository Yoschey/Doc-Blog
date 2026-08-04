---
title: Observability
description: Logs, Metriken, Traces und SLOs als gemeinsame Diagnosebasis nutzen.
---

# Observability – Systeme so bauen, dass sie Antworten geben

Monitoring zeigt, ob bekannte Bedingungen eintreten. Observability hilft zusätzlich bei Fragen, die vorher noch niemand als Alarm formuliert hat. Dafür müssen Anwendungen aussagekräftige Telemetrie erzeugen und Zusammenhänge über Prozess- und Servicegrenzen erhalten.

<div class="tag-row"><span class="tag">Logs</span><span class="tag">Metrics</span><span class="tag">Traces</span><span class="tag">SLO</span><span class="tag">OpenTelemetry</span></div>

## Die Signale

| Signal | Gute Frage | Beispiel |
|---|---|---|
| Metrik | Wie oft oder wie viel? | Fehlerrate, Latenz, Queue-Länge |
| Log | Was ist an einem Punkt passiert? | strukturierter Fehler mit Kontext |
| Trace | Wo verbrachte eine Anfrage Zeit? | Spans über API, Worker und DB |
| Profil | Welche Codepfade verbrauchen Ressourcen? | CPU- oder Speicherprofil |

Kein Signal ersetzt die anderen. Eine Metrik erkennt die erhöhte Latenz, ein Trace lokalisiert den langsamen Dienst, und ein Log erklärt den konkreten Fehler.

## Von der Nutzererwartung zum SLO

Ein Service Level Indicator (SLI) misst beobachtbares Verhalten. Ein Service Level Objective (SLO) setzt ein Ziel.

Beispiel:

- **SLI:** Anteil erfolgreicher Checkout-Anfragen unter 800 ms.
- **SLO:** 99,9 % in einem rollierenden 30-Tage-Fenster.
- **Error Budget:** 0,1 % dürfen das Ziel verfehlen.

Das Error Budget macht Zuverlässigkeit zu einer Produktentscheidung. Wird es schnell verbraucht, haben Stabilitätsarbeit und Risikoreduktion Vorrang vor weiteren Änderungen.

## RED und USE

Für anfragebasierte Dienste hilft RED:

- **Rate:** Anfragen pro Zeit.
- **Errors:** fehlgeschlagene Anfragen.
- **Duration:** Verteilung der Latenz.

Für Ressourcen hilft USE:

- **Utilization:** Auslastung.
- **Saturation:** Warteschlangen oder Engpässe.
- **Errors:** Fehler der Ressource.

Diese Modelle verhindern Dashboards mit hundert zufälligen Diagrammen ohne Diagnosewert.

## Strukturierte Logs

```json
{
  "timestamp": "2026-08-04T08:30:00Z",
  "level": "error",
  "service": "checkout-api",
  "environment": "production",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "event": "payment_authorization_failed",
  "provider": "example-pay",
  "duration_ms": 1240,
  "error_type": "timeout"
}
```

Gute Logs sind maschinenlesbar und enthalten stabil benannte Felder. Schlechte Logs sind Sätze ohne Kontext oder riesige Objekt-Dumps.

Niemals loggen:

- Passwörter und Tokens,
- vollständige Session-Cookies,
- private Schlüssel,
- unnötige personenbezogene Daten,
- komplette Request- oder Response-Bodies ohne Filter.

## Kardinalität verstehen

Labels wie `service`, `environment` und `status_code` haben begrenzte Werte. `user_id`, `request_id` oder freie URLs erzeugen dagegen potenziell Millionen Zeitreihen.

Regel:

- begrenzte Dimensionen in Metriken,
- einzelne Identitäten in Logs und Traces,
- Trace-ID als Korrelation zwischen Signalen.

Hohe Kardinalität erhöht Kosten, Speicher und Abfragezeit und kann das Monitoring selbst destabilisieren.

## Distributed Tracing

Ein Trace besteht aus Spans. Jeder Span beschreibt eine Operation, Zeitdauer, Status und Attribute. Context Propagation trägt Trace-Informationen über HTTP, Messaging und Prozessgrenzen weiter.

Sinnvolle Span-Attribute:

- Service und Operation,
- Zielsystem,
- Status und Fehlerart,
- fachlich relevante, aber nicht sensible Kategorie,
- Retry-Anzahl,
- Queue- oder Batch-Kontext.

Nicht jede Anfrage muss dauerhaft vollständig gespeichert werden. Sampling reduziert Volumen. Fehler und besonders langsame Traces sollten bevorzugt erhalten bleiben.

## Alarmierung, die Menschen respektiert

Ein Alarm braucht:

1. konkrete Nutzer- oder Geschäftsrelevanz,
2. eine verantwortliche Rolle,
3. ein Runbook,
4. eine erwartete Reaktionszeit,
5. genügend Kontext für den ersten Schritt.

Alarme auf CPU allein sind oft schwach. Eine hohe CPU bei guten Nutzerwerten kann normal sein. SLO-Burn-Rate-Alerts verbinden dagegen Fehlerrate und Zeitfenster mit einem echten Zuverlässigkeitsziel.

## Diagnosekette bei einer Störung

1. **Impact:** Welche Nutzerfunktion ist betroffen?
2. **Zeit:** Wann begann die Abweichung?
3. **Änderung:** Welches Deployment oder Konfigurationsereignis liegt davor?
4. **Signal:** Rate, Fehler und Latenz vergleichen.
5. **Trace:** langsame oder fehlerhafte Pfade untersuchen.
6. **Logs:** konkrete Fehler im Trace-Kontext lesen.
7. **Ressource:** Sättigung und Abhängigkeiten prüfen.
8. **Maßnahme:** kleinste sichere Eindämmung ausführen.

## Einführungsplan

- kritische Nutzerpfade benennen,
- für jeden Pfad SLI und Ziel definieren,
- strukturierte Logs standardisieren,
- Trace-Kontext durch die wichtigsten Dienste tragen,
- wenige RED/USE-Dashboards bauen,
- Runbooks an handlungsfähige Alerts hängen,
- Telemetrie-Kosten und Aufbewahrung regelmäßig prüfen.

## Typische Anti-Patterns

- „Alles loggen“ ohne Datenklassifizierung.
- Dashboard pro Team statt pro Nutzerpfad.
- Durchschnittslatenz statt Perzentile und Verteilung.
- Alarm ohne Owner oder Handlung.
- Trace-ID wird an einer Queue-Grenze verloren.
- Telemetrie-System ist nicht selbst überwacht.
- Erfolg wird als „Agent installiert“ statt bessere Diagnosezeit gemessen.

## Weiterführende Quellen

- [OpenTelemetry – Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [OpenTelemetry Signals](https://opentelemetry.io/docs/concepts/signals/)
- [Context Propagation](https://opentelemetry.io/docs/concepts/context-propagation/)
- [OpenTelemetry Instrumentation](https://opentelemetry.io/docs/concepts/instrumentation/)

Passende Vorlage: [Incident-Checkliste](../examples/incident-checkliste).
