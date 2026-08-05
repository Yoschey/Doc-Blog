---
title: Netzwerk-Grundlagen
description: IP-Adresse, Subnetz, Gateway, Routing, Ports und Verbindungen als Diagnosekette verstehen.
learning:
  level: Einstieg
  duration: 40 Minuten
  goals:
    - Adresse, Route, Port und Protokoll auseinanderhalten.
    - den Weg einer Verbindung vom Client bis zum Dienst beschreiben.
    - einfache Netzwerkfehler schichtweise eingrenzen.
  terms: [IP-Adresse, Subnetz, Gateway, TCP, Port]
  practice: Ermittle auf einem Testsystem IP-Adresse, Standardroute, DNS-Server und lauschende Ports. Ordne jede Ausgabe einer Schicht in der Diagnosekette zu.
  check:
    - question: Warum beweist ein erfolgreicher Ping nicht, dass eine Webanwendung funktioniert?
      answer: Ping prüft ICMP-Erreichbarkeit. DNS, TCP-Port, TLS, HTTP und Anwendung können trotzdem fehlschlagen.
    - question: Was macht ein Standardgateway?
      answer: Es ist der nächste Router für Ziele, für die keine spezifischere lokale Route bekannt ist.
    - question: Was beschreibt ein Port?
      answer: Eine logische Nummer, über die ein Transportprotokoll wie TCP oder UDP einen Dienst beziehungsweise Socket adressiert.
  next: /grundlagen/http-dns-tls
---

# Netzwerk-Grundlagen

Netzwerkfehler wirken oft unübersichtlich, weil viele Schichten beteiligt sind. Eine gute Diagnose prüft sie von unten nach oben und trennt klar zwischen **Name**, **Adresse**, **Route**, **Transport**, **Verschlüsselung** und **Anwendung**.

## Die wichtigsten Bausteine

| Begriff | Aufgabe | Beispiel |
|---|---|---|
| IP-Adresse | adressiert ein Interface im Netzwerk | `192.0.2.15`, `2001:db8::15` |
| Präfix/Subnetz | bestimmt den lokalen Adressbereich | `/24`, `/64` |
| Route | entscheidet über den nächsten Weg | `default via 192.0.2.1` |
| Gateway | Router zum nächsten Netz | `192.0.2.1` |
| DNS | übersetzt Namen in Records | `app.example.test → 192.0.2.15` |
| TCP/UDP | transportiert Daten zwischen Endpunkten | TCP 443, UDP 53 |
| Port | adressiert einen Socket/Dienst | `443` für HTTPS |

## Lokal oder geroutet?

Ein Host vergleicht das Ziel mit seinen eigenen Netzpräfixen:

- Liegt das Ziel im lokalen Netz, wird es direkt über das passende Interface erreicht.
- Liegt es außerhalb, wird die spezifischste passende Route verwendet.
- Gibt es keine spezifische Route, greift meist die Standardroute.
- Gibt es gar keine passende Route, ist das Ziel aus Sicht des Hosts nicht erreichbar.

Unter Linux:

```bash
ip -brief address
ip route
ip route get 203.0.113.20
```

Unter PowerShell:

```powershell
Get-NetIPConfiguration
Get-NetRoute -AddressFamily IPv4 |
    Sort-Object RouteMetric, DestinationPrefix
```

## TCP-Verbindung in drei Schritten

TCP baut eine Verbindung mit einem Handshake auf:

1. Client sendet `SYN`.
2. Server antwortet `SYN-ACK`.
3. Client bestätigt mit `ACK`.

Erst danach fließen Anwendungsdaten. Ein Timeout kann auf Routing, Firewall oder Paketverlust hindeuten. „Connection refused“ bedeutet häufig: Der Zielhost war erreichbar, aber am Port lauscht kein Dienst oder eine aktive Regel lehnt ab.

## Ports und Bind-Adressen

Ein Dienst lauscht nicht nur auf einem Port, sondern auf einer Kombination aus Adresse, Protokoll und Port.

```bash
ss -lntup
```

Wichtiger Unterschied:

- `127.0.0.1:8080`: nur vom lokalen Host erreichbar.
- `0.0.0.0:8080`: auf allen IPv4-Interfaces gebunden.
- `[::]:8080`: auf IPv6 gebunden; Verhalten für IPv4 hängt vom System ab.

Eine offene Firewall hilft nicht, wenn der Prozess nur an Loopback gebunden ist.

## NAT kurz erklärt

Network Address Translation verändert Adressinformationen an einem Übergang. Häufig teilen viele interne Clients eine öffentliche Quelladresse. Portweiterleitung kann eingehenden Verkehr auf einen internen Dienst abbilden.

NAT ist keine vollständige Sicherheitsstrategie. Erlaubte Verbindungen, Authentisierung und Verschlüsselung müssen weiterhin bewusst gestaltet werden.

## Diagnose von unten nach oben

1. **Interface:** Ist es aktiv und hat es die erwartete Adresse?
2. **Route:** Welcher nächste Hop wird für das Ziel gewählt?
3. **Name:** Liefert DNS den erwarteten Record?
4. **Transport:** Ist der konkrete TCP- oder UDP-Port erreichbar?
5. **TLS:** Stimmen Zertifikat, Name, Uhrzeit und Vertrauenskette?
6. **Anwendung:** Liefert das Protokoll den erwarteten Status und Inhalt?

```bash
ip -brief link
ip route get 203.0.113.20
getent ahosts app.example.test
nc -vz app.example.test 443
curl -v --connect-timeout 5 https://app.example.test/health
```

Windows-Entsprechungen:

```powershell
Get-NetAdapter
Resolve-DnsName app.example.test
Test-NetConnection app.example.test -Port 443 -InformationLevel Detailed
curl.exe -v https://app.example.test/health
```

## Häufige Denkfehler

- „Ping geht“ wird mit „Anwendung geht“ gleichgesetzt.
- Ein Name löst auf, aber auf eine alte oder falsche Adresse.
- Client und Server verwenden unterschiedliche IP-Familien.
- Ein Container veröffentlicht den Port nicht zum Host.
- Ein Proxy beeinflusst HTTP, aber nicht automatisch andere Protokolle.
- Eine lokale Firewallregel wird geändert, obwohl der Dienst gar nicht lauscht.
- Gleichzeitige Änderungen an DNS, Firewall und Dienst zerstören den Diagnosewert.

## Beweise sammeln

Notiere bei jeder Messung:

- Zeitpunkt und Zeitzone,
- Quellhost und Ziel,
- vollständigen Befehl,
- relevante Ausgabe oder Exit Code,
- Erwartung und beobachtete Abweichung.

So kann eine andere Person die Diagnose fortsetzen, ohne alle Schritte zu wiederholen.

## Vertiefung

- [HTTP, DNS & TLS](./http-dns-tls)
- [Linux-Netzwerkdiagnose](../linux/netzwerkdiagnose)
- [Proxy-Grundlagen](../proxy)

**Primärquellen:** [IETF TCP](https://www.rfc-editor.org/rfc/rfc9293), [IETF IPv6](https://www.rfc-editor.org/rfc/rfc8200), [Microsoft Learn: Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection)
