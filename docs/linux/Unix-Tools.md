---
title: Unix-Tools für DevOps
description: Dateien finden, Text verarbeiten, Prozesse und Netzwerk untersuchen – mit einer kleinen belastbaren CLI-Werkzeugkiste.
learning:
  level: Einstieg · Praxis
  duration: 45 Minuten
  goals:
    - das passende Werkzeug für Datei-, Text-, Prozess- und Netzwerkfragen wählen.
    - Pipelines mit klaren Ein- und Ausgaben zusammensetzen.
    - destruktive Befehle erst als lesende Auswahl verifizieren.
  terms: [CLI, Pipeline, stdout, stderr, Exit Code]
  practice: Erzeuge in einem Lab-Ordner zehn kleine Logdateien und beantworte fünf Fragen nur mit find, rg, sort, uniq, cut oder awk. Speichere Befehle und erwartete Ausgabe in einer README.
  check:
    - question: Warum ist die Ausgabe eines find-Befehls vor -delete zu prüfen?
      answer: Auswahlfehler bei Pfad, Prädikaten oder Operatorreihenfolge können sonst unerwartete Dateien unwiederbringlich löschen.
    - question: Was ist der Unterschied zwischen stdout und stderr?
      answer: stdout transportiert normale Ergebnisdaten, stderr Diagnose- und Fehlermeldungen; beide können getrennt umgeleitet werden.
    - question: Wann ist jq besser als grep für JSON?
      answer: Wenn strukturierte Felder, Datentypen oder verschachtelte Werte korrekt ausgewählt werden müssen; grep kennt die JSON-Struktur nicht.
  next: /linux/robuste-bash-skripte
---

# Unix-Tools für DevOps

Gute CLI-Arbeit beginnt mit einer präzisen Frage. Verwende kleine Werkzeuge, deren Ein- und Ausgabe du verstehst, und prüfe die Auswahl lesend, bevor du Daten veränderst.

## Dateien und Verzeichnisse

| Frage | Werkzeug | Beispiel |
|---|---|---|
| Welche Dateien existieren? | `find` | `find ./logs -type f -name '*.log'` |
| Wo steht ein Text? | `rg` | `rg -n --glob '*.log' 'ERROR|FATAL' ./logs` |
| Wie groß ist ein Pfad? | `du` | `du -sh ./logs` |
| Welches Dateisystem ist voll? | `df` | `df -hT` und `df -i` |
| Welche Metadaten hat eine Datei? | `stat` | `stat ./config.yml` |
| Wohin zeigt ein Symlink? | `readlink` | `readlink -f ./current` |

Sichere Suche nach alten Dateien:

```bash
find ./lab-backups -type f -name '*.tar.gz' -mtime +30 -print
```

Erst wenn die Liste exakt stimmt, kann in einem **Lab-Pfad** eine verändernde Aktion ergänzt werden. Keine breiten Variablen, Globs oder Wurzelpfade verwenden.

## Text und strukturierte Daten

```bash
rg -n 'ERROR|WARN' ./logs
cut -d: -f1 access.log | sort | uniq -c | sort -nr
awk '$9 >= 500 { count[$9]++ } END { for (code in count) print code, count[code] }' access.log
```

Für JSON:

```bash
jq -r '.services[] | select(.ready == false) | [.name, .reason] | @tsv' status.json
```

Für YAML ist `yq` nützlich, aber es existieren verschiedene inkompatible Implementierungen. Version und Syntax im Team standardisieren.

## Prozesse und Ressourcen

```bash
ps -eo pid,ppid,user,stat,%cpu,%mem,etime,cmd --sort=-%cpu | head
pgrep -a nginx
free -h
vmstat 1 5
iostat -xz 1 3
```

Ein hoher Wert ist ohne Baseline und Auswirkung kein Ursachennachweis. Kombiniere CPU, Speicher, I/O, Logs und Nutzerlatenz im selben Zeitfenster.

## Netzwerk

```bash
ip -brief address
ip route
ss -lntup
getent ahosts example.test
curl -v --connect-timeout 3 --max-time 10 https://example.test/health
```

`ping` prüft ICMP, nicht HTTP. `traceroute` oder `mtr` zeigt mögliche Netzwerkpfade, aber Geräte können Antworten filtern oder anders priorisieren als Nutztraffic.

## Streams und Umleitungen

| Syntax | Wirkung |
|---|---|
| `>` | stdout neu in Datei schreiben |
| `>>` | stdout an Datei anhängen |
| `2>` | stderr in Datei schreiben |
| `2>&1` | stderr zum aktuellen Ziel von stdout führen |
| `|` | stdout als stdin des nächsten Befehls |
| `tee` | Stream anzeigen und zusätzlich schreiben |

```bash
some-command >result.json 2>error.log
```

Exit Code direkt erfassen:

```bash
if some-command; then
  printf 'success\n'
else
  status=$?
  printf 'failed with exit %s\n' "$status" >&2
fi
```

## Nützliche moderne Ergänzungen

| Tool | Nutzen | Installation prüfen |
|---|---|---|
| `rg` | schnelle Textsuche mit Gitignore-Unterstützung | Paketname meist `ripgrep` |
| `jq` | JSON filtern und transformieren | Paket `jq` |
| `fzf` | interaktive Auswahl aus Textlisten | Paket `fzf` |
| `bat` | Dateiansicht mit Syntaxhervorhebung | auf Debian teils Befehl `batcat` |
| `ncdu` | interaktive Speicheranalyse | Paket `ncdu` |
| `mtr` | fortlaufende Pfad-/Latenzbeobachtung | benötigt für manche Modi erhöhte Rechte |
| `shellcheck` | statische Analyse von Shell-Skripten | Paket `shellcheck` |

Paketnamen und Verfügbarkeit unterscheiden sich nach Distribution und Version. In Serverumgebungen keine Tools ungeprüft global installieren; nutze freigegebene Pakete oder Diagnosecontainer.

## Zehn-Minuten-Diagnose

1. `date -Is`, `hostname`, `uptime` – Kontext.
2. `systemctl status DIENST` – Unit und letzte Meldungen.
3. `journalctl -u DIENST --since '-15 min'` – relevantes Zeitfenster.
4. `ss -lntup` – erwarteter Socket.
5. `curl` oder Protokollclient – lokale Ende-zu-Ende-Prüfung.
6. `df -h`, `df -i`, `free -h` – harte Ressourcenengpässe.
7. Änderungen im selben Zeitraum – Korrelation als Hypothese, nicht als Beweis.

Vertiefung: [Robuste Bash-Skripte](/linux/robuste-bash-skripte), [Netzwerkdiagnose](/linux/netzwerkdiagnose) und [Troubleshooting-Methode](/grundlagen/troubleshooting).

**Primärquellen:** [GNU Coreutils](https://www.gnu.org/software/coreutils/manual/coreutils.html), [ripgrep guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md), [jq manual](https://jqlang.org/manual/)
