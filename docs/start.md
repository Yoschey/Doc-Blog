---
title: Lernpfade
description: Geführte Einstiege durch die Yoschey Dev Garage.
aside: false
---

# Womit willst du anfangen?

Nicht jede Seite muss von oben nach unten gelesen werden. Nimm den Pfad, der zu deinem aktuellen Problem passt, und springe später zwischen den Themen.

<div class="topic-grid">
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
