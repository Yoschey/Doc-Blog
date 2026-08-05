---
title: Azubi-Lernplan DevOps
description: Acht Lernmodule mit Kompetenzzielen, Praxis-Labs, Abnahmekriterien und Ausbildungsnachweis.
aside: false
---

# Azubi-Lernplan DevOps

Dieser Plan macht aus dem Lexikon einen begleiteten Einstieg. Er ist für acht Lernmodule ausgelegt; ein Modul kann je nach Vorwissen wenige Tage oder zwei Wochen dauern. Entscheidend ist nicht die Kalenderwoche, sondern der nachgewiesene Kompetenzstand.

<div class="reading-path"><strong>Prinzip</strong>Verstehen → im Lab ausführen → Ergebnis belegen → einer anderen Person erklären → Feedback einarbeiten.</div>

## Kompetenzstufen

| Stufe | Die lernende Person kann … |
|---|---|
| 1 · Erinnern | Begriffe korrekt wiedergeben und Beispiele erkennen |
| 2 · Verstehen | Zusammenhänge in eigenen Worten erklären |
| 3 · Anwenden | einen beschriebenen Ablauf in einer Testumgebung ausführen |
| 4 · Analysieren | Fehler mit Messungen eingrenzen und Alternativen vergleichen |
| 5 · Gestalten | eine sichere, dokumentierte Lösung selbstständig entwerfen |

## Acht Lernmodule

<div class="curriculum-grid">
  <div class="curriculum-card"><small>Modul 1 · Orientierung</small><h3>DevOps & Arbeitsweise</h3><p>Gemeinsame Verantwortung, Feedback, kleine Änderungen, Deployment und Release.</p></div>
  <div class="curriculum-card"><small>Modul 2 · Versionskontrolle</small><h3>Git & Zusammenarbeit</h3><p>Working Tree, Stage, Commit, Branch, Remote, Pull Request und Review.</p></div>
  <div class="curriculum-card"><small>Modul 3 · Systeme</small><h3>Linux & Netzwerk</h3><p>Pfade, Rechte, Prozesse, Dienste, Ports, DNS, HTTP und TLS.</p></div>
  <div class="curriculum-card"><small>Modul 4 · Automation</small><h3>Shell & PowerShell</h3><p>Objekte, Pipelines, Parameter, Fehler, Logs, Exit Codes und sichere Wiederholung.</p></div>
  <div class="curriculum-card"><small>Modul 5 · Delivery</small><h3>CI/CD & Artefakte</h3><p>Build, Test, Quality Gates, Environments, Secrets, Deployment und Rollback.</p></div>
  <div class="curriculum-card"><small>Modul 6 · Plattform</small><h3>Container & IaC</h3><p>Images, Container, Volumes, reproduzierbare Builds und deklarative Infrastruktur.</p></div>
  <div class="curriculum-card"><small>Modul 7 · Zuverlässigkeit</small><h3>Observability & Security</h3><p>Logs, Metriken, Traces, SLOs, Least Privilege und Supply Chain.</p></div>
  <div class="curriculum-card"><small>Modul 8 · Betrieb</small><h3>Incident & Abschluss</h3><p>Auswirkung begrenzen, Hypothesen prüfen, kommunizieren, dokumentieren und lernen.</p></div>
</div>

## Empfohlener Ablauf pro Modul

### 1. Einstiegsgespräch · 15 Minuten

- Was weißt du bereits?
- Wo begegnet dir das Thema im Betrieb?
- Welche Systeme darfst du im Lab verwenden?
- Woran erkennen wir am Ende, dass du das Ziel erreicht hast?

### 2. Selbstlernen · 60–120 Minuten

Artikel lesen, unbekannte Begriffe im [Lexikon](../lexikon/) nachschlagen und mindestens drei eigene Notizen erstellen. Copy & Paste zählt erst, wenn jede Option erklärt werden kann.

### 3. Praxis-Lab · 60–180 Minuten

Das passende [Lab](./labs) durchführen. Ausgangslage, Hypothesen, Befehle, Ergebnisse und Rückweg dokumentieren.

### 4. Review · 20–30 Minuten

Die lernende Person führt durch das Ergebnis. Ausbilder oder Buddy fragt nach Alternativen, Risiken und Belegen – nicht nach auswendig gelernten Befehlen.

### 5. Transfer · 15 Minuten

Eine reale, ungefährliche Beobachtungsaufgabe im Betrieb auswählen: zum Beispiel Pipeline lesen, Dashboard erklären oder ein bestehendes Runbook prüfen. Änderungen am Produktivsystem benötigen den normalen Freigabeweg.

## Lernplan und Nachweise

| Modul | Pflichtlektüre | Praxisnachweis | Abnahmefrage |
|---|---|---|---|
| 1 | [Was ist DevOps?](../grundlagen/was-ist-devops) | eigener Änderungsfluss | Wo entsteht heute die längste Rückmeldung? |
| 2 | [Git-Grundlagen](../grundlagen/git-grundlagen) | [Git-Lab](./lab-git) | Welche Änderung landet im nächsten Commit? |
| 3 | [Netzwerk](../grundlagen/netzwerk-grundlagen), [Rechte](../grundlagen/dateisystem-rechte) | [Linux-Lab](./lab-linux) | Welche Messung widerlegt deine Hypothese? |
| 4 | [PowerShell-Grundlagen](../Basis-Powershell) | [PowerShell-Lab](./lab-powershell) | Wie meldet dein Skript Fehler an CI? |
| 5 | [CI/CD-Grundlagen](../grundlagen/ci-cd-grundlagen) | Pipeline-Entwurf | Ist das getestete Artefakt das ausgelieferte? |
| 6 | [Container](../devops/container-grundlagen), [IaC](../devops/infrastructure-as-code) | [Container-&-CI-Lab](./lab-container-ci) | Wo liegt persistenter Zustand? |
| 7 | [Observability](../devops/observability), [CI/CD Security](../security/cicd-security) | Dashboard-/Policy-Review | Welches Signal ist für Nutzer relevant? |
| 8 | [Troubleshooting](../grundlagen/troubleshooting) | [Incident-Lab](./lab-incident) | Wie belegst du Wiederherstellung? |

## Bewertung: 20-Punkte-Raster

| Bereich | 0 Punkte | 1–2 Punkte | 3–4 Punkte |
|---|---|---|---|
| Verständnis | Begriffe verwechselt | teilweise korrekt | klar erklärt und abgegrenzt |
| Ausführung | nicht reproduzierbar | mit Hilfe ausführbar | selbstständig und sicher |
| Diagnose | zufällige Befehle | einzelne Hypothesen | priorisierte Hypothesen mit Belegen |
| Sicherheit | Risiken ignoriert | Risiken genannt | Rechte, Daten und Rückweg aktiv berücksichtigt |
| Dokumentation | fehlt | Schritte vorhanden | Ziel, Befund, Verifikation und Reflexion vollständig |

16–20 Punkte zeigen sichere Anwendung im Lab. Eine niedrigere Punktzahl ist kein „Durchfallen“, sondern bestimmt den nächsten Übungsschwerpunkt.

## Regeln für eine sichere Lernumgebung

- ausschließlich freigegebene Testressourcen verwenden,
- keine echten Secrets oder personenbezogenen Daten,
- Kostenlimits und automatische Abschaltung für Cloud-Labs,
- keine Internet-Exposition ohne Review,
- Snapshots oder reproduzierbare Ausgangslage,
- Rückweg vor jeder privilegierten Änderung,
- Laborressourcen nach der Übung kontrolliert abbauen.

## Für den Ausbildungsnachweis

Nutze die [Vorlage für den Ausbildungsnachweis](./ausbildungsnachweis). Sie trennt Tätigkeiten von gelerntem Zusammenhang und enthält einen Abschnitt für Datenschutz und Arbeitssicherheit.
