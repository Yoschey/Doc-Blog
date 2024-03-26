# Tmux Keybindings

## Sitzungsmanagement
- `tmux new -s <Name>` - Starte eine neue Tmux-Sitzung mit dem Namen `<Name>`
- `tmux attach -t <Name>` - Verbinde dich mit einer bestehenden Tmux-Sitzung namens `<Name>`
- `tmux switch -t <Name>` - Wechsle zu einer anderen Sitzung namens `<Name>`
- `tmux list-sessions` - Liste alle laufenden Sitzungen auf
- `tmux detach` (In Tmux: `Ctrl+b d`) - Aktuelle Sitzung verlassen

## Fenster und Tabs
- `Ctrl+b c` - Erstelle ein neues Fenster
- `Ctrl+b w` - Liste alle Fenster zum Auswählen auf
- `Ctrl+b n` - Wechsle zum nächsten Fenster
- `Ctrl+b p` - Wechsle zum vorherigen Fenster
- `Ctrl+b ,` - Benenne das aktuelle Fenster um
- `Ctrl+b &` - Schließe das aktuelle Fenster

## Panes (Bereiche)
- `Ctrl+b %` - Teile das Fenster vertikal
- `Ctrl+b "` - Teile das Fenster horizontal
- `Ctrl+b o` - Wechsle zum nächsten Bereich
- `Ctrl+b x` - Schließe den aktuellen Bereich
- `Ctrl+b z` - Maximiere den aktuellen Bereich bzw. stelle ihn wieder her
- `Ctrl+b <Pfeiltasten>` - Wechsle zwischen Bereichen

## Sonstiges
- `Ctrl+b [` - Aktiviere den Kopiermodus zum Scrollen und Kopieren von Text
- `Ctrl+b ]` - Füge den kopierten Inhalt ein