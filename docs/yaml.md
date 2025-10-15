# YAML („.yml/.yaml“) – der praktische Komplett-Guide

YAML ist ein menschenlesbares Datenformat, ideal für Konfigurationen (Docker, Azure DevOps, Ansible…). Dieser Guide ist als **Nachschlagewerk** gedacht: kurz, präzise, mit vielen Beispielen und Best Practices.

---

## 1) Grundprinzipien

- **Einrückung = Struktur.** Verwende **Leerzeichen, keine Tabs** (meist 2 oder 4 Spaces).
- **Kommentare** mit `#` (bis Zeilenende).
- **Dokumente** in einem Stream:  
  `---` (Start, optional) und `...` (Ende, selten nötig). Eine Datei kann mehrere Dokumente enthalten.
- **Datenmodelle**  
  - **Skalar** (einzelner Wert)  
  - **Sequenz** (Liste)  
  - **Mapping** (Schlüssel-Wert-Paare / Objekt)

---

## 2) Syntax-Basics

### Mappings (Objekte)
```yaml
server:
  host: example.com
  port: 443
  https: true
```

**Inline/Flow-Style**:
```yaml
server: {host: example.com, port: 443, https: true}
```

### Sequenzen (Listen)
```yaml
items:
  - one
  - two
  - three
```

**Inline/Flow-Style**:
```yaml
items: [one, two, three]
```

### Skalare & Quoting
- Unquoted: `foo`, `123`, `true`  
- **Einfach** `'text'` → wörtlich, `\n` bleibt `\n`.  
- **Doppelt** `"text"` → Escape-Sequenzen möglich (`\n`, `\t`, `\"`, Unicode `\uXXXX`).

> Tipp: Wenn Sonderzeichen `:` oder `#` direkt **nach** dem Wert Probleme machen, setz den Wert in Anführungszeichen.

---

## 3) Mehrzeilige Strings

### Literal-Block (`|`) → Zeilenumbrüche bleiben erhalten
```yaml
message: |
  Zeile 1
  Zeile 2
```

### Gefalteter Block (`>`) → Zeilenumbrüche zu Leerzeichen gefaltet (Absätze leer lassen)
```yaml
summary: >
  Das hier wird zu einer
  einzelnen logischen Zeile.

  Leerzeile erzeugt Absatz.
```

### Chomping-Indikatoren
- `|-` → abschließenden Zeilenumbruch **entfernen**
- `|+` → **behalten/anhängen**
(gleiches gilt für `>`)

---

## 4) Datentypen & YAML-1.1 vs 1.2

- **Bool**: `true/false` (klein) sind sicher.  
  YAML 1.1 interpretiert auch `yes/no`, `on/off` als Bool – YAML 1.2 **nicht mehr**.  
  → **Best Practice:** immer `true`/`false` verwenden.
- **Null**: `null`, `~`, oder leerer Wert (`key:`). Empfehlung: `null`.
- **Zahlen**:  
  - Dezimal: `42`  
  - Float: `3.14`  
  - Hex: `0xFF`  
  - **Falle (1.1):** `012` → **oktal**. Vermeide führende Nullen bei Dezimalzahlen.
- **Zeit/Datum** (ISO-8601): `2025-03-04` oder `2025-03-04T13:45:00Z`.

---

## 5) Anker, Aliasse & Merge-Keys (wichtig!)

```yaml
defaults: &def
  retries: 3
  timeout: 30s

jobA:
  <<: *def
  timeout: 60s
jobB:
  <<: *def
```

---

## 6) Tags & benutzerdefinierte Typen (fortgeschritten)

```yaml
value: !!str 123
price: !!float "1e3"
when: !!timestamp "2025-01-01T00:00:00Z"
```

---

## 7) Gängige Muster (rezepthaft)

```yaml
users:
  alice:
    id: 1
    admin: true
  bob:
    id: 2
    admin: false

users_list:
  - name: alice
    id: 1
  - name: bob
    id: 2
```

---

## 8) Häufige Fehler & Stolperfallen

- **Tabs**: YAML erlaubt nur **Spaces**. Tabs führen zu schwer auffindbaren Fehlern.
- **Uneinheitliche Einrückung** (2/4 Spaces mischen) → Parserfehler.
- **Doppelte Keys** in demselben Mapping: oft überschrieben, **ohne Warnung**.
- **Boolean-Fallen** (`on/off`, `yes/no`) je nach Parser/Spezifikation anders – bleib bei `true/false`.
- **Trailing Spaces** können die Blockstring-Interpretation verändern.

---

## 9) Best Practices

- **Konsistente Einrückung** (Team-Konvention festlegen, z. B. 2 Spaces).
- **Schlüssel kebab_case oder snake_case**, keine Leerzeichen.
- **Anker/Aliasse** nutzen, statt Copy-Paste.
- **Kleine, modulare Dateien**; große Konfigurationen splitten.
- **Linter**: `yamllint`, `prettier-plugin-yaml`.
- **Security**: In Sprachen wie Python immer `safe_load` verwenden.

---

## 10) Tooling & Konvertierung

```bash
yq '.server.host' config.yml
yq -i '.server.port = 8080' config.yml
```

---

## 11) YAML in Programmiersprachen

### Python
```python
import yaml
with open("config.yml") as f:
    data = yaml.safe_load(f)
data["server"]["port"] = 8080
with open("config.yml", "w") as f:
    yaml.safe_dump(data, f, sort_keys=False)
```

### JavaScript / TypeScript
```ts
import yaml from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';
const doc = yaml.load(readFileSync('config.yml', 'utf8')) as any;
doc.server.port = 8080;
writeFileSync('config.yml', yaml.dump(doc, { lineWidth: 120 }));
```

### Go
```go
type Config struct {
  Server struct {
    Host string `yaml:"host"`
    Port int    `yaml:"port"`
  } `yaml:"server"`
}
```

---

## 12) Praxisbeispiele

### docker-compose
```yaml
version: "3.9"
services:
  web:
    image: nginx:stable
    ports: ["8080:80"]
    environment:
      - NGINX_HOST=example.com
    volumes:
      - ./site:/usr/share/nginx/html:ro
```

### Azure DevOps Pipeline
```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'

steps:
- task: DotNetCoreCLI@2
  inputs:
    command: 'build'
    projects: '**/*.csproj'
    arguments: '--configuration $(buildConfiguration)'

- task: DotNetCoreCLI@2
  inputs:
    command: 'test'
    projects: '**/*Tests.csproj'
```

---

## 13) Mini-Cheatsheet

```yaml
# Kommentar
key: value
list:
  - a
  - b
str1: "mit \n Escape"
str2: 'wörtlich \n'
block_literal: |
  foo
  bar
block_folded: >
  foo
  bar
defaults: &def
  timeout: 30
svc:
  <<: *def
  timeout: 60
bool: true
nullval: null
date: 2025-01-01
inline_map: {a: 1, b: 2}
inline_list: [1, 2, 3]
```

---

## 14) Troubleshooting-Checkliste

- Parserfehler? → Tabs entfernen, Einrückung prüfen, Kolon `:` nach Keys, Leerzeichen danach.
- Unerwartete Typen? → Strings quoten, z. B. `"0123"`, `"on"`, `"1e3"`.
- Werte „verschwinden“? → doppelte Keys vermeiden.
- Multiline seltsam? → `|` vs `>` prüfen.
- Merge/Alias greift nicht? → `<<: *alias` nur in **Mappings**.

---

**Autor:** Yoschey YAML Guide – Stand 2025  
Lizenz: frei verwendbar für Dokumentation & Schulung
