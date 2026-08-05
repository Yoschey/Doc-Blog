---
title: CI/CD-Grundlagen
description: Vom Commit über Build, Test und Artefakt bis zum kontrollierten Deployment.
learning:
  level: Einstieg
  duration: 45 Minuten
  goals:
    - Continuous Integration, Delivery und Deployment unterscheiden.
    - eine Pipeline als Abfolge nachweisbarer Qualitätsstufen planen.
    - Artefakte, Umgebungen, Secrets und Rollback korrekt einordnen.
  terms: [CI, Delivery, Deployment, Pipeline, Artefakt]
  practice: Entwirf für eine kleine Anwendung eine Pipeline auf Papier. Gib für jede Stufe Eingang, Befehl, Erfolgskriterium, erzeugtes Artefakt und Fehlerbehandlung an.
  check:
    - question: Warum sollte dasselbe Artefakt durch die Umgebungen wandern?
      answer: Ein erneuter Build könnte andere Abhängigkeiten oder Inhalte enthalten. Promote statt Rebuild verbessert Nachvollziehbarkeit und Reproduzierbarkeit.
    - question: Was ist ein Quality Gate?
      answer: Eine überprüfbare Bedingung, die erfüllt sein muss, bevor die nächste Stufe beginnt, etwa erfolgreiche Tests oder eine freigegebene Umgebung.
    - question: Warum sind Secrets in Pipeline-Variablen allein noch nicht automatisch sicher?
      answer: Rechte, Maskierung, Logausgaben, Forks, Drittaktionen, Laufzeit und Rotation bestimmen, ob ein Secret geschützt bleibt.
  next: /devops/github-actions-cicd
---

# CI/CD-Grundlagen

CI/CD beschreibt einen automatisierten Weg, Änderungen zu integrieren, zu prüfen, zu paketieren und auszuliefern. Eine Pipeline ist gut, wenn sie **schnell verständliches Feedback** liefert und ein reproduzierbares Artefakt kontrolliert durch Umgebungen bewegt.

## Die drei Begriffe

| Begriff | Ziel |
|---|---|
| Continuous Integration (CI) | Änderungen häufig zusammenführen und automatisiert prüfen |
| Continuous Delivery | jede bestandene Änderung grundsätzlich auslieferbar halten; Produktion kann eine bewusste Freigabe erfordern |
| Continuous Deployment | jede bestandene Änderung automatisch bis Produktion ausrollen |

Ein Team kann Continuous Delivery betreiben, ohne automatisch in Produktion zu deployen. Entscheidend ist, dass der Stand technisch auslieferbar ist.

## Eine typische Pipeline

<div class="flow-strip"><span class="flow-step">Checkout</span><span class="flow-arrow">→</span><span class="flow-step">Lint</span><span class="flow-arrow">→</span><span class="flow-step">Test</span><span class="flow-arrow">→</span><span class="flow-step">Build</span><span class="flow-arrow">→</span><span class="flow-step">Deploy</span></div>

Jede Stufe braucht einen Vertrag:

| Frage | Beispiel |
|---|---|
| Was ist der Eingang? | exakter Commit und Lockfile |
| Was wird ausgeführt? | `npm ci && npm test` |
| Was bedeutet Erfolg? | Exit Code 0 und definierte Testberichte |
| Was entsteht? | versioniertes Container-Image |
| Was passiert bei Fehler? | Pipeline stoppt, Befund bleibt sichtbar |

## Schnell zuerst, teuer später

Eine sinnvolle Reihenfolge verkürzt Feedback:

1. Format- und Syntaxprüfung,
2. statische Analyse,
3. Unit-Tests,
4. Build,
5. Integrations- und Security-Tests,
6. Deployment in Testumgebung,
7. Smoke- und End-to-End-Tests.

Unabhängige Prüfungen dürfen parallel laufen. Ein teurer Gesamttest sollte nicht erst nach 20 Minuten einen Fehler melden, den ein Linter in Sekunden gefunden hätte.

## Reproduzierbares Artefakt

Ein Artefakt ist das unveränderliche Ergebnis eines Builds, etwa:

- Container-Image,
- Paketarchiv,
- Binärdatei,
- signiertes Installationspaket,
- statisch erzeugte Website.

Kennzeichne es mindestens mit Commit-SHA und unveränderlichem Digest. Das identische Artefakt wird nach Test und Freigabe in die nächste Umgebung **promoted**. Ein neuer Build pro Umgebung zerstört die Aussage „genau das getestete Paket wurde produktiv“.

## Umgebungen und Konfiguration

Das Artefakt bleibt gleich, Umgebungskonfiguration kommt zur Laufzeit:

- Endpunkte,
- Feature Flags,
- Kapazitätswerte,
- Identitäten und Secrets,
- umgebungsspezifische Policies.

Konfiguration sollte validiert werden. Ein fehlender Pflichtwert muss zu einem klaren Fehler führen, nicht zu einem stillen unsicheren Standard.

## Secrets und Berechtigungen

- Pipeline-Token nur mit minimalen Rechten ausstellen.
- Kurzlebige Identitäten einer langfristigen Zugangsschlüssel-Datei vorziehen.
- Secrets nicht in Logs, Artefakte oder Caches schreiben.
- Drittaktionen oder Tasks auf vertrauenswürdige, feste Versionen pinnen.
- Deploy-Rechte an geschützte Environments und Regeln binden.
- Pull Requests aus Forks nie ungeprüft mit produktiven Secrets ausführen.

Mehr dazu: [CI/CD absichern](../security/cicd-security) und [Secrets Management](../security/secrets-management).

## Deployment-Strategien

| Strategie | Idee | Trade-off |
|---|---|---|
| Rolling | Instanzen schrittweise ersetzen | wenig Zusatzkapazität, alte und neue Version laufen zeitweise gemeinsam |
| Blue/Green | zweite vollständige Umgebung vorbereiten, Traffic umschalten | schneller Rückweg, mehr Infrastruktur |
| Canary | neue Version zuerst für kleinen Traffic-Anteil | reales Feedback, braucht gute Metriken und Routing |
| Recreate | alte Version stoppen, neue starten | einfach, aber mit Unterbrechung |

Eine Strategie ist nur so gut wie ihre Verifikation. Definiere vorher, welche Metrik oder Probe den Rollout stoppt.

## Rollback und Roll-forward

- **Rollback:** auf bekannte Artefaktversion zurückgehen.
- **Roll-forward:** Fehler mit einer neuen Korrekturversion beheben.

Datenbankänderungen erschweren Rückrollen. Verwende kompatible, schrittweise Migrationen: erst erweiternd hinzufügen, Anwendungen umstellen, später Altes entfernen.

## Pipeline als Produkt

Pipelines brauchen dieselbe Sorgfalt wie Anwendungscode:

- Review und Versionskontrolle,
- wiederverwendbare Bausteine,
- klare Ownership,
- Laufzeit- und Fehlerbeobachtung,
- Updates und Security-Patches,
- dokumentierten lokalen oder isolierten Testweg.

## Minimaler Qualitätsvertrag

- [ ] Pipeline startet für Pull Requests.
- [ ] Abhängigkeiten sind über Lockfiles reproduzierbar.
- [ ] Fehler liefern einen nicht-null Exit Code.
- [ ] Testreports bleiben als Artefakt sichtbar.
- [ ] Build ist eindeutig einem Commit zugeordnet.
- [ ] Deployments sind nachvollziehbar und geschützt.
- [ ] Smoke Test prüft eine echte Kernfunktion.
- [ ] Rückweg und Verantwortliche sind dokumentiert.

**Primärquellen:** [GitHub Actions documentation](https://docs.github.com/en/actions), [Microsoft Learn: What is CI/CD?](https://learn.microsoft.com/en-us/devops/deliver/what-is-continuous-delivery), [SLSA](https://slsa.dev/)
