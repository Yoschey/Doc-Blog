---
title: Idempotenz
description: Wiederholbare Operationen für APIs, Automatisierung und verteilte Systeme entwerfen.
---

# Idempotenz – Retries ohne doppelte Nebenwirkung

Eine Operation ist idempotent, wenn dieselbe beabsichtigte Ausführung mehrfach denselben Endzustand erzeugt wie eine einmalige Ausführung. Das ist zentral für Netzwerke und Automation: Nach einem Timeout weiß der Client oft nicht, ob die erste Anfrage angekommen ist.

<div class="tag-row"><span class="tag">Reliability</span><span class="tag">API Design</span><span class="tag">Retries</span><span class="tag">Automation</span></div>

## Einfaches Beispiel

Nicht idempotent:

```bash
echo 'feature=true' >> /etc/example.conf
```

Jeder Lauf hängt eine weitere Zeile an.

Idempotenter:

```bash
grep -Fxq 'feature=true' /etc/example.conf || \
  echo 'feature=true' >> /etc/example.conf
```

Noch besser: den vollständigen Zielinhalt erzeugen, validieren und atomar ersetzen.

## Idempotenz ist eine fachliche Eigenschaft

Zweimal `PUT /users/42` mit demselben Zielzustand kann idempotent sein. Zweimal `POST /payments` kann zwei Zahlungen erzeugen. Ob eine Operation sicher wiederholt werden darf, hängt von ihrer Semantik und ihren Nebenwirkungen ab.

Mögliche Nebenwirkungen:

- Datensatz anlegen,
- Geld abbuchen,
- Nachricht senden,
- Datei anhängen,
- externen Job starten,
- Zähler erhöhen.

## Idempotency Key für Befehle

Ein Client erzeugt pro fachlicher Operation einen eindeutigen Schlüssel:

```http
POST /payments HTTP/1.1
Idempotency-Key: order-4711-payment-v1
Content-Type: application/json

{"orderId":"4711","amount":4990,"currency":"EUR"}
```

Der Server speichert atomar:

- Schlüssel,
- Hash der relevanten Anfrage,
- Status der Verarbeitung,
- Ergebnis oder Referenz,
- Ablaufzeit.

Bei Wiederholung:

- gleicher Schlüssel und gleiche Anfrage → gespeichertes Ergebnis,
- gleicher Schlüssel und anderer Inhalt → Konflikt,
- noch laufende Verarbeitung → definierter Pending-Status,
- abgelaufener Schlüssel → dokumentiertes Verhalten.

## Atomare Reservierung

Pseudocode:

```text
BEGIN
  INSERT operation(key, request_hash, status='started')
  ON CONFLICT DO NOTHING

  if insert succeeded:
      execute business operation
      store result and status='completed'
  else:
      load existing operation
COMMIT
```

Ohne atomare Eindeutigkeit können zwei parallele Requests beide „noch nicht vorhanden“ sehen und die Nebenwirkung doppelt ausführen.

## Datenbankmuster

### Unique Constraint

Eine fachlich eindeutige Spalte schützt auch bei Parallelität:

```sql
CREATE UNIQUE INDEX ux_payment_order
ON payment(order_id, payment_type);
```

### Upsert

```sql
INSERT INTO setting(name, value)
VALUES ('feature_enabled', 'true')
ON CONFLICT (name)
DO UPDATE SET value = EXCLUDED.value;
```

### Compare and Swap

```sql
UPDATE job
SET status = 'running', version = version + 1
WHERE id = :id AND status = 'queued' AND version = :expected_version;
```

Die Anzahl geänderter Zeilen zeigt, ob dieser Worker den Übergang gewonnen hat.

## Messaging: At-least-once einplanen

Viele Broker liefern mindestens einmal. Ein Konsument muss Duplikate vertragen.

Inbox-Muster:

1. Message-ID und Verarbeitungsergebnis in eigener Tabelle speichern.
2. Fachänderung und Inbox-Eintrag in einer Transaktion ausführen.
3. bereits bekannte Message-ID nicht erneut anwenden.

„Exactly once“ ist oft nur innerhalb einer begrenzten Systemgrenze garantiert. An externen Grenzen bleiben deduplizierende Fachschlüssel wichtig.

## Outbox für zuverlässiges Publizieren

Problem:

1. Datenbank-Commit erfolgreich.
2. Publish zur Queue schlägt fehl.

Outbox:

- Fachänderung und Event gemeinsam speichern,
- separater Prozess publiziert offene Events,
- Publish darf wiederholt werden,
- Konsument dedupliziert.

Outbox plus Inbox verschiebt das Problem von verteilten Transaktionen zu kontrollierbarer Wiederholung.

## Infrastructure as Code

Deklarative Werkzeuge vergleichen Ist- und Sollzustand:

```text
ensure user exists
ensure package version is installed
ensure service is enabled and running
ensure file has exact content
```

Nicht idempotent sind unbedingtes Anhängen, zufällige Namen ohne stabile Referenz oder Befehle, die bei jedem Lauf neue Ressourcen erzeugen.

## Retry-Strategie

Ein Retry braucht:

- nur transiente Fehler,
- begrenzte Anzahl,
- Exponential Backoff,
- Jitter gegen gleichzeitige Wiederholung,
- Timeout pro Versuch und insgesamt,
- Idempotenz oder Deduplizierung,
- Metrik und Log für wiederholte Fehler.

```text
delay = min(cap, base * 2^attempt) + random_jitter
```

Bei Validierungsfehlern, fehlender Berechtigung oder ungültigem Zustand ist Retry meist falsch.

## Zeitfenster und Aufbewahrung

Idempotency Keys können nicht immer unbegrenzt gespeichert werden. Die Aufbewahrung muss länger sein als das maximale Retry- und Wiederaufnahmefenster. Für Zahlungen oder rechtlich relevante Vorgänge kann eine dauerhafte fachliche Eindeutigkeit sinnvoller sein als ein kurzlebiger technischer Key.

## Testfälle

- dieselbe Anfrage zweimal nacheinander,
- zwei identische Anfragen parallel,
- Timeout nach erfolgreichem Commit,
- Fehler vor Commit,
- gleicher Key mit anderem Inhalt,
- Prozessabbruch im Status `started`,
- Nachricht wird nach Neustart erneut geliefert,
- Key läuft während eines langen Vorgangs ab.

## Checkliste

- [ ] Ist die fachliche Operation eindeutig benannt?
- [ ] Gibt es einen stabilen Deduplizierungsschlüssel?
- [ ] Werden Schlüssel und Nebenwirkung atomar verknüpft?
- [ ] Liefert Wiederholung dasselbe Ergebnis zurück?
- [ ] Wird gleicher Key mit anderem Inhalt abgelehnt?
- [ ] Sind parallele Requests getestet?
- [ ] Passt die Aufbewahrung zum Retry-Fenster?
- [ ] Werden Retries beobachtet und begrenzt?

## Weiterführende Quellen

- [MDN – Idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)
- [Google Cloud – What is idempotency?](https://cloud.google.com/discover/idempotency)

Praxisbezug: [Robuste Bash-Skripte](../linux/robuste-bash-skripte) und [GitOps](../devops/gitops-praxis).
