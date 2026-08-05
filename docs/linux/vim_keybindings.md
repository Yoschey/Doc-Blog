---
title: Vim-Grundlagen und Keybindings
description: Modi, Bewegungen, Operatoren, Suche und sichere Dateiänderungen in Vim verstehen.
learning:
  level: Einstieg
  duration: 35 Minuten
  goals:
    - Normal-, Insert-, Visual- und Command-Line-Mode unterscheiden.
    - Bewegungen mit Operatoren wie delete, change und yank kombinieren.
    - Änderungen prüfen, rückgängig machen und sicher speichern.
  terms: [Mode, Motion, Operator, Register, Buffer]
  practice: Öffne die Vim-Übungsdatei, löse alle Aufgaben ohne Pfeiltasten und beschreibe drei Befehle als Operator plus Bewegung.
  next: /vim-motion-test
---

# Vim-Grundlagen und Keybindings

Vim ist modal: Dieselbe Taste hat je nach Modus eine andere Bedeutung. Im **Normal Mode** navigierst und kombinierst Befehle, im **Insert Mode** schreibst du Text.

## Modi

| Ziel | Taste |
|---|---|
| Normal Mode | `Esc` |
| vor Cursor einfügen | `i` |
| nach Cursor einfügen | `a` |
| neue Zeile darunter | `o` |
| Visual Mode | `v` |
| zeilenweise Auswahl | `V` |
| Command-Line Mode | `:` |

Wenn du unsicher bist, drücke `Esc` und beginne den Befehl im Normal Mode.

## Bewegungen

| Bewegung | Taste |
|---|---|
| links, unten, oben, rechts | `h`, `j`, `k`, `l` |
| nächstes / vorheriges Wort | `w`, `b` |
| Wortende | `e` |
| Zeilenanfang / erstes Zeichen | `0`, `^` |
| Zeilenende | `$` |
| Dateianfang / -ende | `gg`, `G` |
| zu Zeile 42 | `42G` oder `:42` |
| passendes Klammerzeichen | `%` |

Zahlen wiederholen Bewegungen: `5j` geht fünf Zeilen nach unten, `3w` drei Wörter weiter.

## Operator + Bewegung

Vim-Befehle bilden eine kleine Sprache:

- `d` delete,
- `c` change,
- `y` yank/kopieren,
- gefolgt von einer Bewegung.

| Befehl | Bedeutung |
|---|---|
| `dw` | bis zum nächsten Wort löschen |
| `ciw` | Inhalt des aktuellen Wortes ändern |
| `d$` | bis Zeilenende löschen |
| `yy` | aktuelle Zeile kopieren |
| `3dd` | drei Zeilen löschen |
| `p` / `P` | nach / vor Cursor einfügen |

## Suchen und Ersetzen

| Aktion | Befehl |
|---|---|
| vorwärts suchen | `/text` |
| rückwärts suchen | `?text` |
| nächster / vorheriger Treffer | `n` / `N` |
| Zeichen in Zeile suchen | `fX` |
| wiederholen / umkehren | `;` / `,` |
| aktuelle Zeile ersetzen | `:s/alt/neu/g` |
| ganze Datei ersetzen | `:%s/alt/neu/gc` |

Das `c` fordert Bestätigung pro Treffer und ist für unbekannte Dateien sicherer.

## Rückgängig und wiederholen

| Aktion | Taste |
|---|---|
| rückgängig | `u` |
| wiederholen | `Ctrl-r` |
| letzten Änderungsbefehl wiederholen | `.` |

## Dateien

| Aktion | Befehl |
|---|---|
| speichern | `:w` |
| speichern und schließen | `:wq` |
| schließen, wenn unverändert | `:q` |
| Änderungen verwerfen | `:q!` |
| andere Datei öffnen | `:edit DATEI` |
| Buffer-Liste | `:buffers` |
| nächsten Buffer öffnen | `:bnext` |

Vor `:q!` bewusst prüfen: Nicht gespeicherte Änderungen gehen verloren.

## Hilfe im Editor

```vim
:help motion.txt
:help operator
:help :substitute
:help user-manual
```

Starte danach den [Vim Motion Test](./vim-motion-test).

**Primärquelle:** [Vim documentation](https://vimhelp.org/)
