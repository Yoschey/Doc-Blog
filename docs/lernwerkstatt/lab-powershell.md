---
title: "Lab 3: PowerShell-Automation"
description: Aus einer manuellen Bestandsaufnahme eine validierte, testbare PowerShell-Funktion mit JSON-Report bauen.
learning:
  level: Übung · Grundlagen
  duration: 150 Minuten
  goals:
    - Objekte filtern und formatieren, ohne die Pipeline zu früh in Text umzuwandeln.
    - Parameter, Fehlerbehandlung und Exit Codes bewusst gestalten.
    - Kernverhalten mit Pester prüfen.
  terms: [Objektpipeline, Parameter, try/catch, JSON, Pester]
  practice: Implementiere die Funktion, führe Positiv- und Negativtest aus und gib Skript, Pester-Test sowie zwei Beispielreports ab.
  next: /grundlagen/ci-cd-grundlagen
---

# Lab 3: PowerShell-Automation

## Szenario

Ein Team prüft vor einer Installation manuell freien Speicher, Betriebssystem und Erreichbarkeit eines TCP-Ports. Du wandelst die Prüfung in eine wiederholbare Funktion um, die strukturierte Objekte ausgibt und optional einen JSON-Report schreibt.

## Voraussetzungen

- PowerShell 7,
- Schreibrecht in einem neuen lokalen Lab-Ordner,
- optional Pester 5 in der freigegebenen Umgebung,
- ein ungefährlicher lokaler oder freigegebener Testendpunkt.

## Funktionsvertrag

Implementiere `Test-DeploymentReadiness` mit diesen Parametern:

- `ComputerName` als Pflichtwert, Standardtests nur gegen `localhost`,
- `Port` als Zahl zwischen 1 und 65535,
- `MinimumFreeGB` größer oder gleich 0,
- optionaler `OutputPath` für JSON.

Die Funktion liefert **ein Objekt** mit mindestens:

```text
ComputerName
TimestampUtc
Port
PortReachable
SystemDrive
FreeGB
MinimumFreeGB
DiskReady
OverallReady
Errors
```

## Qualitätsregeln

- `[CmdletBinding()]` und typisierte Parameter verwenden.
- Eingaben mit Validate-Attributen begrenzen.
- erwartbare Fehler mit `try/catch` in verständliche Befunde umwandeln.
- keine Secrets oder vollständigen Benutzerpfade loggen.
- `Format-Table` nur beim Anzeigen, nie innerhalb der Datenfunktion.
- JSON mit einer expliziten Tiefe und UTF-8 schreiben.
- bei Dateiausgabe das Zielverzeichnis prüfen oder kontrolliert anlegen.

## Arbeitsschritte

1. Zuerst ein Beispielobjekt ohne echte Prüfungen zurückgeben.
2. Freien Speicher für das Systemlaufwerk ermitteln.
3. TCP-Erreichbarkeit mit engem Timeout prüfen.
4. Einzelergebnisse zu `OverallReady` kombinieren.
5. Fehlertexte in einer Liste sammeln.
6. Optionale JSON-Ausgabe ergänzen.
7. Hilfetext mit Synopsis, Description, Parameter und Example schreiben.

## Pester-Abnahme

Schreibe Tests für mindestens:

- ungültiger Port wird vor Funktionsausführung abgelehnt,
- Ergebnis enthält alle Vertragseigenschaften,
- `OverallReady` ist falsch, wenn eine Pflichtprüfung fehlschlägt,
- JSON-Datei wird am angeforderten Ort erzeugt,
- JSON lässt sich wieder einlesen und enthält denselben Computernamen.

Externe Netzwerkprüfungen dürfen für Unit-Tests gemockt werden. Ergänze einen separaten, optionalen Integrationstest für den echten lokalen Port.

## Negativtest

Verwende einen Port, an dem sicher kein Lab-Dienst lauscht. Die Funktion soll nicht mit einer unverständlichen Exception abbrechen, sondern ein Objekt mit `PortReachable = $false`, `OverallReady = $false` und einem hilfreichen Befund liefern.

## Abgabe

- Modul- oder Skriptdatei,
- Pester-Testdatei,
- JSON-Bericht für Erfolgs- und Fehlerfall,
- kurze README mit Ausführung und Exit-Code-Entscheidung,
- Reflexion: Was müsste für Remote-Systeme zusätzlich abgesichert werden?

## Vertiefung

- [PowerShell-Grundlagen](../Basis-Powershell)
- [Fehlerbehandlung & Logging](../windows/powershell-fehlerbehandlung)
- [Tests mit Pester](../windows/pester-testing)
