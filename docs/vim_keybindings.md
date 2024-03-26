# Vim Keybindings

## Navigation
- `h` - Nach links bewegen
- `j` - Nach unten bewegen
- `k` - Nach oben bewegen
- `l` - Nach rechts bewegen
- `w` - Zum nächsten Wortanfang springen
- `e` - Zum Wortende springen
- `b` - Zum Wortanfang zurück springen
- `0` - Zum Anfang der Zeile springen
- `$` - Zum Ende der Zeile springen
- `gg` - Zum Anfang des Dokuments springen
- `G` - Zum Ende des Dokuments springen

## Bearbeiten
- `i` - In den Einfügemodus wechseln
- `a` - Nach dem Cursor in den Einfügemodus wechseln
- `o` - Eine neue Zeile unter dem Cursor öffnen und in den Einfügemodus wechseln
- `O` - Eine neue Zeile über dem Cursor öffnen und in den Einfügemodus wechseln
- `x` - Das Zeichen unter dem Cursor löschen
- `dd` - Die aktuelle Zeile löschen
- `yy` - Die aktuelle Zeile kopieren
- `p` - Den Inhalt der Zwischenablage unter dem Cursor einfügen
- `u` - Die letzte Operation rückgängig machen
- `Ctrl` + `r` - Die letzte rückgängig gemachte Operation wiederholen

## Suchen und Ersetzen
- `/` gefolgt von `Suchbegriff` und `Enter` - Vorwärts nach einem Wort oder einer Phrase suchen
- `?` gefolgt von `Suchbegriff` und `Enter` - Rückwärts nach einem Wort oder einer Phrase suchen
- `:%s/alt/neu/g` - 'alt' im gesamten Dokument durch 'neu' ersetzen

## Speichern und Verlassen
- `:w` - Änderungen speichern
- `:q` - Vim verlassen
- `:wq` oder `:x` - Speichern und verlassen
- `:q!` - Ohne zu speichern verlassen