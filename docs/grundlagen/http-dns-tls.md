---
title: HTTP, DNS & TLS
description: Verstehen, was beim Aufruf einer HTTPS-Adresse zwischen Name, Verbindung, Zertifikat und Antwort passiert.
learning:
  level: Einstieg
  duration: 45 Minuten
  goals:
    - eine URL in Schema, Host, Port, Pfad und Query zerlegen.
    - DNS-Auflösung, TCP-Verbindung, TLS-Handshake und HTTP-Austausch unterscheiden.
    - Statuscodes, Header und Zertifikatsfehler gezielt untersuchen.
  terms: [URL, DNS, HTTP, TLS, Zertifikat]
  practice: Untersuche mit Resolve-DnsName oder dig und curl -v eine freigegebene HTTPS-Seite. Dokumentiere DNS-Record, Ziel-IP, TLS-Name, Statuscode und drei relevante Header.
  check:
    - question: Was schützt TLS?
      answer: TLS stellt je nach Konfiguration Vertraulichkeit, Integrität und die authentisierte Identität des Gegenübers bereit; es bewertet nicht, ob die Anwendung fachlich vertrauenswürdig ist.
    - question: Warum kann DNS funktionieren, obwohl HTTPS scheitert?
      answer: DNS liefert nur Namensinformationen. Route, TCP-Port, TLS-Vertrauen und HTTP-Anwendung sind nachgelagerte Schritte.
    - question: Was ist der Unterschied zwischen 401 und 403?
      answer: 401 fordert gültige Authentisierung; 403 bedeutet, dass der Server die Anfrage verstanden hat, den Zugriff aber nicht erlaubt.
  next: /grundlagen/prozesse-dienste-ports
---

# HTTP, DNS & TLS – vom Namen zur Antwort

Beim Aufruf von `https://api.example.test:8443/v1/health?verbose=true` passieren mehrere getrennte Dinge. Wer sie auseinanderhält, findet Fehler schneller.

## Eine URL lesen

| Teil | Wert | Bedeutung |
|---|---|---|
| Schema | `https` | Protokoll und übliche Sicherheitsanforderung |
| Host | `api.example.test` | Name des Zielsystems oder Dienstes |
| Port | `8443` | expliziter TCP-Port; Standard für HTTPS wäre 443 |
| Pfad | `/v1/health` | adressierte Ressource |
| Query | `verbose=true` | zusätzliche Parameter |

Der Fragmentteil nach `#` wird normalerweise nur im Client verarbeitet und nicht als HTTP-Anfrage an den Server gesendet.

## Schritt 1: DNS löst den Namen auf

DNS ist ein hierarchisches, verteiltes Namenssystem. Häufige Records:

| Record | Zweck |
|---|---|
| `A` | Name zu IPv4-Adresse |
| `AAAA` | Name zu IPv6-Adresse |
| `CNAME` | Alias auf einen anderen Namen |
| `MX` | Mailserver einer Domain |
| `TXT` | freie Textdaten, oft Verifikation oder Mailrichtlinien |
| `NS` | autoritative Nameserver einer Zone |

```bash
dig api.example.test A
dig api.example.test AAAA
```

```powershell
Resolve-DnsName api.example.test
```

Der TTL-Wert beschreibt, wie lange ein Ergebnis gecacht werden darf. Eine DNS-Änderung ist deshalb nicht überall sofort sichtbar.

## Schritt 2: Transportverbindung

Für klassisches HTTPS wird eine TCP-Verbindung zur Zieladresse und zum Port aufgebaut. HTTP/3 verwendet dagegen QUIC über UDP. Prüfe für eine normale HTTPS-Diagnose zunächst den konkreten Port:

```bash
nc -vz api.example.test 8443
```

```powershell
Test-NetConnection api.example.test -Port 8443
```

Diese Prüfung beweist noch keine funktionierende TLS- oder HTTP-Kommunikation.

## Schritt 3: TLS schafft einen geschützten Kanal

Beim TLS-Handshake einigen sich Client und Server auf kryptografische Parameter. Der Server präsentiert normalerweise ein Zertifikat. Der Client prüft unter anderem:

- passt der angefragte Hostname zu einem Namen im Zertifikat?
- ist das Zertifikat innerhalb seiner Gültigkeitszeit?
- führt die Zertifikatskette zu einer vertrauten Zertifizierungsstelle?
- ist die Signatur der Kette gültig?
- sind Protokollversionen und Algorithmen kompatibel?

```bash
openssl s_client -connect api.example.test:8443 \
  -servername api.example.test </dev/null
```

`-servername` setzt SNI. Das ist wichtig, wenn mehrere HTTPS-Dienste dieselbe IP-Adresse verwenden.

::: danger Zertifikatsprüfung nicht als Dauerlösung abschalten
Optionen wie `curl -k` oder `Invoke-WebRequest -SkipCertificateCheck` können einen Fehler sichtbar machen, beseitigen aber den Vertrauensbruch nicht. Nutze sie höchstens bewusst im isolierten Lab und nie als produktive Reparatur.
:::

## Schritt 4: HTTP Request und Response

Eine Anfrage besteht aus Methode, Ziel, Headern und optional einem Body:

```http
GET /v1/health HTTP/1.1
Host: api.example.test
Accept: application/json
User-Agent: dev-garage-lab/1.0
```

Die Antwort enthält Status, Header und optional einen Body:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{"status":"ok"}
```

HTTP ist zustandslos: Jede Anfrage muss genug Kontext enthalten oder auf einen extern verwalteten Zustand wie eine Session verweisen.

## Methoden und Idempotenz

| Methode | typische Absicht | idempotent? |
|---|---|---|
| `GET` | Ressource lesen | ja |
| `HEAD` | nur Metadaten lesen | ja |
| `POST` | Verarbeitung oder neue Unterressource anstoßen | normalerweise nein |
| `PUT` | Ressource vollständig auf einen Zielzustand setzen | ja |
| `PATCH` | Ressource teilweise ändern | nicht garantiert |
| `DELETE` | Ressource entfernen | ja bezogen auf den Zielzustand |

Idempotent bedeutet: Mehrfaches Ausführen hat denselben beabsichtigten Zustand wie einmaliges Ausführen. Es bedeutet nicht, dass jede Antwort identisch sein muss. Mehr dazu im Artikel [Idempotenz](../concepts/idempotenz).

## Statuscodes sinnvoll lesen

- **2xx:** Anfrage wurde erfolgreich verarbeitet.
- **3xx:** Umleitung oder Cache-Entscheidung.
- **4xx:** Anfrage kann in dieser Form nicht erfüllt werden.
- **5xx:** Server oder vorgeschalteter Dienst konnte sie nicht verarbeiten.

Wichtige Beispiele:

| Code | Bedeutung | erste Frage |
|---|---|---|
| 200 | erfolgreich | ist auch der Inhalt fachlich korrekt? |
| 201 | Ressource erstellt | zeigt `Location` auf die neue Ressource? |
| 301/308 | dauerhafte Umleitung | ist das Ziel korrekt und erreichbar? |
| 400 | ungültige Anfrage | stimmen Syntax, Header und Body? |
| 401 | Authentisierung nötig/ungültig | welche Credentials erwartet der Server? |
| 403 | Zugriff nicht erlaubt | welche Rolle oder Policy blockiert? |
| 404 | Ressource nicht gefunden | stimmen Host, Basis-Pfad und Version? |
| 429 | zu viele Anfragen | gibt es `Retry-After` und Backoff? |
| 500 | interner Fehler | welche Request-ID findet sich in Logs/Traces? |
| 502/503/504 | Upstream nicht nutzbar | Proxy, Zielzustand, Timeout und Kapazität prüfen |

## Eine reproduzierbare Diagnose

```bash
curl --verbose \
  --connect-timeout 5 \
  --max-time 15 \
  --header 'Accept: application/json' \
  https://api.example.test:8443/v1/health
```

Dokumentiere:

1. aufgelöste Adresse,
2. erfolgreiche oder fehlgeschlagene Verbindung,
3. TLS-Protokoll und Zertifikatsname,
4. Request-Methode und Ziel,
5. Statuscode und relevante Header,
6. Request- oder Trace-ID für serverseitige Logs.

## Typische Fehlerbilder

- **Falscher Inhalt trotz 200:** Proxy oder Cache liefert eine andere Anwendung.
- **Zertifikatsname falsch:** Zugriff erfolgt über IP oder falschen Alias.
- **Nur manche Clients betroffen:** unterschiedliche DNS-Caches, IPv4/IPv6, Proxy- oder Truststore-Konfiguration.
- **502:** Reverse Proxy erreicht seinen Upstream nicht korrekt.
- **504:** Proxy wartet länger als sein Timeout auf den Upstream.
- **429:** Client braucht Rate-Limit-Beachtung und exponentiellen Backoff mit Jitter.

**Primärquellen:** [MDN: HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview), [MDN: DNS](https://developer.mozilla.org/en-US/docs/Glossary/DNS), [MDN: HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS)
