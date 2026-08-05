---
title: "Lab 4: Container und CI"
description: Eine Mini-Anwendung als nicht-root Container bauen, lokal prüfen und durch eine CI-Pipeline schicken.
learning:
  level: Übung · Aufbau
  duration: 180 Minuten
  goals:
    - Build-Kontext, Image und laufenden Container unterscheiden.
    - ein kleines, reproduzierbares und nicht-root Image erstellen.
    - Build, Smoke Test und Artefaktnachweis in CI abbilden.
  terms: [Dockerfile, Image, Container, Registry, Smoke Test]
  practice: Baue das Lab vollständig, dokumentiere Image-Digest und Commit-Zuordnung und erkläre, welche Prüfung vor einem produktiven Push zusätzlich nötig wäre.
  next: /devops/observability
---

# Lab 4: Container und CI

## Szenario

Eine kleine statische Website soll reproduzierbar als Container laufen. Die Pipeline baut das Image, startet es lokal im Runner, prüft eine Kernfunktion und speichert einen nachvollziehbaren Build-Nachweis. Ein Push in eine Registry ist optional und nur für eine freigegebene Lab-Registry vorgesehen.

## Voraussetzungen

- Docker oder kompatible Container Engine,
- neues lokales Git-Repository,
- für CI ein Test-Repository ohne Secrets,
- keine Veröffentlichung ins Internet nötig.

## Ausgangsdateien

Erstelle eine `site/index.html` mit einem eindeutigen Versionsplatzhalter und eine Konfiguration für einen kleinen Webserver. Verwende ein gepflegtes, minimales Basis-Image.

## Dockerfile-Anforderungen

- Basis-Image mit konkreter Versionslinie, für höhere Reproduzierbarkeit optional Digest,
- nur notwendige Dateien im Image,
- nicht-root Benutzer zur Laufzeit,
- Port dokumentiert,
- Healthcheck oder externer Smoke Test,
- keine Build-Argumente oder Environment-Variablen für Secrets,
- `.dockerignore` für `.git`, Reports, lokale Abhängigkeiten und `.env*`.

## Lokale Prüfung

1. Image mit Tag aus kurzem Commit-SHA bauen.
2. Image-Historie und Größe prüfen.
3. Container read-only starten und nur einen unprivilegierten Host-Port veröffentlichen.
4. Prozessbenutzer im Container prüfen.
5. HTTP-Status und eindeutigen Seiteninhalt testen.
6. Container stoppen und entfernen.
7. Belegen, dass das Image weiterhin existiert und erneut startbar ist.

## CI-Pipeline

Die Pipeline soll:

1. Repository auschecken,
2. Dockerfile oder Containerdefinition statisch prüfen,
3. Image mit Commit-SHA bauen,
4. Container im Hintergrund starten,
5. mit begrenzten Wiederholungen auf Readiness warten,
6. Smoke Test ausführen,
7. Logs im Fehlerfall ausgeben,
8. Container in einem Always/Cleanup-Schritt entfernen,
9. Digest, Commit und Zeit als Build-Nachweis speichern.

::: warning Kein blindes Registry-Push
Das Lab ist bestanden, wenn Build und Test reproduzierbar sind. Ein Push benötigt zusätzlich Registry-Berechtigung, Namenskonzept, Scan, Aufbewahrung und Schutz vor untrusted Pull Requests.
:::

## Fehlerexperimente

Führe nacheinander jeweils **einen** Fehler ein:

- falscher interner Port,
- fehlende Website-Datei,
- Smoke Test erwartet falschen Inhalt,
- Prozess kann wegen Dateirechten nicht lesen.

Notiere für jeden Fehler:

| Fehler | früheste erkennbare Stufe | relevante Ausgabe | verbesserte Fehlermeldung |
|---|---|---|---|
| Beispiel | Build | `COPY failed` | fehlende Quelldatei vor Build prüfen |

## Abnahmekriterien

- Image läuft ohne root.
- Runtime enthält keine unnötigen Build-Werkzeuge.
- Build ist einem Commit zugeordnet.
- Smoke Test prüft Status **und** Inhalt.
- Fehlerfall hinterlässt verwertbare Logs.
- Cleanup läuft auch bei fehlgeschlagenem Test.
- Dokumentation nennt lokalen Start, Test und Rückweg.

## Vertiefung

- [Container-Grundlagen](../devops/container-grundlagen)
- [GitHub Actions CI/CD](../devops/github-actions-cicd)
- [Software Supply Chain](../security/software-supply-chain)
