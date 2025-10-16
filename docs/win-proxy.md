# 🧱 Proxy unter Windows & Windows Server

## 🔍 Überblick
In Windows-Umgebungen kann ein Proxy auf mehreren Ebenen definiert werden.  
Je nach Tool, Dienst oder Benutzerkontext greifen **unterschiedliche Proxy-Mechanismen**.

Dieser Artikel beschreibt:
- wie Proxy-Einstellungen in Windows funktionieren,  
- wie man sie per **PowerShell**, **Ansible** oder **Gruppenrichtlinien (GPO)** setzt,  
- welche **Fallstricke** bei **Azure DevOps Agents** bestehen,  
- und bietet am Ende eine umfassende **Troubleshooting-Checkliste**.

---

## 🧭 1. Arten von Proxy-Einstellungen unter Windows

| Typ | Gilt für | Speicherort / Mechanismus | Gesteuert durch |
|------|-----------|---------------------------|-----------------|
| **WinINet** | Interaktive Benutzer (Browser, GUI-Apps) | Registry `HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings` | Internetoptionen, GPO, PowerShell, WinINet API |
| **WinHTTP** | Systemdienste, Serverprozesse, nicht-interaktive Prozesse | `netsh winhttp show proxy` / Registry unter `HKLM` | PowerShell, `netsh`, Ansible |
| **Umgebungsvariablen** | CLI-Tools (Git, npm, pip, .NET, Azure DevOps Agent) | Prozess-/Systemumgebung | PowerShell, Ansible |
| **Gruppenrichtlinien** | Domänenbenutzer & Systeme | GPO: Benutzer- oder Computerrichtlinie | Active Directory, SCCM, Intune |

---

## ⚙️ 2. Proxy per PowerShell verwalten

### 🔹 WinHTTP-Proxy auslesen
```powershell
netsh winhttp show proxy
```

oder modern mit PowerShell-Cmdlets:
```powershell
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\Connections"
```

### 🔹 WinHTTP-Proxy setzen
```powershell
netsh winhttp set proxy "192.168.2.123:8080" bypass-list=".domain.tld,.ding.domain.tld,localhost"
```

### 🔹 WinHTTP-Proxy entfernen
```powershell
netsh winhttp reset proxy
```

---

### 🔹 WinINet (Internetoptionen) für aktuellen Benutzer
```powershell
Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" ProxyEnable 1
Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" ProxyServer "192.168.2.123:8080"
Set-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" ProxyOverride ".domain.tld;.ding.domain.tld;localhost"
```
> ⚠️ Diese Einstellungen gelten **nur für den aktuell angemeldeten Benutzer** – nicht für Systemdienste oder den Azure DevOps Agent.

---

### 🔹 Proxy über Umgebungsvariablen
```powershell
setx HTTP_PROXY  "http://192.168.2.123:8080" /M
setx HTTPS_PROXY "http://192.168.2.123:8443" /M
setx NO_PROXY    ".domain.tld,.ding.domain.tld,localhost,127.0.0.1,192.168.3.*,192.168.2.*" /M
```
> `setx` schreibt Variablen **dauerhaft** in die Systemumgebung (`/M` = Machine).  
> Danach müssen **Dienste neu gestartet** werden, um die Änderungen zu übernehmen.

---

## ⚙️ 3. Proxy via Ansible setzen
```yaml
- name: WinHTTP Proxy setzen
  community.windows.win_http_proxy:
    proxy: "http=192.168.2.123:8080;https=192.168.2.123:8443"
    bypass: ".domain.tld;.ding.domain.tld;localhost"

- name: Proxy-Umgebungsvariablen setzen
  ansible.windows.win_environment:
    state: present
    level: machine
    name: "{{ item.name }}"
    value: "{{ item.value }}"
  loop:
    - { name: "HTTP_PROXY",  value: "http://192.168.2.123:8080" }
    - { name: "HTTPS_PROXY", value: "http://192.168.2.123:8443" }
    - { name: "NO_PROXY",    value: ".domain.tld,.ding.domain.tld,localhost" }
```

---

## 🧰 4. Proxy über Gruppenrichtlinien (GPO)
### Optionen:
1. **Benutzerkonfiguration → Internet Explorer-Wartung**
2. **Administrative Vorlagen → Windows-Komponenten → Internet Explorer → Verbindungen → Proxyserver-Einstellungen**
3. **Computerkonfiguration → Windows-Einstellungen → Internet Explorer-Wartung (WinHTTP via Registry)**

> Tipp: Für Serverdienste ist GPO selten ausreichend, da sie im **Systemkontext** laufen.  
> Verwende hier lieber **WinHTTP-Proxy** oder **Umgebungsvariablen**.

---

## ⚠️ 5. Besonderheiten bei Azure DevOps Pipeline Agents
Azure DevOps Agents unter Windows laufen **als Windows-Dienst**, oft unter dem Benutzerkonto:
```
NT AUTHORITY\Network Service
```
oder einem speziellen **Service Account**.

### 🔹 Häufige Stolperfallen
| Problem | Ursache | Lösung |
|----------|----------|--------|
| `dotnet restore` schlägt mit Regex-Fehler fehl (`Invalid regular expression: /*\.domain\.de/`) | Der Agent liest System-Proxy aus und interpretiert `*.domain.de` als Regex | Verwende `.domain.de` statt `*.domain.de` |
| Keine Internetverbindung aus Build-Skripten | Proxy nur im Benutzerkontext gesetzt, nicht im Systemkontext | Setze `HTTP_PROXY`/`HTTPS_PROXY`/`NO_PROXY` als **systemweite** Umgebungsvariablen |
| Proxy greift nicht bei Windows-Updates oder Chocolatey | WinHTTP-Proxy fehlt | `netsh winhttp set proxy ...` ausführen |
| Änderungen greifen nicht | Agent läuft mit altem Environment | Agent-Dienst **neu starten** |
| Authentifizierungsfehler | Proxy erwartet NTLM/Kerberos, Agent hat kein Benutzer-Token | Service Account mit passenden Berechtigungen verwenden oder Proxy-Auth deaktivieren |

---

## 🔍 6. Warum `*` als Regex interpretiert wird
Viele moderne Tools (darunter Node.js, npm, Azure Pipelines Tasks) verwenden **JavaScript oder Regex-Matching**, wenn sie Proxy-Bypasslisten einlesen.

Beispiel:
```
*.domain.tld
```
wird intern zu
```
/*\.domain\.tld/
```
übersetzt → das ist **ungültig**, weil das `*` am Anfang steht („Nothing to repeat“).

### ✅ Lösung
- Entferne das führende `*`
- Schreibe stattdessen `.domain.tld`  
  Das deckt Subdomains **ebenso ab**, wird aber korrekt verarbeitet.

---

## 🧩 7. Best Practices

| Empfehlung | Beschreibung |
|-------------|---------------|
| `.domain.de` statt `*.domain.de` | Sicher für Windows, .NET, Node.js, Azure Pipelines |
| `NO_PROXY` kommasepariert | `.domain.tld,.ding.domain.tld,localhost,127.0.0.1` |
| Systemweite Variablen für Agents | `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY` auf Maschinenebene |
| Nach Änderungen Agent-Dienst neu starten | Damit neue Variablen übernommen werden |
| WinHTTP-Proxy immer zusätzlich konfigurieren | Für Dienste ohne Benutzerkontext |
| Test mit `Invoke-WebRequest` oder `Test-NetConnection` | Um Proxy-Verhalten zu prüfen |

---

## 🧩 8. Troubleshooting-Checkliste

### 🧭 Proxy prüfen
```powershell
netsh winhttp show proxy
[Environment]::GetEnvironmentVariable("HTTP_PROXY", "Machine")
[Environment]::GetEnvironmentVariable("NO_PROXY", "Machine")
```

### 🔍 Netzwerkverbindung testen
```powershell
Test-NetConnection nuget.org -Port 443
Invoke-WebRequest https://www.nuget.org/api/v2/ -UseBasicParsing
```

### 🧩 Logs & Agent-Überprüfung
- Azure DevOps Agent Logs: `%ProgramData%\Microsoft\Azure DevOps\Agent\_diag`
- Prüfen, ob Environment im Agent-Log korrekt geladen ist
- Wenn nicht: Dienst stoppen, Variablen prüfen, Dienst starten

### ⚙️ Reset / Neuaufbau
```powershell
netsh winhttp reset proxy
Remove-Item Env:\HTTP_PROXY
Remove-Item Env:\HTTPS_PROXY
Remove-Item Env:\NO_PROXY
```

### 🧰 Wiederherstellen
```powershell
netsh winhttp set proxy "http=192.168.2.123:8080;https=192.168.2.123:8443" bypass-list=".domain.tld,.ding.domain.tld,localhost"
```

---

## ✅ Fazit
Ein korrekt konfigurierter Proxy ist in Windows-Umgebungen mit Azure DevOps Agents entscheidend für stabile Builds und Deployments.  
Wichtig ist, die **richtige Ebene** (WinHTTP, Benutzer, Environment) zu kennen und **Regex-Fehler** durch ungültige Platzhalter (`*`) zu vermeiden.
