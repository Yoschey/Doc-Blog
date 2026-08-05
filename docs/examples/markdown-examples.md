---
title: Artikel im DevOps-Lexikon schreiben
description: Markdown, VitePress-Blöcke, Lernmetadaten und Qualitätsregeln für neue Artikel.
learning:
  level: Redaktion · Einstieg
  duration: 25 Minuten
  goals:
    - einen Artikel mit klarer Überschriftenstruktur verfassen.
    - Code, Hinweise, Tabellen und Details passend einsetzen.
    - Lernziel, Praxisauftrag und Quellen nachvollziehbar dokumentieren.
  terms: [Markdown, Frontmatter, Codeblock, Callout, Quelle]
  practice: Lege einen kleinen Entwurfsartikel mit zwei Lernzielen, einem getesteten Beispiel, einem Warnhinweis und zwei Wissensfragen an. Prüfe ihn im lokalen Build.
  next: /api-examples
---

# Artikel im DevOps-Lexikon schreiben

Ein guter Lernartikel beantwortet eine konkrete Frage, erklärt zuerst das mentale Modell und zeigt dann ein überprüfbares Beispiel. Produktbefehle ohne Kontext veralten schnell.

## Grundstruktur

```markdown
---
title: Verständlicher Titel
description: Ein Satz für Suche und Vorschau.
learning:
  level: Einstieg
  duration: 30 Minuten
  goals:
    - ein beobachtbares Lernziel.
  terms: [Begriff A, Begriff B]
  practice: Eine sichere und konkrete Aufgabe.
  next: /passender/folgeartikel
---

# Verständlicher Titel

Kurze Einordnung: Problem, Nutzen und Geltungsbereich.

## Mentales Modell

## Schrittweises Beispiel

## Typische Fehler

## Checkliste

## Primärquellen
```

## Überschriften

- genau eine `#`-Überschrift pro Seite,
- `##` für Hauptabschnitte,
- Ebenen nicht überspringen,
- beschreibende Texte statt „Allgemein“ oder „Sonstiges“,
- wichtige Begriffe in der Überschrift, aber kein Keyword-Stuffing.

## Codeblöcke

Sprache für Syntaxhervorhebung angeben:

````markdown
```powershell
Get-Service | Where-Object Status -eq 'Running'
```
````

Ein Beispiel braucht:

- Voraussetzungen,
- erwartete Wirkung,
- sicheren Geltungsbereich,
- Erfolgsprüfung,
- bei Änderungen einen Rückweg.

Keine echten Secrets, internen Hostnamen oder personenbezogenen Daten verwenden. Nutze reservierte Beispieldomains wie `example.test`.

## Hervorhebungsblöcke

```markdown
::: tip Praxis-Tipp
Hilfreicher Hinweis ohne Sicherheitsrisiko.
:::

::: warning Vorher prüfen
Mögliche Nebenwirkung oder notwendige Voraussetzung.
:::

::: danger Destruktive Aktion
Konkretes Risiko, exaktes Ziel und Rückweg nennen.
:::
```

## Tabellen

Tabellen eignen sich für echte Vergleiche:

```markdown
| Signal | Frage | Werkzeug |
|---|---|---|
| Log | Was ist passiert? | `journalctl` |
| Metrik | Wie stark und seit wann? | Monitoring |
| Trace | Wo entstand die Latenz? | Trace-Backend |
```

Lange Erklärungen nicht in schmale Tabellenzellen pressen.

## Aufklappbare Lösungen

```markdown
<details>
<summary>Musterlösung anzeigen</summary>

Die Lösung mit Begründung, nicht nur mit Endbefehl.

</details>
```

## Links

- interne Links relativ und ohne `.md`,
- Linktext beschreibt das Ziel,
- Primärquellen vor Blog-Zusammenfassungen,
- versionsabhängige Dokumentation kenntlich machen,
- keine nackten „hier“-Links.

## Qualitätscheck vor dem Pull Request

- [ ] Lernziele lassen sich beobachten oder prüfen.
- [ ] Zielgruppe und Voraussetzungen sind klar.
- [ ] Befehle wurden in einer sicheren Umgebung getestet.
- [ ] Risiken und Rückweg stehen vor verändernden Schritten.
- [ ] Fachbegriffe sind erklärt oder ins Lexikon verlinkt.
- [ ] Wissenscheck prüft Verständnis, nicht nur Erinnerung.
- [ ] Primärquellen sind aktuell und direkt verlinkt.
- [ ] lokaler Build findet keine toten Links.
- [ ] Sprache ist respektvoll, klar und frei von unnötigem Jargon.

Mehr zur Theme-Integration: [VitePress Runtime API](./api-examples).

**Primärquelle:** [VitePress Markdown Extensions](https://vitepress.dev/guide/markdown)
