---
title: Linux-Dateisystem und Rechte
description: Pfade, Eigentümer, Gruppen, rwx-Rechte, umask, sudo und sichere Änderungen verstehen.
learning:
  level: Einstieg
  duration: 40 Minuten
  goals:
    - absolute und relative Pfade sowie wichtige Linux-Verzeichnisse einordnen.
    - Eigentümer-, Gruppen- und sonstige Rechte lesen.
    - Berechtigungsprobleme prüfen, ohne pauschal Rechte zu öffnen.
  terms: [Pfad, Inode, Eigentümer, chmod, umask]
  practice: Erstelle im Lab ein gemeinsames Verzeichnis für zwei Testbenutzer. Vergib eine Gruppe, setze das Setgid-Bit und belege mit namei, ls und einer Testdatei, dass neue Dateien die gewünschte Gruppe erben.
  check:
    - question: Was bedeutet das x-Recht bei einem Verzeichnis?
      answer: Es erlaubt das Durchqueren beziehungsweise Auflösen von Einträgen im Verzeichnis, sofern der Name bekannt ist.
    - question: Warum ist chmod 777 selten eine gute Lösung?
      answer: Es gibt allen Benutzern Lese-, Schreib- und Ausführungsrechte, verschleiert die eigentliche Anforderung und vergrößert die Angriffsfläche.
    - question: Was beeinflusst die umask?
      answer: Sie entfernt Standardrechte bei neu erstellten Dateien und Verzeichnissen; bestehende Rechte ändert sie nicht.
  next: /grundlagen/prozesse-dienste-ports
---

# Linux-Dateisystem und Rechte

Unter Linux beginnt der Verzeichnisbaum bei `/`. Laufwerke und entfernte Dateisysteme werden an Verzeichnissen eingehängt. Ein Pfad bezeichnet dabei einen Namen im Baum; die eigentlichen Metadaten einer Datei liegen in einer Inode-Struktur des Dateisystems.

## Wichtige Verzeichnisse

| Pfad | typischer Inhalt |
|---|---|
| `/etc` | systemweite Konfiguration |
| `/var` | veränderliche Daten wie Logs, Queues und Caches |
| `/var/log` | klassische Logdateien; viele Dienste nutzen zusätzlich das Journal |
| `/home` | Home-Verzeichnisse normaler Benutzer |
| `/root` | Home-Verzeichnis von root |
| `/tmp` | temporäre Daten; Lebensdauer ist systemabhängig |
| `/run` | Laufzeitdaten seit dem Boot, etwa PID- oder Socket-Dateien |
| `/usr` | Programme, Bibliotheken und gemeinsame Daten |
| `/opt` | optionale, separat installierte Software |
| `/proc`, `/sys` | virtuelle Sicht auf Prozesse, Kernel und Geräte |

## Pfade sicher verwenden

```bash
pwd
ls -la
readlink -f ./config/../config/app.yml
```

- **Absoluter Pfad:** beginnt mit `/` und ist unabhängig vom aktuellen Verzeichnis.
- **Relativer Pfad:** wird vom aktuellen Arbeitsverzeichnis aus aufgelöst.
- `.` bezeichnet das aktuelle, `..` das übergeordnete Verzeichnis.
- Versteckte Namen beginnen mit einem Punkt, sind aber nicht automatisch geschützt.

In Skripten sollten Pfade immer zitiert werden:

```bash
config_file='/etc/my app/config.yml'
test -r "$config_file"
```

## Rechte lesen

```text
-rwxr-x--- 1 alice devops 1840 Aug  5 10:15 deploy.sh
```

Von links nach rechts:

1. Dateityp (`-` Datei, `d` Verzeichnis, `l` Symlink),
2. Rechte des Eigentümers: `rwx`,
3. Rechte der Gruppe: `r-x`,
4. Rechte aller anderen: `---`,
5. Eigentümer und Gruppe.

Numerische Schreibweise:

| Recht | Wert |
|---|---|
| Lesen `r` | 4 |
| Schreiben `w` | 2 |
| Ausführen `x` | 1 |

`750` bedeutet also `rwxr-x---`.

## Dateien und Verzeichnisse unterscheiden

Bei Dateien bedeutet:

- `r`: Inhalt lesen,
- `w`: Inhalt verändern,
- `x`: als Programm ausführen.

Bei Verzeichnissen bedeutet:

- `r`: Namen der Einträge auflisten,
- `w`: Einträge anlegen, löschen oder umbenennen,
- `x`: Verzeichnis durchqueren und bekannte Einträge erreichen.

Das Löschen einer Datei hängt hauptsächlich von den Rechten am **Elternverzeichnis** ab, nicht vom Schreibrecht der Datei selbst.

## Rechte gezielt ändern

```bash
chmod u+x deploy.sh
chmod g-w config.yml
chmod 640 config.yml
chown alice:devops config.yml
```

Ändere nur die benötigte Dimension. `chmod 777` ist kein Diagnosewerkzeug.

## Gruppenverzeichnis mit Setgid

```bash
sudo install -d -o root -g devops -m 2770 /srv/team-share
```

Die führende `2` setzt Setgid am Verzeichnis. Neue Dateien erben dadurch die Verzeichnisgruppe. Ob sie für die Gruppe schreibbar sind, hängt zusätzlich von Modus und `umask` ab.

```bash
umask
umask 0027
```

Die `umask` entfernt Rechte von den Erstellungsmodi. Sie ist kein pauschaler Zielmodus.

## ACLs für zusätzliche Regeln

Wenn Eigentümer, eine Gruppe und „andere“ nicht ausreichen, bieten POSIX ACLs feinere Einträge:

```bash
getfacl /srv/team-share
setfacl -m u:deploy:r-x /srv/team-share
```

ACLs sind mächtig, aber weniger sichtbar als klassische Modusbits. Dokumentiere ihren Einsatz und prüfe auch die ACL-Maske.

## `sudo` bewusst einsetzen

`sudo` führt einen Befehl mit anderer Identität aus. Verwende es nicht automatisch vor jedem Befehl:

1. Erst lesend prüfen.
2. Exaktes Ziel auflösen.
3. Gewünschten Endzustand formulieren.
4. Minimalen privilegierten Befehl ausführen.
5. Ergebnis ohne Annahme verifizieren.

Shell-Umleitungen werden von der aktuellen Shell verarbeitet. Darum funktioniert folgendes oft nicht wie erwartet:

```bash
sudo echo 'value' > /etc/app.conf
```

Eine kontrollierte Variante:

```bash
printf '%s\n' 'value' | sudo tee /etc/app.conf >/dev/null
```

## Berechtigungsfehler diagnostizieren

```bash
id
namei -l /srv/team-share/project/config.yml
stat /srv/team-share/project/config.yml
getfacl /srv/team-share/project/config.yml
findmnt -T /srv/team-share/project/config.yml
```

Prüfe jeden Pfadbestandteil. Auch ein korrektes Ziel ist unerreichbar, wenn an einem Elternverzeichnis das `x`-Recht fehlt. Berücksichtige außerdem read-only Mounts, ACLs, SELinux/AppArmor und den Benutzer, unter dem ein Dienst tatsächlich läuft.

**Primärquellen:** [GNU Coreutils Manual](https://www.gnu.org/software/coreutils/manual/coreutils.html), [Linux man-pages: inode](https://man7.org/linux/man-pages/man7/inode.7.html), [sudo documentation](https://www.sudo.ws/docs/)
