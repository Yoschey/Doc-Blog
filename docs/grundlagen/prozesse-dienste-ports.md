---
title: Prozesse, Dienste und Ports
description: Laufende Programme, systemd-Units, Logs, Sockets und Ressourcennutzung zusammenführen.
learning:
  level: Einstieg
  duration: 40 Minuten
  goals:
    - Programm, Prozess, Dienst und Socket unterscheiden.
    - einen Dienststatus mit Prozess, Port und Logausgabe verifizieren.
    - Signale und geordnetes Beenden sicher einordnen.
  terms: [Prozess, PID, Dienst, Socket, Signal]
  practice: Starte im Lab einen einfachen lokalen Webserver, ermittle PID und lauschenden Port, sende eine Anfrage, beende den Prozess kontrolliert und dokumentiere jeden Nachweis.
  check:
    - question: Warum beweist active (running) nicht, dass ein Dienst fachlich funktioniert?
      answer: Der Prozess kann laufen, aber falsch konfiguriert sein, am falschen Port lauschen oder fehlerhafte Antworten liefern. Es braucht eine Ende-zu-Ende-Prüfung.
    - question: Was ist der Unterschied zwischen SIGTERM und SIGKILL?
      answer: SIGTERM kann vom Prozess behandelt werden und erlaubt geordnetes Beenden; SIGKILL beendet durch den Kernel sofort und kann nicht behandelt werden.
    - question: Was ist ein Socket?
      answer: Ein Kommunikationsendpunkt, zum Beispiel eine Kombination aus IP-Adresse, Transportprotokoll und Port oder ein Unix-Domain-Socket.
  next: /linux/systemd-troubleshooting
---

# Prozesse, Dienste und Ports

Ein installiertes Programm ist zunächst nur Code auf einem Datenträger. Wird es ausgeführt, entsteht ein **Prozess** mit Prozess-ID, Benutzer, Umgebung, offenen Dateien und Ressourcen. Ein **Dienst** ist ein dauerhaft oder ereignisgesteuert betriebener Prozess, der von einem Service Manager wie systemd verwaltet werden kann.

## Begriffe auseinanderhalten

| Begriff | Bedeutung |
|---|---|
| Programm | ausführbarer Code oder Skript auf dem Dateisystem |
| Prozess | laufende Instanz eines Programms |
| Thread | Ausführungspfad innerhalb eines Prozesses |
| Dienst | verwaltete Funktion, meist mit Start-, Stop- und Neustartregeln |
| Socket | Kommunikationsendpunkt |
| Port | Nummer eines TCP-/UDP-Endpunkts |
| PID | lokale Kennung eines Prozesses |

Ein Prozess kann mehrere Ports öffnen. Mehrere Prozesse können unter bestimmten Socket-Optionen gemeinsam einen Port verwenden. Und ein Dienst kann ganz ohne Netzwerkport arbeiten.

## Prozesse untersuchen

```bash
ps -eo pid,ppid,user,stat,%cpu,%mem,etime,cmd --sort=-%cpu | head
pgrep -a nginx
top
```

Nützliche Fragen:

- Welcher Benutzer führt den Prozess aus?
- Seit wann läuft er?
- Wer ist der Elternprozess?
- Wie viel CPU und Speicher nutzt er?
- Welche Dateien und Sockets sind offen?

```bash
sudo lsof -p 1234
ls -l /proc/1234/fd
tr '\0' ' ' </proc/1234/cmdline
```

`/proc` zeigt den aktuellen Kernelzustand. Zugriffe können wegen Berechtigungen oder Prozessende fehlschlagen.

## Signale und Shutdown

```bash
kill -TERM 1234
```

`SIGTERM` bittet den Prozess, geordnet zu beenden. Eine Anwendung kann dann neue Arbeit ablehnen, offene Vorgänge abschließen und Puffer schreiben. Erst wenn ein Prozess nicht reagiert und Folgen verstanden sind, kommt `SIGKILL` infrage:

```bash
kill -KILL 1234
```

`SIGKILL` kann nicht behandelt werden. Temporäre Dateien, Locks oder Transaktionen können in einem ungünstigen Zustand bleiben.

## Dienste mit systemd

```bash
systemctl status example.service
systemctl is-active example.service
systemctl is-enabled example.service
journalctl -u example.service --since '-15 min' --no-pager
```

- **active:** aktuelle Laufzeitlage.
- **enabled:** Startverknüpfung für zukünftige Boots.
- **loaded:** Unit-Datei wurde gefunden und geladen.

Diese Zustände sind unabhängig. Ein Dienst kann aktiv, aber nicht enabled sein.

Änderungen an Unit-Dateien:

```bash
sudo systemctl daemon-reload
sudo systemctl restart example.service
systemctl status example.service
```

## Welcher Prozess lauscht?

```bash
sudo ss -lntup
sudo ss -lntp 'sport = :8080'
```

Beispielausgabe enthält:

- Transportprotokoll,
- Zustand wie `LISTEN`,
- lokale Bind-Adresse und Port,
- Prozessinformationen, sofern berechtigt.

Prüfe danach vom relevanten Quellort:

```bash
curl --fail-with-body --max-time 5 http://127.0.0.1:8080/health
```

Ein lokaler Erfolg beweist noch keine Erreichbarkeit aus einem anderen Netz. Dann folgen Bind-Adresse, Host-Firewall, Netzpfad und vorgeschaltete Komponenten.

## Exit Codes

Prozesse geben beim Ende einen ganzzahligen Status zurück. Unter Unix steht `0` üblicherweise für Erfolg, ungleich `0` für eine Fehlerklasse.

```bash
some-command
status=$?
printf 'exit=%s\n' "$status"
```

In Skripten muss der Exit Code nahe am Befehl erfasst werden, bevor ein anderer Befehl ihn überschreibt.

## Ressourcen und Limits

Ein Prozess kann laufen und trotzdem nicht arbeitsfähig sein:

- Speicherlimit erreicht,
- keine freien Dateideskriptoren,
- Datenträger voll oder Inodes erschöpft,
- CPU stark ausgelastet,
- Abhängigkeit nicht erreichbar,
- Rechte auf Konfiguration oder Socket fehlen.

```bash
free -h
df -h
df -i
ulimit -a
systemctl show example.service -p MemoryCurrent -p TasksCurrent
```

## Eine belastbare Dienstprüfung

1. Unit-Zustand lesen.
2. relevante Logs mit Zeitfenster lesen.
3. erwarteten Prozess und Benutzer prüfen.
4. Bind-Adresse und Port prüfen.
5. lokale Protokollanfrage senden.
6. Anfrage aus Sicht des echten Clients wiederholen.
7. Abhängigkeiten und Ressourcen prüfen.

Vertiefe die Methode in [systemd Troubleshooting](../linux/systemd-troubleshooting).

**Primärquellen:** [systemd manuals](https://systemd.io/), [Linux man-pages: signal](https://man7.org/linux/man-pages/man7/signal.7.html), [Linux man-pages: proc](https://man7.org/linux/man-pages/man5/proc.5.html)
