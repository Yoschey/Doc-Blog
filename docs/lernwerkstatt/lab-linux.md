---
title: "Lab 2: Linux-Fehlersuche"
description: Einen fehlerhaften lokalen Dienst über systemd, Logs, Rechte, Bind-Adresse und HTTP eingrenzen.
learning:
  level: Übung · Grundlagen
  duration: 120 Minuten
  goals:
    - eine präzise Symptombeschreibung und priorisierte Hypothesen formulieren.
    - Dienstzustand, Log, Prozess, Port und HTTP-Antwort verbinden.
    - eine minimale Änderung mit Verifikation und Rückweg durchführen.
  terms: [systemd, Journal, Prozess, Port, Hypothese]
  practice: Führe das Lab auf einer wegwerfbaren Linux-VM durch und gib Diagnoseprotokoll, reparierte Unit-Datei und Verifikationsausgabe ab.
  next: /Basis-Powershell
---

# Lab 2: Linux-Fehlersuche

## Szenario

Ein lokaler HTTP-Dienst soll auf Port 8080 eine Datei ausliefern, startet aber nicht zuverlässig. Du bekommst eine absichtlich fehlerhafte systemd-Unit und musst den Fehler mit Belegen eingrenzen.

## Voraussetzungen

- wegwerfbare Linux-VM mit systemd und Python 3,
- sudo-Rechte innerhalb dieser VM,
- kein externer Netzwerkzugriff für den Dienst nötig.

## Vorbereitung

Lege unter `/tmp/dev-garage-lab/site` eine `index.html` mit eindeutigem Text an. Erstelle anschließend **mit Unterstützung der ausbildenden Person** eine Unit `/etc/systemd/system/dev-garage-lab.service`:

```ini
[Unit]
Description=Dev Garage training web service
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=/tmp/dev-garage-lab/missing
ExecStart=/usr/bin/python3 -m http.server 8080 --bind 127.0.0.1
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Der falsche Arbeitsordner ist beabsichtigt.

## Phase 1: Nur beobachten

Noch nichts ändern. Dokumentiere:

1. präzises Symptom,
2. erwarteten Zustand,
3. drei Hypothesen in Prioritätsreihenfolge,
4. erste sichere Messung für jede Hypothese.

Nutze danach mindestens:

- Unit-Status,
- Journal mit engem Zeitfenster,
- geladene Unit-Definition,
- Existenz und Rechte des Arbeitsordners,
- lauschende TCP-Ports.

## Phase 2: Änderung planen

Beantworte vor der Änderung:

- Welche einzelne Zeile ist falsch?
- Was ist der kleinste Korrekturschritt?
- Wie lautet der Rückweg?
- Welche Ausgaben belegen den Erfolg?

Korrigiere den Arbeitsordner über einen systemd-Drop-in oder die Unit-Datei. Führe den notwendigen Reload aus und starte den Dienst neu.

## Phase 3: Ende-zu-Ende verifizieren

`active (running)` reicht nicht. Belege:

1. Unit ist aktiv.
2. erwarteter Prozess läuft als erwarteter Benutzer.
3. Port 8080 lauscht nur an Loopback.
4. HTTP-Anfrage liefert Status 200.
5. Antwort enthält deinen eindeutigen Text.
6. Neustart des Dienstes funktioniert.

## Bonusfehler

Die ausbildende Person darf danach **einen** weiteren Fehler einbauen:

- Port bereits belegt,
- fehlendes Durchquerungsrecht an einem Verzeichnis,
- falscher Pfad zu Python,
- Bind-Adresse geändert,
- ungültige Option.

Die lernende Person beginnt erneut bei Symptom und Hypothese, ohne die erste Reparatur blind zu wiederholen.

## Abgabe

- Diagnoseprotokoll mit Zeitstempeln,
- finale Unit- oder Drop-in-Datei,
- relevante Status-, Port- und HTTP-Ausgaben,
- Erklärung der Ursache,
- Rückweg und Aufräumschritte.

## Aufräumen

Stoppe und deaktiviere ausschließlich die Lab-Unit. Entferne deren exakte Unit-Datei beziehungsweise Drop-in und `/tmp/dev-garage-lab`, lade systemd neu und belege, dass die Unit nicht mehr existiert. Keine Globs oder breiten Pfade verwenden.
