# Gruppenrichtlinien (GPOs) – Anleitung & PowerShell Beispiele

## 🧭 Exkurs: Was sind Gruppenrichtlinien (GPOs)?

**Gruppenrichtlinien** (engl. *Group Policy Objects, GPOs*) sind ein zentrales Verwaltungswerkzeug in Windows-Umgebungen, das Administratoren ermöglicht, **Einstellungen und Sicherheitsrichtlinien** für Benutzer und Computer im Netzwerk (meist in einer Active Directory-Domäne) zu steuern.

### 👉 Zweck
Mit Gruppenrichtlinien kannst du:
- System- und Sicherheitseinstellungen zentral festlegen  
- Software bereitstellen oder einschränken  
- Benutzeroberflächen (Startmenü, Taskleiste etc.) konfigurieren  
- Netzwerkeinstellungen, z. B. Proxys, WLAN, Drucker, festlegen  
- Energiesparrichtlinien oder Windows Update-Verhalten steuern  

### 👨‍💼 Wer verwaltet sie?
In der Regel:
- **Domänenadministratoren** oder  
- **IT-Systemadministratoren**, die Active Directory und Gruppenrichtlinienverwaltung betreuen.  

Lokale Gruppenrichtlinien (auf Einzelrechnern) können auch über **gpedit.msc** gesetzt werden, während in Domänen die Verwaltung über die **Gruppenrichtlinienverwaltungskonsole (GPMC)** erfolgt.

---

## 🧩 1. Gruppenrichtlinien manuell setzen (GUI-Methode)

### 📍 Vorgehen:
1. Öffne auf einem Domain Controller die **Gruppenrichtlinienverwaltung** (`gpmc.msc`)
2. Rechtsklick auf deine **Domäne oder OU (Organisationseinheit)** → **„Neue Richtlinie erstellen“**
3. Gib der neuen GPO einen Namen (z. B. *Proxy Einstellungen Benutzer*)
4. Rechtsklick auf die GPO → **Bearbeiten**
5. Du siehst zwei Hauptbereiche:
   - **Computerkonfiguration** → gilt für Geräte  
   - **Benutzerkonfiguration** → gilt für Benutzerkonten
6. Stelle die gewünschten Richtlinien ein, z. B. unter *Benutzerkonfiguration → Einstellungen → Systemsteuerungseinstellungen → Internetoptionen*
7. GPO anschließend mit der gewünschten **OU verknüpfen**

---

## ⚙️ 2. Gruppenrichtlinien via PowerShell setzen

PowerShell bietet dir das Modul **GroupPolicy**, mit dem du GPOs erstellen, bearbeiten und verknüpfen kannst.

### 🔧 Nützliche Cmdlets
| Cmdlet | Beschreibung |
|--------|---------------|
| `New-GPO` | Erstellt eine neue GPO |
| `Set-GPRegistryValue` | Setzt Registry-Werte innerhalb einer GPO |
| `Get-GPO` | Zeigt vorhandene GPOs |
| `New-GPLink` | Verknüpft eine GPO mit einer OU |
| `Backup-GPO` / `Restore-GPO` | Sicherung / Wiederherstellung |
| `Remove-GPO` | Löscht eine GPO |

---

## 🌐 Beispiel 1: Proxy-Einstellungen per GPO via PowerShell

### Ziel:
Benutzer sollen automatisch einen bestimmten Proxy-Server verwenden.

#### 💻 Beispielkonfiguration:
- Proxyserver: `proxy.firma.local`
- Port: `8080`
- GPO-Name: `ProxyEinstellungen-Benutzer`
- OU: `OU=Benutzer,DC=firma,DC=local`

#### 🧠 Vorgehen in PowerShell:
```powershell
# 1. Modul laden (falls nicht automatisch geladen)
Import-Module GroupPolicy

# 2. Neue GPO erstellen
New-GPO -Name "ProxyEinstellungen-Benutzer" -Comment "Setzt Proxyserver für alle Benutzer in der OU"

# 3. Registry-Werte in der GPO setzen (Internet Explorer/Edge Proxy)
Set-GPRegistryValue -Name "ProxyEinstellungen-Benutzer" `
  -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" `
  -ValueName "ProxyEnable" -Type DWord -Value 1

Set-GPRegistryValue -Name "ProxyEinstellungen-Benutzer" `
  -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" `
  -ValueName "ProxyServer" -Type String -Value "proxy.firma.local:8080"

# Optional: Keine Proxy-Ausnahmen
Set-GPRegistryValue -Name "ProxyEinstellungen-Benutzer" `
  -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" `
  -ValueName "ProxyOverride" -Type String -Value "<local>"

# 4. GPO mit einer OU verknüpfen
New-GPLink -Name "ProxyEinstellungen-Benutzer" -Target "OU=Benutzer,DC=firma,DC=local"

# 5. Richtlinie sofort anwenden
gpupdate /force
```

---

## 💡 Beispiel 2: Energieoptionen an Nutzer/Computer ausrollen

### Ziel:
Computer sollen nach 10 Minuten Inaktivität in den Energiesparmodus wechseln.

#### 💻 Beispielkonfiguration:
- GPO-Name: `Energieoptionen-PCs`
- OU: `OU=Computer,DC=firma,DC=local`

#### 🧠 Vorgehen in PowerShell:
```powershell
# 1. Neue GPO erstellen
New-GPO -Name "Energieoptionen-PCs" -Comment "Setzt Energiesparoptionen für Firmen-PCs"

# 2. Registry-Werte setzen (Netzbetrieb – Monitor nach 10 Minuten ausschalten)
Set-GPRegistryValue -Name "Energieoptionen-PCs" `
  -Key "HKLM\Software\Policies\Microsoft\Power\PowerSettings\7516b95f-f776-4464-8c53-06167f40cc99" `
  -ValueName "ACSettingIndex" -Type DWord -Value 10

# 3. Optional – Energieplan auf „Ausbalanciert“ setzen
Set-GPRegistryValue -Name "Energieoptionen-PCs" `
  -Key "HKLM\Software\Policies\Microsoft\Power\PowerSettings" `
  -ValueName "ActivePowerScheme" -Type String -Value "381b4222-f694-41f0-9685-ff5bb260df2e"

# 4. GPO mit der Computer-OU verknüpfen
New-GPLink -Name "Energieoptionen-PCs" -Target "OU=Computer,DC=firma,DC=local"

# 5. Richtlinie sofort anwenden
gpupdate /force
```

---

## ✅ Zusammenfassung

| Thema | GUI (manuell) | PowerShell |
|--------|----------------|-------------|
| Neue GPO erstellen | GPMC | `New-GPO` |
| Einstellungen setzen | Gruppenrichtlinieneditor | `Set-GPRegistryValue` |
| Mit OU verknüpfen | Rechtsklick → Verknüpfen | `New-GPLink` |
| Anwenden | Automatisch / `gpupdate /force` | `gpupdate /force` |

---

© 2025 – Anleitung für Gruppenrichtlinienverwaltung mit PowerShell
