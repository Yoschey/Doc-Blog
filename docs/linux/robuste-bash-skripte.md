---
title: Robuste Bash-Skripte
description: Defensive Bash-Skripte mit Quoting, Fehlerbehandlung, Traps und sicheren temporären Dateien.
---

# Robuste Bash-Skripte – kleine Programme ernst nehmen

Bash eignet sich hervorragend zum Verbinden vorhandener Unix-Werkzeuge. Sobald ein Skript produktive Daten verändert, in CI läuft oder von anderen Menschen genutzt wird, braucht es jedoch dieselbe Sorgfalt wie anderes Programmcode.

<div class="tag-row"><span class="tag">Bash</span><span class="tag">Shell</span><span class="tag">Automation</span><span class="tag">Defensive Coding</span></div>

## Ein solides Grundgerüst

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

readonly script_name="${0##*/}"

log() {
  printf '%s [%s] %s\n' "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" "$script_name" "$*" >&2
}

die() {
  log "ERROR: $*"
  exit 1
}

main() {
  [[ $# -eq 1 ]] || die "Usage: $script_name <config-file>"
  local config_file=$1
  [[ -r $config_file ]] || die "Not readable: $config_file"

  log "Processing $config_file"
}

main "$@"
```

Die Optionen:

- `-e`: beendet bei bestimmten fehlgeschlagenen Kommandos,
- `-u`: Zugriff auf nicht gesetzte Variablen ist ein Fehler,
- `-o pipefail`: Pipeline schlägt fehl, wenn ein Teil fehlschlägt,
- `-E`: ERR-Trap wird in Funktionen und Subshells vererbt.

::: warning `set -e` ist kein Exception-System
Das Verhalten hat Ausnahmen, etwa in Bedingungen, Schleifen und Teilen von Kommandoverkettungen. Kritische Operationen weiterhin explizit prüfen und Skripte mit ShellCheck sowie Tests absichern.
:::

## Variablen immer quoten

Riskant:

```bash
rm $target
for file in $(find . -name '*.log'); do
  gzip $file
done
```

Besser:

```bash
rm -- "$target"

while IFS= read -r -d '' file; do
  gzip -- "$file"
done < <(find . -name '*.log' -print0)
```

Quoting verhindert Word Splitting und Glob Expansion. `--` beendet Optionen, damit ein Dateiname wie `-rf` nicht als Flag interpretiert wird.

## Arrays statt zusammengesetzter Strings

Riskant:

```bash
options="--archive --exclude $pattern"
tar $options "$source"
```

Besser:

```bash
options=(--archive)
[[ -n ${pattern:-} ]] && options+=(--exclude "$pattern")

tar "${options[@]}" -- "$source"
```

Ein Array erhält Argumentgrenzen. Ein String ist kein sicherer Ersatz für eine Argumentliste.

## Eingaben validieren

```bash
require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Required command missing: $1"
}

is_port() {
  [[ $1 =~ ^[0-9]+$ ]] && (( $1 >= 1 && $1 <= 65535 ))
}

require_command curl
is_port "${PORT:-}" || die "PORT must be between 1 and 65535"
```

Validierung erfolgt vor Nebenwirkungen. Pfade, Zahlen, erlaubte Werte und erforderliche Werkzeuge gehören an den Anfang.

## Temporäre Dateien sicher erzeugen

```bash
tmp_dir=$(mktemp -d)

cleanup() {
  local exit_code=$?
  rm -rf -- "$tmp_dir"
  exit "$exit_code"
}

trap cleanup EXIT
trap 'die "Interrupted"' INT TERM
```

Der Zielpfad stammt direkt aus `mktemp`, ist gesetzt und wird gequotet. Vor rekursiven Löschungen niemals auf leere oder selbst zusammengesetzte Pfade vertrauen.

Noch defensiver:

```bash
[[ -n ${tmp_dir:-} && -d $tmp_dir ]] || die "Invalid temporary directory"
rm -rf -- "$tmp_dir"
```

## Fehler mit Kontext melden

```bash
on_error() {
  local exit_code=$?
  local line_no=$1
  log "Command failed at line $line_no with exit code $exit_code"
  exit "$exit_code"
}

trap 'on_error "$LINENO"' ERR
```

Keine Secrets oder vollständigen Kommandozeilen in Fehlerlogs ausgeben. Argumente können Tokens enthalten.

## HTTP-Aufrufe richtig prüfen

```bash
response_file=$(mktemp)

http_code=$(curl \
  --silent \
  --show-error \
  --location \
  --connect-timeout 5 \
  --max-time 30 \
  --retry 3 \
  --retry-all-errors \
  --output "$response_file" \
  --write-out '%{http_code}' \
  'https://example.com/health') || die 'Request failed'

[[ $http_code == 200 ]] || die "Unexpected HTTP status: $http_code"
```

Transporterfolg und HTTP-Status sind getrennte Dinge. Ein sauber empfangener `500` ist für curl nicht automatisch ein Netzwerkfehler.

## Idempotente Dateiaktualisierung

```bash
desired='feature_enabled=true'
config_file='/etc/example.conf'

if ! grep -Fxq "$desired" "$config_file"; then
  printf '%s\n' "$desired" | sudo tee -a "$config_file" >/dev/null
fi
```

Noch besser ist es, eine vollständige Datei in einem temporären Pfad zu erzeugen, zu validieren und atomar zu ersetzen.

```bash
new_file=$(mktemp)
render_config >"$new_file"
validate_config "$new_file"
install -m 0644 "$new_file" "$config_file"
```

## Geheimnisse schützen

- keine Tokens in Kommandoargumenten, wenn vermeidbar,
- `set -x` nicht in Secret-Kontexten,
- temporäre Dateien mit restriktiver Umask,
- Environment-Dumps vermeiden,
- Secrets über Dateideskriptor, geschützte Datei oder Secret-Tool beziehen.

```bash
umask 077
token_file=$(mktemp)
```

## ShellCheck und Formatierung

```bash
shellcheck script.sh
shfmt -d script.sh
```

ShellCheck findet viele Quoting-, Portabilitäts- und Fehlerbehandlungsprobleme. Ausnahmen sollten lokal und begründet deaktiviert werden.

## Tests

Wichtige Szenarien:

- fehlendes Argument,
- ungültige Datei,
- fehlendes externes Programm,
- Timeout und non-2xx HTTP-Status,
- Pfad mit Leerzeichen und Zeilenumbruch,
- wiederholte Ausführung,
- Abbruchsignal und Cleanup,
- teilweise bereits vorhandener Zielzustand.

Tests können in temporären Verzeichnissen laufen. Produktive Pfade und echte Zugangsdaten gehören nicht in Unit Tests.

## Review-Checkliste

- [ ] Beginnt das Skript mit einer eindeutigen Shell?
- [ ] Sind Variablen und Arrays korrekt gequotet?
- [ ] Werden Optionen mit `--` beendet?
- [ ] Sind Eingaben vor Nebenwirkungen validiert?
- [ ] Werden temporäre Dateien mit `mktemp` erzeugt?
- [ ] Räumt ein Trap zuverlässig auf?
- [ ] Haben Netzwerkaufrufe Timeouts?
- [ ] Ist wiederholte Ausführung sicher?
- [ ] Bleiben Secrets aus Logs und Prozessargumenten?
- [ ] Bestehen ShellCheck und Tests?

## Weiterführende Quellen

- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html)
- [ShellCheck](https://www.shellcheck.net/)

Passendes Konzept: [Idempotenz](../concepts/idempotenz).
