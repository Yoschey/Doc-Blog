---
title: PowerShell Remoting über SSH
description: PowerShell-Sessions über SSH sicher einrichten, betreiben und automatisieren.
---

# PowerShell Remoting über SSH

PowerShell 7 kann Remote-Sessions über SSH zu Windows, Linux und macOS aufbauen. SSH übernimmt Transport und Authentifizierung; PowerShell stellt darauf seine Session- und Objekt-Pipeline bereit.

<div class="tag-row"><span class="tag">PowerShell</span><span class="tag">SSH</span><span class="tag">Remoting</span><span class="tag">Windows</span></div>

## Voraussetzungen

Auf Client und Zielsystem werden benötigt:

- PowerShell 7,
- OpenSSH Client,
- auf dem Zielsystem OpenSSH Server,
- erreichbarer SSH-Port,
- ein konfigurierter PowerShell-Subsystem-Eintrag,
- eine bewusst gewählte Authentifizierungsmethode.

Unter Windows prüfen:

```powershell
Get-Command pwsh, ssh
Get-Service sshd
(Get-Command New-PSSession).ParameterSets.Name
```

## SSH-Subsystem konfigurieren

In der `sshd_config` des Zielsystems wird PowerShell als Subsystem eingetragen. Der Pfad hängt von der Installation ab.

```text
Subsystem powershell C:/progra~1/PowerShell/7/pwsh.exe -sshs -NoLogo
```

Danach Konfiguration prüfen und Dienst neu laden:

```powershell
sshd -t
Restart-Service sshd
```

::: warning Pfade und Updates
Pfade mit Leerzeichen können je nach OpenSSH-Konfiguration problematisch sein. Nach PowerShell- oder Betriebssystem-Updates sollte der Subsystem-Pfad erneut geprüft werden.
:::

## Schlüsselbasierte Anmeldung

Auf dem Client:

```powershell
ssh-keygen -t ed25519 -a 100
```

Der öffentliche Schlüssel wird für das Zielkonto autorisiert. Der private Schlüssel bleibt auf dem Client und sollte durch Dateirechte sowie möglichst eine Passphrase geschützt sein.

Vor PowerShell zuerst normales SSH testen:

```powershell
ssh admin@example-host
```

Erst wenn Authentifizierung und Host-Key-Prüfung funktionieren, folgt PowerShell Remoting.

## Interaktive Session

```powershell
Enter-PSSession -HostName example-host -UserName admin
```

Beenden:

```powershell
Exit-PSSession
```

Für wiederholte Aufrufe ist eine persistente Session effizienter:

```powershell
$session = New-PSSession -HostName example-host -UserName admin

try {
    Invoke-Command -Session $session -ScriptBlock {
        Get-ComputerInfo | Select-Object OsName, OsVersion
    }
}
finally {
    Remove-PSSession -Session $session
}
```

## Mehrere Systeme parallel

```powershell
$hosts = 'app-01', 'app-02', 'app-03'

$sessions = foreach ($hostName in $hosts) {
    New-PSSession -HostName $hostName -UserName automation
}

try {
    Invoke-Command -Session $sessions -ThrottleLimit 3 -ScriptBlock {
        [pscustomobject]@{
            Hostname = $env:COMPUTERNAME
            PowerShell = $PSVersionTable.PSVersion.ToString()
            Time = Get-Date
        }
    }
}
finally {
    $sessions | Remove-PSSession
}
```

Parallelität braucht Limits. Einhundert gleichzeitige Sessions können SSH-Dienst, Netzwerk oder Zielanwendung selbst zum Incident machen.

## Daten und Code übertragen

Werte werden als Argumente übergeben:

```powershell
$serviceName = 'Spooler'

Invoke-Command -HostName server-01 -UserName admin -ScriptBlock {
    param($Name)
    Get-Service -Name $Name
} -ArgumentList $serviceName
```

Lokale Variablen direkt mit `$using:` einzufangen ist bequem, aber explizite Parameter machen die Schnittstelle besser testbar und verständlich.

Dateien können über eine Session kopiert werden:

```powershell
$session = New-PSSession -HostName server-01 -UserName admin
Copy-Item -Path ./config.json -Destination /tmp/config.json -ToSession $session
```

## Sicherheitsmodell

- eigenes Automationskonto statt persönlichem Admin-Konto,
- Schlüssel pro Zweck und Umgebung,
- keine gemeinsame private Schlüsseldatei im Team,
- restriktive `authorized_keys`-Optionen,
- Host Keys verifizieren,
- Netzwerkzugriff begrenzen,
- Session-Aktionen protokollieren,
- privilegierte Operationen separat freigeben.

SSH verschlüsselt den Transport, beantwortet aber nicht automatisch, ob das angemeldete Konto zu viele Rechte besitzt.

## Automatisierung ohne Secret-Sprawl

CI-Systeme sollten private Schlüssel nicht unkontrolliert als langlebige Repository-Secrets verteilen. Besser sind:

- kurzlebige SSH-Zertifikate,
- dedizierter Secret-Broker,
- Runner in kontrollierter Netzwerkzone,
- separate Deployment-Identität,
- zeitlich begrenzte Freigabe für Produktionszugriff.

## Fehlerdiagnose

### Verbindung scheitert vor PowerShell

```powershell
ssh -vvv admin@example-host
Test-NetConnection example-host -Port 22
```

Prüfen:

- DNS und Route,
- Firewall,
- `sshd`-Status,
- Host-Key-Konflikt,
- Schlüsseldatei und Berechtigungen,
- erlaubte Benutzer.

### SSH funktioniert, PowerShell-Session nicht

- Subsystem-Zeile und Pfad prüfen,
- `sshd -t` ausführen,
- OpenSSH-Logs lesen,
- `pwsh -sshs -NoLogo` nicht interaktiv testen,
- PowerShell-Version und Installationspfad prüfen.

### Befehle verhalten sich anders

Remote-Sessions laden Profile nicht zwingend wie eine interaktive lokale Shell. Skripte dürfen nicht von Aliasen, interaktiven Prompts oder persönlicher `$PROFILE`-Konfiguration abhängen.

## Betriebscheckliste

- [ ] Normales SSH funktioniert mit Host-Key-Prüfung.
- [ ] PowerShell-Subsystem ist validiert.
- [ ] Schlüssel sind pro Identität und Zweck getrennt.
- [ ] Automationskonto besitzt minimale Rechte.
- [ ] Netzwerkzugriff ist auf notwendige Quellen begrenzt.
- [ ] Sessions werden begrenzt und zuverlässig geschlossen.
- [ ] Skripte sind nicht von Profilen oder Prompts abhängig.
- [ ] Schlüsselrotation und Sperrung wurden getestet.

## Weiterführende Quellen

- [Microsoft Learn – PowerShell Remoting over SSH](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/ssh-remoting-in-powershell)
- [Microsoft Learn – Running Remote Commands](https://learn.microsoft.com/en-us/powershell/scripting/security/remoting/running-remote-commands)
- [OpenSSH Key Management for Windows](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)

Passend dazu: [PowerShell Fehlerbehandlung](./powershell-fehlerbehandlung).
