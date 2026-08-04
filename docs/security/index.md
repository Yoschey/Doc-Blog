---
title: Security by Default
description: Praktische Sicherheitsgrundlagen für Secrets, Pipelines und Software-Lieferketten.
aside: false
---

# Security by Default

Sicherheit funktioniert am besten als Eigenschaft des normalen Arbeitsablaufs. Die folgenden Guides setzen auf kleine, überprüfbare Kontrollen statt auf einen großen Freigabeprozess am Ende.

<div class="tag-row"><span class="tag">Least Privilege</span><span class="tag">Secrets</span><span class="tag">Provenance</span><span class="tag">SBOM</span><span class="tag">OIDC</span></div>

<div class="topic-grid">
  <a class="topic-card" href="./secrets-management"><span class="topic-card__icon">🔑</span><strong>Secrets Management</strong><span>Lebenszyklus, Rotation, Zugriffsmodelle und sichere Nutzung in CI/CD.</span></a>
  <a class="topic-card" href="./cicd-security"><span class="topic-card__icon">🛡️</span><strong>CI/CD absichern</strong><span>Token, Runner, Actions, Environments und Freigaben mit minimalen Rechten.</span></a>
  <a class="topic-card" href="./software-supply-chain"><span class="topic-card__icon">🔗</span><strong>Software Supply Chain</strong><span>Abhängigkeiten, SBOM, Signaturen, Provenance und SLSA als Reifegradmodell.</span></a>
  <a class="topic-card" href="../examples/incident-checkliste"><span class="topic-card__icon">🚨</span><strong>Incident-Checkliste</strong><span>Ein klarer Ablauf für Triage, Eindämmung, Beweissicherung und Nachbereitung.</span></a>
</div>

::: info Sicherheitsregel Nummer eins
Ein Secret, das nie erzeugt oder langfristig gespeichert werden muss, kann auch nicht aus einem Repository, Log oder Backup gestohlen werden. Kurzlebige Identitäten sind langfristigen Zugangsschlüsseln vorzuziehen.
:::
