---
title: Incident-Checkliste
description: Strukturierter Ablauf für Triage, Kommunikation, Eindämmung und Nachbereitung.
---

# Incident-Checkliste

In einer Störung sinkt die verfügbare Aufmerksamkeit. Eine Checkliste hält das Team bei Impact, Fakten und sicheren Maßnahmen, statt gleichzeitig an zehn unbestätigten Hypothesen zu arbeiten.

<div class="tag-row"><span class="tag">Incident</span><span class="tag">Triage</span><span class="tag">Recovery</span><span class="tag">Postmortem</span></div>

::: danger Sicherheit vor Geschwindigkeit
Bei möglicher Kompromittierung Beweise nicht durch unkoordinierte Neustarts, Log-Löschung oder Neuinstallation zerstören. Security-Verantwortliche früh einbinden.
:::

## Sofort – die ersten zehn Minuten

- [ ] Incident Lead benennen.
- [ ] gemeinsamen Kanal und Protokoll eröffnen.
- [ ] Zeitpunkt in UTC festhalten.
- [ ] Nutzer- und Geschäftsimpact beschreiben.
- [ ] betroffene Dienste, Regionen und Mandanten eingrenzen.
- [ ] Schweregrad vorläufig festlegen.
- [ ] letzte Änderungen und Deployments markieren.
- [ ] nächsten Kommunikationszeitpunkt vereinbaren.

## Rollen

| Rolle | Verantwortung |
|---|---|
| Incident Lead | Prioritäten, Entscheidungen, Gesamtkoordination |
| Operations Lead | technische Diagnose und Maßnahmen |
| Scribe | Timeline, Hypothesen, Befehle und Ergebnisse |
| Communications | Updates für Stakeholder und Statusseite |
| Subject Matter Expert | gezielte Expertise ohne Gesamtführung zu übernehmen |

In kleinen Teams kann eine Person mehrere Rollen tragen. Incident Lead und tiefe technische Arbeit sollten nach Möglichkeit getrennt bleiben.

## Impact beschreiben

Schlecht: „API kaputt“.

Besser:

```text
Seit 08:12 UTC schlagen ca. 35 % der Checkout-Vorgänge in EU-West
mit HTTP 503 fehl. Bestehende Sessions und Produktansicht sind nicht
betroffen. Umsatzrelevanter Impact, Severity 1, nächstes Update 08:30 UTC.
```

Impact enthält:

- betroffene Nutzerfunktion,
- Umfang und Region,
- Beginn,
- messbares Symptom,
- nicht betroffene Bereiche,
- nächste Kommunikation.

## Triage

### Zustand sichern

- [ ] relevante Dashboards und Zeitfenster verlinken,
- [ ] Logs und Audit-Daten vor Ablauf sichern,
- [ ] aktuelle Versionen und Konfiguration erfassen,
- [ ] Infrastruktur- und Deployment-Events notieren,
- [ ] Fehlermeldungen mit Request-/Trace-ID sammeln.

### Diagnosekette

1. Nutzerpfad und Fehlerquote.
2. zeitliche Korrelation mit Änderungen.
3. RED-Signale: Rate, Errors, Duration.
4. Abhängigkeiten und Ressourcen-Sättigung.
5. Traces und konkrete Fehlerlogs.
6. Netzwerk, DNS, Zertifikate und externe Anbieter.

### Hypothesenlog

| Zeit | Hypothese | Test | Ergebnis | Status |
|---|---|---|---|---|
| 08:18 | neues Deployment erhöht DB-Last | Rollout- und Query-Metriken vergleichen | Latenz begann 2 Min. nach Rollout | bestätigt |

Jede Hypothese braucht einen Test. Mehrere gleichzeitige Änderungen machen Ergebnisse unklar.

## Eindämmung

Die kleinste reversible Maßnahme bevorzugen:

- Traffic auf gesunde Instanzen lenken,
- fehlerhaftes Feature deaktivieren,
- Rollout pausieren,
- vorherige kompatible Version aktivieren,
- Rate begrenzen,
- Queue kontrolliert drosseln,
- kompromittierte Identität widerrufen.

Vor jeder Maßnahme dokumentieren:

```text
Ziel:
Erwarteter Effekt:
Risiko:
Abbruchkriterium:
Verifikation:
Rollback:
```

## Kommunikation

### Internes Update

```text
[08:25 UTC] SEV-1 – Checkout EU-West
Impact: 35 % Fehler bei Zahlung.
Aktuell: Rollout pausiert, vorherige Version wird auf 50 % erhöht.
Beobachtung: DB-Latenz korreliert mit Version 2.8.0.
Risiko: Rückwärtskompatibilität des Schemas wird überwacht.
Nächstes Update: 08:40 UTC.
```

### Regeln

- Fakten, Maßnahmen und Unsicherheit trennen.
- keine Schuldzuweisung.
- feste Update-Frequenz auch ohne neue Erkenntnis.
- technische Details an Zielgruppe anpassen.
- Incident Lead bestätigt kritische externe Aussagen.

## Wiederherstellung

- [ ] primäre Nutzerfunktion funktioniert wieder,
- [ ] Fehlerquote und Latenz im Normalbereich,
- [ ] Queue-Backlog baut sich kontrolliert ab,
- [ ] Datenkonsistenz geprüft,
- [ ] abhängige Systeme stabil,
- [ ] keine neue Security- oder Berechtigungsabweichung,
- [ ] Monitoring für erhöhtes Beobachtungsfenster aktiv.

Nicht sofort schließen. Eine kurze Stabilisierungsphase verhindert vorschnelles „Resolved“ bei wiederkehrenden Symptomen.

## Security-spezifische Ergänzung

Bei Verdacht auf Kompromittierung:

- [ ] Incident-Response-/Security-Team aktivieren,
- [ ] betroffene Identitäten und Token widerrufen,
- [ ] Audit-Logs und volatile Daten sichern,
- [ ] Blast Radius und Datenzugriff bestimmen,
- [ ] Angreifer nicht unnötig über Gegenmaßnahmen informieren,
- [ ] rechtliche und regulatorische Meldewege prüfen,
- [ ] forensische Beweiskette dokumentieren.

## Abschlusskriterien

- Impact beendet und bestätigt,
- Ursache oder belastbare Arbeitshypothese dokumentiert,
- temporäre Maßnahmen besitzen Owner und Ablaufdatum,
- Monitoring deckt Wiederauftreten ab,
- Stakeholder erhalten Abschlussmeldung,
- Postmortem-Termin und Verantwortliche stehen.

## Blameless Postmortem

Das Postmortem erklärt, wie das System den Fehler ermöglicht hat – nicht, wer „schuld“ war.

Struktur:

1. Zusammenfassung und Impact.
2. Timeline in UTC.
3. technische und organisatorische beitragende Faktoren.
4. was Erkennung und Reaktion erleichtert hat.
5. was sie erschwert hat.
6. konkrete Maßnahmen mit Owner und Termin.
7. Lernerkenntnisse für andere Systeme.

Gute Maßnahmen verändern das System:

- Test oder Guardrail,
- bessere Telemetrie,
- kleinere Berechtigung,
- automatisierter Rollback,
- Kapazitätsgrenze,
- vereinfachter Betriebsablauf.

„Team soll vorsichtiger sein“ ist keine belastbare Maßnahme.

## Nach dem Incident

- [ ] temporäre Debug- und Admin-Rechte entfernen,
- [ ] Notfallkonfiguration in regulären Sollzustand überführen,
- [ ] Secrets und Zertifikate vollständig rotieren,
- [ ] zusätzliche Logging-Daten datenschutzgerecht löschen,
- [ ] Runbooks aktualisieren,
- [ ] Maßnahmen priorisieren und nachverfolgen,
- [ ] Erkenntnisse teamübergreifend teilen.

## Verwandte Seiten

- [Runbook-Vorlage](./runbook-vorlage)
- [Observability](../devops/observability)
- [Secrets Management](../security/secrets-management)
- [Linux Netzwerkdiagnose](../linux/netzwerkdiagnose)
