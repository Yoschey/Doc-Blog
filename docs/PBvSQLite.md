# PocketBase vs SQLite – Vergleich, Unterschiede & Anwendungsfälle

PocketBase **und** SQLite sind beides leichtgewichtige, dateibasierte Systeme, werden aber in **völlig unterschiedlichen Nutzungskontexten** eingesetzt.  
Hier kommt eine **klare Gegenüberstellung**, gefolgt von praxisnahen Beispielen, wann welches Tool mehr Sinn macht.  

---

## 🧩 Grundverständnis

| Merkmal | **PocketBase** | **SQLite** |
|----------|----------------|-------------|
| **Typ** | Backend-as-a-Service (BaaS) / Mini-Backend | Eingebettete relationale Datenbank |
| **Zweck** | Sofort nutzbares API-Backend mit Auth, File Storage, Admin-UI usw. | Reine Datenbank-Engine zum Speichern strukturierter Daten |
| **Architektur** | Server-App mit eingebautem REST/Realtime-API (Go-basiert) | Bibliothek, die in der App eingebettet wird |
| **Speicherformat** | Verwendet **intern SQLite** als Speicher-Engine | Arbeitet direkt mit `.sqlite` oder `.db` Datei |
| **API / Zugriff** | HTTP-API, WebSocket, JS/Go/REST-Clients | Direkt via SQL (z. B. über Python, Node.js, C) |
| **Benutzerverwaltung** | Eingebaut (User, Auth, Rollen, OAuth2) | Keine, muss man selbst implementieren |
| **Dateiuploads** | Integriert (File Storage via API) | Muss extern über Filesystem/Cloud geregelt werden |
| **Realtime-Funktion** | Ja (WebSockets / Abos auf Collection-Änderungen) | Nein (nur manuelle Polling-Mechanismen) |
| **Schema-Verwaltung** | GUI oder API-basiert | Manuell per SQL oder ORM |
| **Deployment** | Einfache Binärdatei (`pocketbase serve`) | Wird meist in Anwendungen eingebettet |
| **Offline-Verwendung** | Möglich, aber primär Server-basiert | Sehr gut geeignet, da lokal eingebettet |
| **Lizenz / Sprache** | Open Source (Go) | Open Source (C) |

---

## 🔗 Gemeinsamkeiten

| Bereich | Beschreibung |
|----------|---------------|
| **Leichtgewichtig** | Beide brauchen keinen separaten Datenbank-Server – laufen mit einer Datei. |
| **Schnellstart / Low-Overhead** | Ideal für Prototypen, lokale Tests oder kleine Projekte. |
| **Kein externer Dienst nötig** | Beide funktionieren offline und ohne Cloud-Abhängigkeit. |
| **Einfaches Deployment** | Ein Binary oder eine Datei – keine komplexe Installation. |
| **Transaktionssicher** | Beide unterstützen ACID-Transaktionen über SQLite. |

---

## ⚖️ Wesentliche Unterschiede in der Praxis

| Kategorie | **PocketBase** | **SQLite** |
|------------|----------------|-------------|
| Zugriffsebene | HTTP API + Echtzeit | SQL (direkt) |
| Backend-Logik | Enthält Logik (User mgmt, Files, Rules) | Keine Logik – nur Datenhaltung |
| Nutzung | Vollwertiges Mini-Backend | Nur Datenbankebene |
| Erweiterbarkeit | Plugins, Hooks (Go) | Erweiterbar per SQL-Funktionen, aber ohne Backendlogik |
| Lernkurve | Sehr flach für Web-/JS-Entwickler | SQL-Grundwissen nötig |
| Zielgruppe | Frontend-Dev, die ein fertiges Backend brauchen | Devs, die selbst Backendlogik schreiben wollen |

---

## 💡 Wann PocketBase mehr Sinn macht (3 Szenarien)

1. **Schnelle Prototypen / MVPs**  
   → Du brauchst in Minuten ein Backend mit Auth, File-Uploads und Realtime für eine Web- oder Mobile-App.  
   *Beispiel:* Prototyp eines Social-Feeds mit Login und Bild-Upload.

2. **Jamstack-/Frontend-Projekte ohne eigenes Backend**  
   → Du willst React/Vue/Svelte-Apps mit API-Backend betreiben, ohne Node-Server zu schreiben.  
   *Beispiel:* Portfolio-App, To-Do-Webapp, kleine CRM-App mit Auth und Live-Sync.

3. **Kleine Teams / interne Tools**  
   → Admin-UI inklusive, Datenverwaltung über Web-Interface.  
   *Beispiel:* Interne Projektverwaltung, Zeit-Tracking, Inventarliste mit Echtzeit-Ansicht.

---

## ⚙️ Wann SQLite mehr Sinn macht (3 Szenarien)

1. **Lokale Desktop- oder Mobile-Apps**  
   → App speichert Daten nur lokal, kein Server nötig.  
   *Beispiel:* Notiz-App, Passwortmanager, Offline-Rechnungsprogramm.

2. **Eingebettete Systeme / IoT**  
   → Gerät oder Embedded-System muss kleine Mengen an Daten persistent speichern.  
   *Beispiel:* Sensor-Datenlogger, Edge-Device, lokale Cache-DB für Telemetrie.

3. **Backend-Komponente mit individueller Logik**  
   → Du möchtest dein eigenes Backend in Node, Go oder Python bauen – und brauchst nur eine interne Datenbank.  
   *Beispiel:* Eigene REST-API mit Express/FastAPI, die SQLite nutzt.

---

## 🧠 Kurzfazit

| PocketBase | SQLite |
|-------------|---------|
| 🧩 Komplette Lösung: Auth, Storage, API, Admin-UI | ⚙️ Reine Engine für Datenspeicherung |
| 🌐 Ideal für Web/Mobile-Prototypen oder kleine SaaS-Tools | 💾 Ideal für lokale/offline Anwendungen |
| ⏱️ In 1 Minute lauffähig als Server-Binary | 📦 In jede App einbettbar, extrem klein |
| ⚡ Echtzeit-Funktion via WebSockets | 🔒 Extrem stabil & bewährt seit Jahrzehnten |
| 👥 Mehrbenutzerfähig (HTTP-API) | 🧍‍♂️ Single-User-Zugriff auf Datei |

---

### 🔍 Kurzer Merksatz

> **PocketBase** nutzt **SQLite** – aber erweitert es um alles, was ein Backend braucht: API, Auth, Files, Realtime.  
> **SQLite** ist das Fundament, PocketBase das Haus darauf.

---

**Autor:** ChatGPT Vergleich PocketBase vs SQLite – Stand 2025  
Lizenz: frei verwendbar für Dokumentation & Schulung
