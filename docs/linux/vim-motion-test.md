---
title: Vim Motion Test
description: Interaktive Übungsdatei für Vim-Bewegungen, Operatoren, Suche und Wiederholung.
learning:
  level: Übung · Einstieg
  duration: 20 Minuten
  goals:
    - eine Datei ohne Pfeiltasten gezielt navigieren.
    - Operatoren und Bewegungen kombinieren.
    - Änderungen rückgängig machen und wiederholen.
  terms: [Motion, Operator, Count, Search, Repeat]
  practice: Öffne die Quelldatei dieser Seite direkt in Vim und löse alle Aufgaben. Stelle sie danach mit Git oder ohne Speichern wieder her.
  next: /tmux_keybindings
---

# Vim Motion Test

Öffne diese Markdown-Datei in Vim. Bleibe möglichst im Normal Mode und verwende keine Pfeiltasten oder Maus.

## Aufwärmen

1. Bewege dich mit `h`, `j`, `k`, `l` in alle Richtungen.
2. Springe mit `gg` zum Anfang und mit `G` zum Ende.
3. Gehe mit `12G` direkt zu Zeile 12.
4. Springe mit `0`, `^` und `$` an verschiedene Positionen derselben Zeile.

## Wörter

Verwende `w`, `b` und `e` in diesem Satz:

> Fünf flinke Admins prüfen zwölf robuste Pipeline-Artefakte.

Aufgaben:

1. Springe auf „Admins“.
2. Ändere „zwölf“ mit `ciw` in „acht“.
3. Lösche „robuste“ mit einem Operator und einer Wortbewegung.
4. Mache beide Änderungen mit `u` rückgängig.
5. Stelle die letzte Änderung mit `Ctrl-r` wieder her.

## Zeichen suchen

Übungszeile:

> healthcheck: status=ready latency=42ms region=eu-test

1. Springe mit `f=` zum ersten Gleichheitszeichen.
2. Wiederhole die Suche mit `;`.
3. Kehre sie mit `,` um.
4. Lösche mit `dt ` bis vor das nächste Leerzeichen.

## Operator plus Bewegung

1. Kopiere eine ganze Zeile mit `yy` und füge sie mit `p` darunter ein.
2. Lösche drei Zeilen mit Count und Operator.
3. Ändere den Inhalt zwischen den Anführungszeichen:

```text
environment="development"
```

4. Lösche den Inhalt innerhalb der Klammern:

```text
deploy(test, canary, eu-west)
```

## Suche und Ersetzen

Nutze die folgenden Zeilen:

```text
service-alpha: pending
service-beta: pending
service-gamma: pending
```

1. Suche `/pending`.
2. Springe mit `n` und `N` zwischen Treffern.
3. Ersetze in der ganzen Datei `pending` durch `ready`, aber bestätige jeden Treffer einzeln.
4. Mache die gesamte Ersetzung rückgängig.

## Abschluss-Challenge

- Ergänze am Anfang der Datei deinen Namen und UTC-Zeit.
- Navigiere zum Abschnitt „Operator plus Bewegung“ über die Suche.
- Kopiere die drei Service-Zeilen ans Dateiende.
- Ändere dort nur `service-beta` auf `failed`.
- Zeige mit `:set number` Zeilennummern an.
- Prüfe `:changes` und `:jumps`.
- Beende ohne Speichern oder stelle die Datei über Git wieder her.

## Reflexion

Erkläre diese Befehle als Grammatik aus Count, Operator, Textobjekt oder Bewegung:

- `3dd`
- `ciw`
- `di"`
- `d$`
- `2yw`

Zurück zu [Vim-Grundlagen](./vim_keybindings).
