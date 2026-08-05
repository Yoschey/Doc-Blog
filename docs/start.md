---
title: Lernpfade
description: Geführte Einstiege für Azubis, Admins, Entwickler und Betriebsteams.
aside: false
---

# Womit willst du anfangen?

Wenn du neu im Thema bist, beginne mit dem [Azubi-Lernplan](./lernwerkstatt/). Für ein konkretes Problem wählst du direkt den passenden Pfad. Unbekannte Begriffe stehen im [Lexikon A–Z](./lexikon/).

<div class="topic-grid">
  <a class="topic-card" href="./lernwerkstatt/">
    <span class="topic-card__icon">🎓</span>
    <strong>Ich lerne DevOps von Grund auf</strong>
    <span>Acht Module, fünf Praxis-Labs, Kompetenzraster und Ausbildungsnachweis.</span>
  </a>
  <a class="topic-card" href="./grundlagen/">
    <span class="topic-card__icon">🧭</span>
    <strong>Mir fehlen IT-Grundlagen</strong>
    <span>Git, Netzwerke, HTTP, Linux-Rechte, Prozesse, CI/CD und Cloud verständlich aufbauen.</span>
  </a>
  <a class="topic-card" href="./devops/">
    <span class="topic-card__icon">🚀</span>
    <strong>Ich will bessere Deployments</strong>
    <span>Starte mit CI/CD, Containern und GitOps. Danach folgen IaC und Observability.</span>
  </a>
  <a class="topic-card" href="./security/">
    <span class="topic-card__icon">🛡️</span>
    <strong>Ich will meine Pipeline absichern</strong>
    <span>Secrets, minimale Berechtigungen, vertrauenswürdige Builds und Supply-Chain-Kontrollen.</span>
  </a>
  <a class="topic-card" href="./windows/">
    <span class="topic-card__icon">⚡</span>
    <strong>Ich automatisiere Windows</strong>
    <span>PowerShell-Grundlagen vertiefen, Fehler sauber behandeln, remote arbeiten und testen.</span>
  </a>
  <a class="topic-card" href="./linux/">
    <span class="topic-card__icon">🐧</span>
    <strong>Ich stehe vor einem Linux-Problem</strong>
    <span>Netzwerk, Dienste, Logs und Shell-Skripte mit einer reproduzierbaren Methode untersuchen.</span>
  </a>
  <a class="topic-card" href="./concepts/">
    <span class="topic-card__icon">🧩</span>
    <strong>Ich will wartbareren Code</strong>
    <span>SOLID, Clean Architecture, Idempotenz und Dependency Injection als praktische Werkzeuge.</span>
  </a>
  <a class="topic-card" href="./examples/">
    <span class="topic-card__icon">🧰</span>
    <strong>Ich brauche sofort eine Vorlage</strong>
    <span>Runbooks und Incident-Checklisten kopieren, anpassen und im Team etablieren.</span>
  </a>
</div>

## Empfohlene Reihenfolgen

### Einstieg ohne Vorwissen

1. [Was ist DevOps?](./grundlagen/was-ist-devops)
2. [Git-Grundlagen](./grundlagen/git-grundlagen)
3. [Netzwerk-Grundlagen](./grundlagen/netzwerk-grundlagen)
4. [Dateisystem & Rechte](./grundlagen/dateisystem-rechte)
5. [Prozesse, Dienste & Ports](./grundlagen/prozesse-dienste-ports)
6. [CI/CD-Grundlagen](./grundlagen/ci-cd-grundlagen)
7. [Praxis-Labs](./lernwerkstatt/labs)

### DevOps in fünf Etappen

1. [GitHub Actions CI/CD](./devops/github-actions-cicd)
2. [Container-Grundlagen](./devops/container-grundlagen)
3. [Infrastructure as Code](./devops/infrastructure-as-code)
4. [GitOps in der Praxis](./devops/gitops-praxis)
5. [Observability](./devops/observability)

### PowerShell vom Skript zum Werkzeug

1. [PowerShell-Grundlagen](./Basis-Powershell)
2. [Fehlerbehandlung und Logging](./windows/powershell-fehlerbehandlung)
3. [Remoting über SSH](./windows/powershell-remoting)
4. [Automatisierte Tests mit Pester](./windows/pester-testing)

### Betriebssicherheit

1. [Secrets Management](./security/secrets-management)
2. [CI/CD absichern](./security/cicd-security)
3. [Software Supply Chain](./security/software-supply-chain)
4. [Incident-Checkliste](./examples/incident-checkliste)

::: warning Praxis schlägt Copy & Paste
Kommandos, Policies und Beispielkonfigurationen immer zuerst in einer isolierten Testumgebung prüfen. Betriebssystem, Version, Netzwerk und Berechtigungsmodell können das Ergebnis verändern.
:::
