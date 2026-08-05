---
title: VitePress Runtime API
description: Die Runtime-Daten dieser Dokumentationsseite sicher für eigene Komponenten verwenden.
learning:
  level: Redaktion · Aufbau
  duration: 20 Minuten
  goals:
    - site-, theme-, page- und frontmatter-Daten unterscheiden.
    - useData in Markdown und Vue-Komponenten verwenden.
    - sensible Werte aus statisch erzeugten Seiten fernhalten.
  terms: [VitePress, useData, Frontmatter, Theme, Static Site]
  practice: Erzeuge in einer lokalen Testseite eine Komponente, die Titel und letzte Aktualisierung anzeigt. Prüfe den statischen Build auf unbeabsichtigte Daten.
  next: /markdown-examples
---

# VitePress Runtime API

Diese Seite richtet sich an Personen, die das Lexikon selbst erweitern. VitePress stellt Seiten-, Theme- und Frontmatter-Daten über `useData()` bereit.

## Daten lesen

```vue
<script setup lang="ts">
import { useData } from 'vitepress'

const { site, theme, page, frontmatter, isDark } = useData()
</script>

<template>
  <dl>
    <dt>Seitentitel</dt>
    <dd>{{ page.title }}</dd>
    <dt>Sprache</dt>
    <dd>{{ site.lang }}</dd>
    <dt>Dark Mode</dt>
    <dd>{{ isDark ? 'aktiv' : 'inaktiv' }}</dd>
  </dl>
</template>
```

## Die vier Ebenen

| Wert | Inhalt |
|---|---|
| `site` | globale, aufgelöste Site-Konfiguration |
| `theme` | Daten aus `themeConfig` |
| `page` | Metadaten der aktuellen Markdown-Seite |
| `frontmatter` | YAML-Daten der aktuellen Seite |

## Lernmetadaten dieses Lexikons

Neue Fachartikel können individuelle Angaben setzen:

```yaml
learning:
  level: Einstieg
  duration: 30 Minuten
  goals:
    - einen klaren Lernerfolg beschreiben.
  terms: [Begriff A, Begriff B]
  practice: Eine konkrete Aufgabe in der Testumgebung.
  next: /start
```

Ohne Angaben erzeugt das Theme eine sinnvolle Standard-Lernübersicht.

::: danger Alles wird öffentlich gebaut
Frontmatter und Site-Konfiguration sind Teil der statisch erzeugten Website. Dort niemals Tokens, interne Endpunkte, personenbezogene Daten oder andere Secrets ablegen.
:::

**Primärquelle:** [VitePress Runtime API](https://vitepress.dev/reference/runtime-api#usedata)
