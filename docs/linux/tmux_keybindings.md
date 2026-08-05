---
title: Tmux – Sessions, Fenster und Panes
description: Terminal-Sessions sicher weiterführen, aufteilen und mit klaren Keybindings bedienen.
learning:
  level: Einstieg
  duration: 25 Minuten
  goals:
    - Session, Window und Pane unterscheiden.
    - eine Sitzung verlassen, ohne Prozesse zu beenden.
    - Copy Mode und grundlegende Navigation verwenden.
  terms: [tmux, Session, Window, Pane, Prefix]
  practice: Erstelle eine benannte Session mit zwei Fenstern und drei Panes. Trenne die Verbindung, verbinde dich erneut und kopiere eine Zeile aus dem Scrollback.
  next: /vim_keybindings
---

# Tmux – Terminal-Sessions, die bleiben

Tmux ist ein Terminal-Multiplexer. Eine **Session** kann mehrere **Windows** enthalten; jedes Window kann in **Panes** geteilt werden. Die Session läuft weiter, wenn die SSH-Verbindung abbricht oder du sie bewusst detachst.

::: warning Kein Prozessmanager
Tmux ist praktisch für interaktive Arbeit, ersetzt aber für dauerhafte Dienste weder systemd noch Container-Orchestrierung. Kritische Prozesse brauchen überwachten Start, Restart-Regeln, Logs und Ownership.
:::

## Session verwalten

```bash
tmux new-session -s lab
tmux list-sessions
tmux attach-session -t lab
tmux rename-session -t lab devops-lab
```

Standard-Prefix ist `Ctrl-b`. Drücke Prefix, lasse los und drücke danach die zweite Taste.

| Aktion | Tasten |
|---|---|
| Session detach | `Ctrl-b d` |
| Hilfe anzeigen | `Ctrl-b ?` |
| Session auswählen | `Ctrl-b s` |
| Kommandozeile | `Ctrl-b :` |

## Windows

| Aktion | Tasten |
|---|---|
| neues Window | `Ctrl-b c` |
| nächstes / vorheriges | `Ctrl-b n` / `Ctrl-b p` |
| Window nach Nummer | `Ctrl-b 0` bis `9` |
| umbenennen | `Ctrl-b ,` |
| Liste anzeigen | `Ctrl-b w` |
| aktuelles schließen | Shell mit `exit` beenden |

## Panes

| Aktion | Tasten |
|---|---|
| horizontal teilen | `Ctrl-b "` |
| vertikal teilen | `Ctrl-b %` |
| Pane wechseln | `Ctrl-b` + Pfeiltaste |
| Pane vergrößern | `Ctrl-b z` |
| Pane-Nummern zeigen | `Ctrl-b q` |
| Layout wechseln | `Ctrl-b Space` |

Schließe eine Shell vorzugsweise mit `exit`. `Ctrl-b x` beendet das Pane nach Rückfrage.

## Copy Mode

```text
Ctrl-b [     Copy Mode öffnen
Pfeile/PgUp navigieren
Space        Auswahl starten (je nach Key-Mode)
Enter        Auswahl kopieren
Ctrl-b ]     tmux-Puffer einfügen
q            Copy Mode verlassen
```

Mit Vim-Tasten:

```text
set-window-option -g mode-keys vi
```

## Kleine sichere Konfiguration

`~/.tmux.conf`:

```text
set -g mouse on
set -g history-limit 50000
set -g base-index 1
setw -g pane-base-index 1
set -g renumber-windows on
set -g status-interval 5
```

Neu laden:

```bash
tmux source-file ~/.tmux.conf
```

## SSH-Praxis

- Session vor längerer Arbeit benennen.
- Keine Secrets dauerhaft im Scrollback anzeigen.
- Verwaiste Sessions regelmäßig prüfen.
- Parallele produktive Shells sichtbar unterscheiden.
- Für Änderungen weiterhin Runbook, Freigabe und Rückweg verwenden.

**Primärquelle:** [tmux manual](https://man.openbsd.org/tmux)
