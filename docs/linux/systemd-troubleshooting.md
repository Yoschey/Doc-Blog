---
title: systemd Troubleshooting
description: Services, Units, Abhängigkeiten und Logs mit systemctl und journalctl untersuchen.
---

# systemd Troubleshooting – Dienste systematisch untersuchen

systemd verwaltet Units, Abhängigkeiten und Service-Lebenszyklen. Ein `restart` kann Symptome kurz verdecken; eine belastbare Diagnose verbindet Unit-Konfiguration, Prozessstatus, Journal und Ressourcen.

<div class="tag-row"><span class="tag">Linux</span><span class="tag">systemd</span><span class="tag">journalctl</span><span class="tag">Operations</span></div>

## Erste Minute

```bash
systemctl status example.service --no-pager --full
systemctl is-active example.service
systemctl is-enabled example.service
journalctl -u example.service -n 100 --no-pager
```

Dokumentieren:

- Active State und Sub State,
- Exit Code oder Signal,
- Startzeit und Restart-Anzahl,
- Main PID,
- letzte relevante Logs,
- letzte Änderung an Unit, Environment oder Binary.

## Unit-Datei und Overrides finden

```bash
systemctl cat example.service
systemctl show example.service --property=FragmentPath,DropInPaths
```

`systemctl cat` zeigt die Basis-Unit und Drop-ins in ihrer wirksamen Reihenfolge. Nicht nur `/etc/systemd/system/example.service` lesen – Vendor-Unit und Overrides können gemeinsam den Zustand bestimmen.

Wirksame Eigenschaften:

```bash
systemctl show example.service \
  --property=User,Group,ExecStart,EnvironmentFiles,WorkingDirectory,Restart,TimeoutStartUSec
```

## Konfiguration validieren

```bash
systemd-analyze verify /etc/systemd/system/example.service
```

Nach einer Änderung:

```bash
sudo systemctl daemon-reload
sudo systemctl restart example.service
```

`daemon-reload` lädt Unit-Definitionen neu. Es startet den Dienst nicht automatisch.

## Journal gezielt lesen

Seit letztem Boot:

```bash
journalctl -u example.service -b
```

Zeitfenster:

```bash
journalctl -u example.service \
  --since '2026-08-04 08:00:00' \
  --until '2026-08-04 08:15:00'
```

Nur Fehler und kritischer:

```bash
journalctl -u example.service -p err..alert
```

Live folgen:

```bash
journalctl -fu example.service
```

Strukturierte Ausgabe:

```bash
journalctl -u example.service -o json-pretty -n 5
```

Logs der vorherigen Boot-Sitzung:

```bash
journalctl --list-boots
journalctl -u example.service -b -1
```

## Exit Codes interpretieren

```bash
systemctl show example.service \
  --property=ExecMainCode,ExecMainStatus,Result,NRestarts
```

Häufige Fälle:

| Ergebnis | Bedeutung |
|---|---|
| `status=1/FAILURE` | Anwendung beendete sich mit Exit Code 1 |
| `status=203/EXEC` | Binary oder Pfad konnte nicht ausgeführt werden |
| `status=217/USER` | konfigurierter Benutzer ist ungültig |
| `signal=KILL` | Prozess wurde mit SIGKILL beendet, eventuell OOM |
| `start-limit-hit` | zu viele Starts in kurzer Zeit |

Bei OOM:

```bash
journalctl -k -g 'Out of memory|Killed process'
systemctl show example.service --property=MemoryCurrent,MemoryMax
```

## Abhängigkeiten untersuchen

```bash
systemctl list-dependencies example.service
systemctl list-dependencies example.service --reverse
systemctl show example.service --property=After,Before,Wants,Requires
```

`After=` steuert Reihenfolge, nicht automatisch eine harte Abhängigkeit. `Requires=` zieht eine Unit ein und koppelt Fehler stärker. Oft werden beide bewusst kombiniert.

## Umgebung und Dateirechte

Ein systemd-Service läuft nicht mit der interaktiven Shell-Umgebung.

Prüfen:

- absoluter Pfad in `ExecStart`,
- `WorkingDirectory`,
- `User` und `Group`,
- `EnvironmentFile`,
- Leserechte auf Konfiguration und Zertifikate,
- Schreibrechte auf Daten- und Logpfade,
- SELinux/AppArmor-Kontext.

Als Service-Benutzer testen:

```bash
sudo -u example -- /usr/local/bin/example --check-config
```

Keine interaktiven Profile oder Alias-Definitionen voraussetzen.

## Netzwerk und Ports

```bash
ss -lntp
systemctl show example.service --property=IPAddressDeny,IPAddressAllow,PrivateNetwork
```

Ein gehärteter Dienst kann durch systemd-Sandboxing absichtlich Netzwerk- oder Dateisystemzugriff verlieren. Das ist ein Konfigurationsproblem, kein Grund, alle Schutzoptionen abzuschalten.

## Restart-Schleifen

```ini
[Service]
Restart=on-failure
RestartSec=5s

[Unit]
StartLimitIntervalSec=60s
StartLimitBurst=5
```

Ein automatischer Restart verbessert Verfügbarkeit bei transienten Fehlern, kann aber permanente Konfigurationsfehler lautlos in eine Schleife verwandeln.

Nach behobenem Start-Limit:

```bash
sudo systemctl reset-failed example.service
sudo systemctl start example.service
```

## Sichere Unit-Baseline

Viele Schutzoptionen lassen sich schrittweise testen:

```ini
[Service]
User=example
Group=example
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/example
```

Mit folgendem Befehl wird die Härtung bewertet:

```bash
systemd-analyze security example.service
```

Nicht blind den höchsten Score anstreben. Jede Option muss zur Funktion des Dienstes passen und getestet werden.

## Runbook bei Startfehlern

1. Status und Journal sichern.
2. Exit Code und Signal identifizieren.
3. wirksame Unit inklusive Drop-ins lesen.
4. Binary und Konfiguration als Service-Benutzer prüfen.
5. Abhängigkeiten, Mounts, Netzwerk und Secrets prüfen.
6. letzte Änderung vergleichen.
7. kleinste Korrektur durchführen.
8. `daemon-reload`, Start und Health Check.
9. Restart-Zähler und Logs weiter beobachten.

## Anti-Patterns

- sofort `systemctl restart` ohne Beweise,
- Unit direkt unter `/usr/lib` oder `/lib` editieren,
- relative Pfade und Shell-Aliase in `ExecStart`,
- `chmod 777` als Diagnose,
- Restart-Schleife ohne Alarm,
- Schutzoptionen komplett entfernen statt gezielt korrigieren,
- nur aktuelle Boot-Sitzung untersuchen.

## Weiterführende Quellen

- [systemctl](https://www.freedesktop.org/software/systemd/man/systemctl.html)
- [journalctl](https://www.freedesktop.org/software/systemd/man/journalctl.html)
- [systemd.service](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [systemd.exec](https://www.freedesktop.org/software/systemd/man/systemd.exec.html)

Bei Verbindungsproblemen: [Linux Netzwerkdiagnose](./netzwerkdiagnose).
