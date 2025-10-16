# 🧩 Proxy – Funktionsweise, Einsatz und Nutzen

## 🔍 Definition
Ein **Proxy** (kurz für *Proxyserver*) ist ein **Vermittler zwischen einem Client und einem Zielsystem** – meist zwischen einem Endgerät (z. B. PC, Server, Anwendung) und dem Internet oder einem internen Netzwerkdienst.  

Anstatt dass der Client direkt mit dem Ziel (z. B. einer Website, API oder Paketquelle) kommuniziert, schickt er seine Anfragen an den Proxy.  
Der Proxy **nimmt die Anfrage entgegen**, **leitet sie weiter**, empfängt die Antwort und **gibt sie an den Client zurück**.

Ein Proxy agiert also wie ein **Mittelsmann**, der den Datenverkehr kontrollieren, verändern oder protokollieren kann.

---

## ⚙️ Grundprinzip
```
[Client] ⇄ [Proxy] ⇄ [Zielserver]
```

1. Der Client (z. B. Browser, Anwendung, Build-Agent) sendet eine Anfrage (HTTP, HTTPS, FTP, usw.) nicht direkt an den Zielserver.
2. Der Proxy empfängt die Anfrage und prüft, ob er sie:
   - weiterleiten darf (nach Regeln oder Authentifizierung),
   - aus einem Cache bedienen kann,
   - oder ablehnen muss.
3. Der Proxy sendet die Anfrage ggf. im eigenen Namen weiter.
4. Die Antwort des Zielservers wird an den Proxy zurückgeliefert.
5. Der Proxy gibt die Antwort an den Client zurück – ggf. gefiltert, komprimiert oder gecacht.

---

## 🧠 Typische Aufgaben und Einsatzbereiche

### 1. **Sicherheits- und Zugriffskontrolle**
- Filterung unerlaubter Webseiten oder Inhalte  
- Schutz interner Systeme durch *Trennung vom Internet* (Firewall-ähnlich)  
- Authentifizierung von Benutzern über zentrale Mechanismen (z. B. NTLM, Kerberos)  
- Schutz vor Schadsoftware oder unerwünschtem Traffic  

### 2. **Zugriffsüberwachung und Protokollierung**
- Aufzeichnen, wer wann welche Daten abgerufen hat (Compliance, Auditing)  
- Analyse von Netzwerkverhalten und Nutzungsstatistiken  

### 3. **Leistungsoptimierung (Caching)**
- Häufig abgerufene Dateien (z. B. Updates, Pakete, Webseiten) werden lokal im Proxy gespeichert  
- Spätere Anfragen können direkt aus dem Cache bedient werden  
→ Entlastung der Internetleitung und kürzere Ladezeiten  

### 4. **Zugriff auf das Internet über zentrale Punkte**
- In Unternehmensnetzwerken ist oft **kein direkter Internetzugang** erlaubt.  
  Alle Systeme (z. B. Entwickler-PCs, Build-Server) müssen über einen Proxy kommunizieren.  
- So kann die IT-Abteilung:
  - Internetzugriffe zentral steuern,
  - Sicherheitsrichtlinien erzwingen,
  - Datenverkehr nach außen kontrollieren.  

### 5. **Protokoll- oder Netzwerkübersetzung**
- Der Proxy kann zwischen verschiedenen Protokollen vermitteln  
  (z. B. HTTP ⇄ HTTPS, IPv4 ⇄ IPv6)  
- Er kann auch Daten umschreiben oder SSL/TLS-Verbindungen terminieren (z. B. für Inhaltsprüfung).

---

## 🧱 Proxy-Arten

| Typ | Beschreibung | Beispiel |
|------|--------------|----------|
| **Forward Proxy** | Vermittelt Anfragen vom internen Client ins Internet. Am häufigsten in Unternehmensnetzwerken. | z. B. Squid, Blue Coat, ISA/TMG, Windows Proxy |
| **Reverse Proxy** | Vermittelt Anfragen aus dem Internet zu internen Servern. Dient als Schutz- und Lastverteiler. | z. B. NGINX, HAProxy, IIS ARR |
| **Transparent Proxy** | Fängt Anfragen automatisch ab (ohne Konfiguration am Client). | Netzwerk-Firewalls, Webfilter |
| **Caching Proxy** | Speichert Antworten lokal, um wiederholte Abrufe zu beschleunigen. | Squid, Fiddler Cache |
| **SOCKS Proxy** | Arbeitet auf niedrigerer Netzwerkebene, unterstützt viele Protokolle. | SSH-Tunnel, Tor |
| **Application Proxy** | Speziell für bestimmte Anwendungen (z. B. E-Mail, FTP). | Exchange Edge Transport |

---

## 🔐 Proxy im Unternehmenskontext
In vielen Firmenumgebungen dürfen interne Systeme **nicht direkt ins Internet**, sondern müssen über einen **zentrale Proxy-Server** gehen.  
Das ermöglicht:
- Kontrolle über ausgehenden Datenverkehr,
- Schutz sensibler Systeme,
- und Nachvollziehbarkeit.

Beispiele:
- **Build-Server** (z. B. Azure DevOps Server Agent) müssen beim Paketdownload (NuGet, npm, etc.) den Proxy verwenden.  
- **Browser und Windows-Dienste** nutzen Proxy-Einstellungen aus den Internetoptionen oder Systemvariablen.  

---

## ⚙️ Proxy-Einstellungen unter Windows (Beispiel)
- **Systemweit (WinHTTP):**
  ```cmd
  netsh winhttp set proxy "192.168.2.123:8080" bypass-list=".domain.tlf,.ding.domain.tlf,localhost"
  ```

- **Umgebungsvariablen (für Tools):**
  ```bash
  setx HTTP_PROXY  "http://192.168.2.123:8080" /M
  setx HTTPS_PROXY "http://192.168.2.123:8443" /M
  setx NO_PROXY    ".domain.tlf,.ding.domain.tlf,localhost,127.0.0.1"
  ```

---

## 🧭 Wichtiges zur Syntax

| Variable | Beispiel | Beschreibung |
|-----------|-----------|--------------|
| `HTTP_PROXY` | `http://192.168.2.123:8080` | Proxy für HTTP-Verbindungen |
| `HTTPS_PROXY` | `http://192.168.2.123:8443` | Proxy für HTTPS-Verbindungen |
| `NO_PROXY` | `.domain.tlf,.ding.domain.tlf,localhost,127.0.0.1` | Adressen, die **nicht** über Proxy gehen sollen |

> ⚠️ **Kein `*` in `HTTP_PROXY`!**  
> Platzhalter sind nur im `NO_PROXY` erlaubt, z. B. `192.168.*` oder `.domain.local`.

---

## 📊 Vorteile eines Proxy-Systems

✅ Sicherheit durch zentrale Kontrolle  
✅ Weniger Bandbreite durch Caching  
✅ Einheitliche Internet-Policies  
✅ Bessere Nachvollziehbarkeit (Logging, Auditing)  
✅ Vereinfachtes Troubleshooting durch zentrale Analyse  

---

## ⚠️ Nachteile und Risiken

❌ Single Point of Failure – wenn der Proxy ausfällt, ist kein Internetzugang möglich  
❌ Erhöhter Wartungsaufwand (Zertifikate, Authentifizierung, Updates)  
❌ Manchmal zusätzliche Latenz oder Probleme bei SSL/TLS-Überwachung  
❌ Komplexität bei internen Diensten und Ausnahmen (`NO_PROXY`-Konfiguration)

---

## 📚 Siehe auch

- [Forward vs. Reverse Proxy (Microsoft Docs)](https://learn.microsoft.com/en-us/azure/architecture/patterns/reverse-proxy)  
- [Proxy settings in Windows & .NET](https://learn.microsoft.com/en-us/dotnet/core/tools/proxy-configuration)  
- [Squid Proxy Project](http://www.squid-cache.org/)  
- [Azure DevOps Agent Proxy Configuration](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/proxy?view=azure-devops)
