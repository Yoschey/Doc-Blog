---
title: Runbook-Vorlage
description: Wiederverwendbare Vorlage für sichere, nachvollziehbare Betriebsaufgaben.
---

# Runbook-Vorlage

Ein Runbook macht wiederkehrende Arbeit ausführbar, ohne dass die Person alle historischen Details kennen muss. Es beschreibt Ziel, Voraussetzungen, Sicherheitsgrenzen, Verifikation und Rückweg – nicht nur eine Liste von Kommandos.

<div class="tag-row"><span class="tag">Template</span><span class="tag">Operations</span><span class="tag">Runbook</span><span class="tag">Change</span></div>

## Kopiervorlage

```markdown
# [Titel der Aufgabe]

## Metadaten

| Feld | Wert |
|---|---|
| Owner | [Team / Rolle] |
| Letzte Prüfung | [YYYY-MM-DD] |
| Gültig für | [System / Umgebung / Version] |
| Risiko | [niedrig / mittel / hoch] |
| Geschätzte Dauer | [Minuten] |
| Wartungsfenster | [erforderlich / nicht erforderlich] |

## Ziel

[Welcher überprüfbare Endzustand soll erreicht werden?]

## Nicht im Scope

- [bewusste Abgrenzung]
- [verwandte, aber getrennte Aufgabe]

## Voraussetzungen

- [Berechtigung / Rolle]
- [erforderliches Tool und Version]
- [Backup oder Snapshot]
- [Ticket / Freigabe / Kommunikationskanal]
- [bekannter Ausgangszustand]

## Sicherheitsgrenzen

- Abbruch, wenn: [messbares Kriterium]
- Niemals: [gefährliche Aktion oder breite Zielauswahl]
- Secrets: [sicherer Bezugsweg, nicht der Wert]
- Vier-Augen-Prinzip bei: [kritischer Schritt]

## Pre-Checks

1. [Zielsystem eindeutig identifizieren]
2. [aktuellen Zustand und Version erfassen]
3. [Kapazität / Health / Replikation prüfen]
4. [Backup verifizieren]
5. [Rollback-Voraussetzungen bestätigen]

## Durchführung

### Schritt 1 – [Name]

Zweck: [Warum ist dieser Schritt nötig?]

```shell
[Kommando mit sicheren Platzhaltern]
```

Erwartetes Ergebnis:

```text
[wichtige Ausgabe oder Zustand]
```

Abbruch, wenn: [konkrete Bedingung]

### Schritt 2 – [Name]

[gleiches Muster]

## Verifikation

- [ ] technischer Health Check erfolgreich
- [ ] fachlicher Smoke Test erfolgreich
- [ ] Fehler- und Latenzmetriken normal
- [ ] Logs ohne neue relevante Fehler
- [ ] Zielversion / Zielzustand bestätigt
- [ ] Monitoring bleibt für [Zeitraum] stabil

## Rollback

Auslöser:

- [Fehlerrate über Grenzwert]
- [Smoke Test fehlschlägt]
- [Dauer überschreitet Limit]

Schritte:

1. [weitere Änderungen stoppen]
2. [vorherigen Zustand wiederherstellen]
3. [Datenkompatibilität prüfen]
4. [Health und Smoke Test]
5. [Stakeholder informieren]

## Kommunikation

| Zeitpunkt | Empfänger | Inhalt |
|---|---|---|
| vor Beginn | [Kanal] | Scope, Risiko, Startzeit |
| bei Abweichung | [Kanal] | Impact, Maßnahme, nächstes Update |
| nach Ende | [Kanal] | Ergebnis, Verifikation, Follow-ups |

## Nachbereitung

- [ ] Ticket mit Ergebnis aktualisiert
- [ ] Logs / Screenshots / Metriken verlinkt
- [ ] temporäre Berechtigungen entfernt
- [ ] Backup-Aufbewahrung geklärt
- [ ] Runbook mit neuen Erkenntnissen verbessert
- [ ] technische Schulden als Aufgaben erfasst
```

## Gute Platzhalter

Platzhalter müssen auffallen und einen Datentyp implizieren:

```text
<ENVIRONMENT: dev|staging|production>
<HOSTNAME: exact-fqdn>
<CHANGE_TICKET: CHG-1234>
<BACKUP_ID: verified-snapshot-id>
```

Schlecht sind unauffällige Werte wie `server1`, die versehentlich unverändert ausgeführt werden.

## Sichere Kommandobeispiele

### Ziel zuerst anzeigen

```bash
target='<EXACT_TARGET>'
printf 'Target: %s\n' "$target"
```

### Leere oder gefährliche Ziele ablehnen

```bash
[[ -n $target ]] || { echo 'Target is empty' >&2; exit 1; }
[[ $target != '/' ]] || { echo 'Refusing root target' >&2; exit 1; }
```

### Read-only vor Write

```bash
tool plan --target "$target"
# Ergebnis prüfen und erst dann:
tool apply --target "$target"
```

### Maschinenlesbare Verifikation

```bash
curl --fail --silent --show-error \
  --connect-timeout 5 \
  --max-time 15 \
  'https://service.example/health'
```

## Runbooks testen

Ein Runbook ist ausführbarer Betriebs-Code. Es braucht regelmäßige Proben:

- neue Teammitglieder führen es in einer Testumgebung aus,
- Kommandos werden nach Versionsupdates geprüft,
- Rollback wird wirklich durchgeführt,
- Zeitbedarf wird gemessen,
- unklare Schritte werden sofort verbessert,
- veraltete Runbooks werden archiviert statt still liegen gelassen.

## Qualitätskriterien

Ein fremdes Teammitglied kann:

1. das richtige Ziel eindeutig bestimmen,
2. Risiken und Abbruchkriterien vor Beginn erklären,
3. jeden Schritt ohne implizites Wissen ausführen,
4. Erfolg mit objektiven Signalen belegen,
5. bei Fehlern einen sicheren Rückweg starten,
6. das Ergebnis nachvollziehbar dokumentieren.

## Anti-Patterns

- „Bei Problemen Admin fragen“ ohne Eskalationsweg.
- Kommandos ohne erwartete Ausgabe.
- Rollback lautet nur „Backup einspielen“.
- Secret-Werte direkt im Dokument.
- relative Pfade oder breite Wildcards bei destruktiven Schritten.
- Health Check prüft nur, ob ein Prozess existiert.
- Runbook endet direkt nach dem letzten Write-Kommando.

## Verwandte Seiten

- [Incident-Checkliste](./incident-checkliste)
- [Smoke Tests](../smoketest)
- [Observability](../devops/observability)
