---
title: IT- & DevOps-Grundlagen
description: Der verständliche Einstieg in Git, Netzwerke, Betriebssysteme, CI/CD, Cloud und Troubleshooting.
aside: false
---

# IT- & DevOps-Grundlagen

Hier beginnt der Lernpfad ohne vorausgesetztes Spezialwissen. Die Artikel erklären zuerst das mentale Modell, zeigen danach Befehle und enden mit einer kleinen Anwendung. Fachbegriffe kannst du jederzeit im [Lexikon A–Z](../lexikon/) nachschlagen.

<div class="reading-path"><strong>Empfehlung für Azubis</strong>Lies die Seiten in der angegebenen Reihenfolge. Notiere zu jedem Thema ein eigenes Beispiel und absolviere danach das passende Lab in der Lernwerkstatt.</div>

<div class="curriculum-grid">
  <div class="curriculum-card"><small>Modul 1</small><h3>Zusammenarbeit</h3><p><a href="./was-ist-devops">Was ist DevOps?</a> und <a href="./git-grundlagen">Git-Grundlagen</a></p></div>
  <div class="curriculum-card"><small>Modul 2</small><h3>Kommunikation</h3><p><a href="./netzwerk-grundlagen">Netzwerk-Grundlagen</a> und <a href="./http-dns-tls">HTTP, DNS & TLS</a></p></div>
  <div class="curriculum-card"><small>Modul 3</small><h3>Betriebssystem</h3><p><a href="./dateisystem-rechte">Dateisystem & Rechte</a> und <a href="./prozesse-dienste-ports">Prozesse, Dienste & Ports</a></p></div>
  <div class="curriculum-card"><small>Modul 4</small><h3>Auslieferung</h3><p><a href="./ci-cd-grundlagen">CI/CD-Grundlagen</a> und <a href="./cloud-grundlagen">Cloud-Grundlagen</a></p></div>
  <div class="curriculum-card"><small>Querschnitt</small><h3>Fehlersuche</h3><p><a href="./troubleshooting">Systematisches Troubleshooting</a> statt zufälligem Herumprobieren.</p></div>
  <div class="curriculum-card"><small>Praxis</small><h3>Lernwerkstatt</h3><p><a href="../lernwerkstatt/">Kompetenzplan</a> und <a href="../lernwerkstatt/labs">fünf begleitete Labs</a>.</p></div>
</div>

## Das gemeinsame Denkmodell

Bei fast jeder DevOps-Aufgabe arbeiten dieselben Ebenen zusammen:

1. **Änderung:** Quellcode oder Konfiguration wird in Git versioniert.
2. **Prüfung:** Automatisierte Tests bewerten die Änderung.
3. **Paket:** Ein reproduzierbares Artefakt entsteht.
4. **Auslieferung:** Das Artefakt wird kontrolliert in eine Umgebung gebracht.
5. **Betrieb:** Logs, Metriken und Alarme zeigen das reale Verhalten.
6. **Feedback:** Beobachtungen fließen in die nächste kleine Änderung ein.

Diese Kette ist wichtiger als ein einzelnes Produkt. GitHub, Azure DevOps, Docker oder Kubernetes sind Werkzeuge innerhalb der Kette – nicht DevOps selbst.

## Lernregel: erklären, ausführen, belegen

Ein Thema gilt erst dann als verstanden, wenn du:

- es ohne Produktnamen erklären kannst,
- ein kleines Beispiel selbst ausgeführt hast,
- Erfolg und Fehler anhand von Ausgaben belegen kannst,
- Risiko und Rückweg vor der Änderung benennen kannst,
- das Ergebnis so dokumentierst, dass jemand anderes es wiederholen kann.

::: warning Labor vor Produktion
Verwende für Übungen eine lokale VM, einen Test-Container oder ein ausdrücklich freigegebenes Testsystem. Produktivzugänge, echte Secrets und Kundendaten gehören nicht in Lernaufgaben.
:::

## Orientierung für Ausbilderinnen und Ausbilder

Der [Azubi-Lernplan](../lernwerkstatt/) enthält Lernwochen, Kompetenzziele und Abnahmekriterien. Die Labs sind bewusst lösungsoffen: Bewertet werden nicht nur funktionierende Befehle, sondern auch Hypothese, Sicherheitsprüfung, Dokumentation und Reflexion.
