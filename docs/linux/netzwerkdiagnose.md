---
title: Linux Netzwerkdiagnose
description: Netzwerkprobleme systematisch von Interface und Route bis DNS, Port und Paket untersuchen.
---

# Linux Netzwerkdiagnose – vom Symptom zum Paket

Netzwerkdiagnose wird zuverlässig, wenn sie Schicht für Schicht erfolgt. Nicht sofort Firewall-Regeln ändern oder Dienste neu starten: erst Zustand erfassen, dann die kleinste passende Hypothese testen.

<div class="tag-row"><span class="tag">Linux</span><span class="tag">Networking</span><span class="tag">DNS</span><span class="tag">Troubleshooting</span></div>

## Die Diagnosekette

```text
Interface → Adresse → Route → DNS → Port → TLS/HTTP → Paketmitschnitt
```

Jeder Schritt beantwortet eine andere Frage. `ping` allein prüft weder DNS vollständig noch einen TCP-Port oder die Anwendung.

## 1. Interface und Adresse

```bash
ip -brief link
ip -brief address
```

Prüfen:

- Interface ist `UP`,
- erwartete IPv4-/IPv6-Adresse vorhanden,
- keine unerwartete APIPA-/Link-Local-Adresse,
- VLAN, Bond oder Bridge korrekt,
- RX/TX-Fehler und Drops nicht auffällig.

```bash
ip -s link show dev eth0
```

Viele Drops oder Errors weisen eher auf Interface, Treiber, MTU oder physische Strecke als auf die Anwendung.

## 2. Route und Quelladresse

```bash
ip route
ip -6 route
ip route get 203.0.113.10
```

`ip route get` zeigt, welche Route, welches Interface und welche Quelladresse der Kernel für ein konkretes Ziel verwenden würde.

Typische Probleme:

- Default Route fehlt,
- spezifischere Route zeigt ins falsche Netz,
- asymmetrisches Routing,
- falsche Policy Routing Table,
- VPN überschreibt Route oder DNS.

```bash
ip rule show
ip route show table all
```

## 3. Erreichbarkeit sinnvoll testen

```bash
ping -c 4 203.0.113.10
```

Ein fehlender Ping beweist nicht, dass der Host unerreichbar ist. ICMP kann gefiltert sein. Ein erfolgreicher Ping beweist wiederum nicht, dass der gewünschte Dienst funktioniert.

Pfad untersuchen:

```bash
tracepath 203.0.113.10
traceroute 203.0.113.10
```

`tracepath` kann zusätzlich Hinweise auf Path MTU liefern.

## 4. DNS getrennt prüfen

```bash
getent ahosts example.com
resolvectl query example.com
dig example.com A
dig example.com AAAA
```

`getent` nutzt den Resolver-Pfad der Anwendung inklusive `/etc/nsswitch.conf`. `dig` fragt DNS direkter ab. Unterschiedliche Ergebnisse sind ein wichtiger Hinweis.

Status mit systemd-resolved:

```bash
resolvectl status
resolvectl statistics
```

Fragen:

- welcher DNS-Server wird für welches Interface verwendet?
- existiert Split DNS für VPN-Domains?
- kommt zuerst eine fehlerhafte IPv6-Antwort?
- ist `/etc/resolv.conf` ein korrekter Symlink?
- liefert der Server `NXDOMAIN`, Timeout oder `SERVFAIL`?

## 5. Lokale Ports und Prozesse

```bash
ss -lntup
ss -ntp state established
```

Für einen konkreten Port:

```bash
ss -lntp 'sport = :443'
```

Prüfen:

- lauscht überhaupt ein Prozess?
- nur auf `127.0.0.1` statt auf erwarteter Adresse?
- IPv4, IPv6 oder beides?
- falscher Prozess oder Portkonflikt?
- viele Verbindungen in `SYN-SENT`, `TIME-WAIT` oder `CLOSE-WAIT`?

## 6. TCP-Verbindung testen

```bash
nc -vz example.com 443
timeout 5 bash -c '</dev/tcp/example.com/443'
```

Interpretation:

| Ergebnis | Hinweis |
|---|---|
| Connection refused | Ziel erreichbar, aber kein Listener oder aktive Ablehnung |
| Timeout | Filter, Route, Paketverlust oder Dienst reagiert nicht |
| Connected | TCP funktioniert; Problem liegt eventuell in TLS oder Anwendung |

## 7. TLS und HTTP untersuchen

```bash
curl --verbose --connect-timeout 5 https://example.com/health
```

Nur Header:

```bash
curl --head --fail-with-body https://example.com/
```

TLS im Detail:

```bash
openssl s_client -connect example.com:443 -servername example.com </dev/null
```

Prüfen:

- stimmt der SNI-Name?
- ist die Zertifikatskette vollständig?
- passt Systemzeit und Gültigkeit?
- wird ein Proxy verwendet?
- gibt es Redirect-Loops oder falschen Host Header?

## 8. Firewall und NAT

Abhängig vom System:

```bash
sudo nft list ruleset
sudo iptables-save
```

Keine Regeln „zum Test“ komplett deaktivieren, wenn die Maschine exponiert ist. Besser Zähler, Logs und konkrete Ketten untersuchen.

Bei Containern zusätzlich:

- Host-NAT und Forwarding,
- Container-Namespace,
- Bridge und veth-Paare,
- Service- oder Ingress-Regeln,
- Cloud Security Groups und Network ACLs.

## 9. Paketmitschnitt

Wenn Annahmen nicht weiterhelfen, zeigt ein Mitschnitt, was tatsächlich auf dem Interface passiert:

```bash
sudo tcpdump -ni any host 203.0.113.10 and port 443
```

In Datei schreiben:

```bash
sudo tcpdump -ni eth0 -s 0 -w incident.pcap 'host 203.0.113.10 and port 443'
```

Datenschutz beachten: Pakete können Tokens, personenbezogene Daten oder unverschlüsselte Inhalte enthalten. Filter eng setzen, Aufbewahrung begrenzen und Datei schützen.

### TCP-Handshake lesen

- `SYN` geht raus, nichts kommt zurück: Route, Filter oder Ziel.
- `SYN` → `RST`: Ziel lehnt aktiv ab.
- `SYN` → `SYN,ACK` → kein `ACK`: Rückweg oder lokaler Filter.
- Handshake vollständig, danach Pause: TLS oder Anwendung.

## Namespace eines Prozesses prüfen

Container und Dienste können eine andere Netzwerksicht haben:

```bash
sudo nsenter -t <PID> -n ip address
sudo nsenter -t <PID> -n ip route
sudo nsenter -t <PID> -n ss -lntp
```

Der Host kann ein Ziel erreichen, während der Container keine Route oder andere DNS-Konfiguration besitzt.

## Schnelles Incident-Protokoll

```text
Zeitpunkt (UTC):
Quelle / Ziel:
Erwarteter Port / Protokoll:
Interface und Adresse:
Route get:
DNS-Antwort:
TCP-Ergebnis:
TLS/HTTP-Ergebnis:
Firewall-Zähler:
Paketmitschnitt:
Letzte Änderung:
```

## Anti-Patterns

- nur `ping` verwenden,
- DNS und TCP gleichzeitig ändern,
- Firewall global deaktivieren,
- `curl -k` als dauerhafte Lösung,
- nur vom eigenen Laptop testen,
- IPv6 ignorieren,
- Paketmitschnitt ohne Filter und Datenschutz,
- Dienst neu starten, bevor Logs und Zustand gesichert sind.

## Weiterführende Quellen

- [ip(8) – Linux manual page](https://man7.org/linux/man-pages/man8/ip.8.html)
- [ss(8) – Linux manual page](https://man7.org/linux/man-pages/man8/ss.8.html)
- [systemd-resolved](https://www.freedesktop.org/software/systemd/man/systemd-resolved.service.html)

Weiter: [systemd Troubleshooting](./systemd-troubleshooting).
