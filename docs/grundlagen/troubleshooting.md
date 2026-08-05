---
title: Systematisches Troubleshooting
description: Fehler mit Fakten, Hypothesen, kontrollierten Experimenten und sauberer Dokumentation eingrenzen.
learning:
  level: Einstieg
  duration: 35 Minuten
  goals:
    - Symptom, Ursache, Hypothese und Beweis unterscheiden.
    - eine reproduzierbare Diagnosekette planen.
    - Änderungen mit Risiko, Rückweg und Verifikation durchführen.
  terms: [Symptom, Hypothese, Baseline, Korrelation, Verifikation]
  practice: Nimm eine ungefährliche Störung aus einem Lab. Schreibe erst eine präzise Symptombeschreibung und drei priorisierte Hypothesen, bevor du einen Befehl ausführst. Belege anschließend, welche Hypothese zutraf.
  check:
    - question: Warum ist zeitliche Korrelation noch kein Ursachennachweis?
      answer: Zwei Ereignisse können gleichzeitig auftreten, ohne kausal verbunden zu sein. Es braucht einen Mechanismus und überprüfbare Evidenz.
    - question: Warum sollte pro Experiment nur eine Variable geändert werden?
      answer: Sonst lässt sich die beobachtete Wirkung keiner Änderung zuverlässig zuordnen und der Rückweg wird unklar.
    - question: Was gehört in eine Symptombeschreibung?
      answer: Beobachtung, erwartetes Verhalten, Umfang, Beginn, betroffene Nutzer oder Systeme und konkrete Messwerte – noch ohne angenommene Ursache.
  next: /lernwerkstatt/lab-linux
---

# Systematisches Troubleshooting

Troubleshooting ist eine Methode, kein besonderer Instinkt. Ziel ist nicht, möglichst viele Befehle auszuführen, sondern den Suchraum mit jeder Messung zu verkleinern und Veränderungen nachvollziehbar zu halten.

## Vier Dinge sauber trennen

| Begriff | Beispiel |
|---|---|
| Symptom | `POST /orders` liefert seit 10:12 Uhr bei 18 % der Anfragen HTTP 504 |
| Auswirkung | Bestellungen können zeitweise nicht abgeschlossen werden |
| Hypothese | Der Reverse Proxy erreicht eine überlastete Datenbankabhängigkeit nicht rechtzeitig |
| Ursache | Ein neuer Query-Plan erhöht die Datenbanklaufzeit über das Proxy-Timeout |

„Die Datenbank ist schuld“ ist weder Symptom noch Beweis.

## Der Diagnosezyklus

1. **Sicherheit:** Besteht Gefahr für Menschen, Daten oder weitere Systeme?
2. **Symptom:** Was genau weicht seit wann vom Erwarteten ab?
3. **Umfang:** Wer oder was ist betroffen – und wer ausdrücklich nicht?
4. **Änderungen:** Was hat sich kurz vorher nachweislich verändert?
5. **Hypothesen:** Welche Ursachen erklären alle bekannten Fakten?
6. **Messung:** Welche sichere Beobachtung unterscheidet Hypothese A von B?
7. **Experiment:** Eine kontrollierte Variable ändern.
8. **Verifikation:** Erfolg fachlich und technisch belegen.
9. **Dokumentation:** Ergebnis, Ursache, Rückweg und Folgearbeit festhalten.

## Eine gute Symptombeschreibung

Schlecht:

> Der Server ist langsam.

Besser:

> Seit 10:12 Uhr liegt der p95 der Route `POST /orders` in Region EU-West bei 8,2 s statt 0,9 s. GET-Routen und Region EU-Central sind nicht betroffen. Der Fehleranteil 504 beträgt 18 %.

Die zweite Form enthält Zeitpunkt, Messgröße, Soll/Ist, Umfang und Gegenbeispiele.

## Baseline und Vergleich

Ohne Normalzustand ist ein Messwert schwer zu bewerten. Vergleiche:

- vor und nach dem Beginn,
- betroffenes und gesundes System,
- neue und vorherige Version,
- unterschiedliche Regionen, Instanzen oder Nutzergruppen,
- Last, Fehler, Latenz und Sättigung im selben Zeitraum.

„CPU 70 %“ ist allein kein Problembeweis. Vielleicht sind 70 % normal, vielleicht blockiert die Anwendung trotz 5 % CPU auf I/O.

## Hypothesen priorisieren

Bewerte jede Hypothese nach:

- passt sie zu allen Fakten?
- wie wahrscheinlich ist sie?
- wie groß wäre die Auswirkung?
- wie schnell und sicher lässt sie sich prüfen?

Beginne oft mit der Hypothese, die sich schnell und risikoarm widerlegen lässt – nicht zwingend mit der spektakulärsten.

## Von außen nach innen

Für einen Webdienst kann die Kette so aussehen:

1. Kann der Nutzer den Namen auflösen?
2. Gibt es einen Netzpfad zum Zielport?
3. Funktioniert TLS mit dem erwarteten Namen?
4. Antwortet Proxy oder Load Balancer?
5. Erreicht er den Anwendungsdienst?
6. Ist die Anwendung bereit und nicht nur „laufend“?
7. Antworten Datenbank und externe Abhängigkeiten?
8. Sind Kapazität und Limits ausreichend?

Stoppe an der ersten nachweisbaren Abweichung und untersuche dort genauer.

## Änderungen während einer Störung

Vor jeder Änderung notieren:

- erwartete Wirkung,
- betroffenes Ziel,
- Risiko und mögliche Nebenwirkung,
- Rückweg,
- Abbruchkriterium,
- Messung nach der Änderung.

Mehrere spontane Änderungen gleichzeitig können das Symptom verdecken, neue Fehler erzeugen und die spätere Ursachenanalyse unmöglich machen.

## Logs, Metriken und Traces

- **Metriken** zeigen Ausmaß und Verlauf.
- **Logs** liefern diskrete Ereignisse und Kontext.
- **Traces** verbinden einen Request über Dienstgrenzen.

Kombiniere sie über Zeitfenster, Service, Version und Request-/Trace-ID. Suche nicht nur nach `ERROR`: Eine abgelaufene Wartezeit kann als Warnung erscheinen, während der fachliche Fehler erst im Upstream sichtbar wird.

## Wenn Zeitdruck herrscht

Incident Response hat zwei parallele Ziele:

1. **Auswirkung begrenzen:** Traffic umleiten, fehlerhafte Funktion abschalten, auf bekannte Version zurückgehen.
2. **Ursache verstehen:** Beweise sichern, Timeline führen, Hypothesen prüfen.

Wiederherstellung darf vor vollständiger Ursachenklärung kommen. Sie sollte aber beobachtbar, autorisiert und reversibel sein.

## Abschlusskriterien

- Das ursprüngliche Symptom ist mit derselben Messung verschwunden.
- Wichtige Nutzerpfade funktionieren wieder.
- Fehlerquote, Latenz und Sättigung liegen im erwarteten Bereich.
- Es gibt keine neue Nebenwirkung.
- Temporäre Maßnahmen und Folgeaufgaben haben Owner und Termin.
- Ursache und Lernergebnis sind verständlich dokumentiert.

## Übungsmittel

Nutze die [Incident-Checkliste](../examples/incident-checkliste), das [Runbook-Template](../examples/runbook-vorlage) und [Lab 2: Linux-Fehlersuche](../lernwerkstatt/lab-linux).

**Primärquellen:** [Google SRE Workbook: Troubleshooting](https://sre.google/workbook/troubleshooting/), [Google SRE Book: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
