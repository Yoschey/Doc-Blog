---
title: GitOps in der Praxis
description: Deklarative Systeme mit Git, Pull Requests und kontinuierlicher Reconciliation betreiben.
---

# GitOps in der Praxis

GitOps überträgt bewährte Entwicklungspraktiken auf den Betrieb deklarativer Systeme. Git enthält den gewünschten Zustand, Änderungen laufen über Review, und ein Agent gleicht die Zielumgebung kontinuierlich mit diesem Zustand ab.

<div class="tag-row"><span class="tag">GitOps</span><span class="tag">Reconciliation</span><span class="tag">Kubernetes</span><span class="tag">Operations</span></div>

## Die vier Kernideen

1. **Deklarativ:** Der gewünschte Zustand ist vollständig beschrieben.
2. **Versioniert und unveränderlich:** Änderungen sind nachvollziehbar und revisionssicher.
3. **Automatisch abgerufen:** Ein Agent liest den gewünschten Zustand aus der Quelle.
4. **Kontinuierlich abgeglichen:** Abweichungen werden erkannt und korrigiert oder gemeldet.

GitOps bedeutet nicht einfach „YAML in Git“. Ohne automatischen Abgleich bleibt es klassische Infrastructure as Code mit manuellem Apply.

## Pull statt Push

In einer Push-Pipeline besitzt das CI-System Zugangsdaten für die Zielumgebung und führt Änderungen direkt aus. Im Pull-Modell läuft der Agent in oder nahe der Zielumgebung und zieht nur freigegebene Zustände.

Vorteile des Pull-Modells:

- weniger privilegierte Zugangsdaten in CI,
- Zielsystem kann Änderungen auch nach CI-Ausfall abgleichen,
- Drift wird sichtbar,
- Cluster-Zugang bleibt lokal begrenzbar,
- Deployment-Historie folgt der Git-Historie.

Das Pull-Modell ist kein automatischer Sicherheitsgewinn. Ein kompromittierter Agent oder unzureichend geschütztes Repository bleibt kritisch.

## Repository-Struktur

Eine einfache Struktur trennt Anwendung und Umgebungszustand:

```text
platform-config/
├── apps/
│   └── inventory/
│       ├── base/
│       └── overlays/
│           ├── dev/
│           ├── staging/
│           └── prod/
├── clusters/
│   ├── dev/
│   └── prod/
└── policies/
```

Regeln für die Struktur:

- Basis und Umgebungsunterschiede sichtbar trennen.
- Generierte Artefakte nicht manuell editieren.
- Verantwortlichkeiten über CODEOWNERS ausdrücken.
- Secrets verschlüsselt oder als externe Referenz verwalten.
- Repository-Größe und Blast Radius bewusst wählen.

## Der Änderungsfluss

<div class="flow-strip">
  <span class="flow-step">Änderung</span><span class="flow-arrow">→</span>
  <span class="flow-step">Pull Request</span><span class="flow-arrow">→</span>
  <span class="flow-step">Validierung & Review</span><span class="flow-arrow">→</span>
  <span class="flow-step">Merge</span><span class="flow-arrow">→</span>
  <span class="flow-step">Reconciliation</span><span class="flow-arrow">→</span>
  <span class="flow-step">Health Check</span>
</div>

Eine gute Pull-Request-Prüfung umfasst:

- Syntax und Schema,
- Policy-as-Code,
- Diff des erwarteten Zustands,
- Referenzen auf existierende Images,
- Sicherheits- und Compliance-Regeln,
- Vorschau der betroffenen Ressourcen.

## Promotion statt Kopieren

Ein Build erzeugt ein unveränderliches Artefakt, etwa `registry.example/app@sha256:...`. Die Promotion ändert nur die Referenz in der nächsten Umgebung.

```yaml
image:
  repository: registry.example/app
  digest: sha256:4a1f...
```

Ein Digest verhindert, dass ein Tag später auf anderen Inhalt zeigt. Dev, Staging und Produktion können dadurch nachweislich dasselbe Artefakt ausführen.

## Drift behandeln

Drift entsteht durch manuelle Änderungen, defekte Automatisierung oder externe Systeme. Es gibt drei sinnvolle Strategien:

| Strategie | Einsatz |
|---|---|
| automatisch korrigieren | bekannte, risikoarme Ressourcen |
| Alarm auslösen | sensible oder potenziell destruktive Abweichungen |
| Änderung übernehmen | legitimer Notfalleingriff wird nachträglich in Git dokumentiert |

Ein manueller Hotfix ist manchmal notwendig. Er braucht aber einen klaren Rückweg in den versionierten Sollzustand, sonst überschreibt die Reconciliation ihn oder Drift bleibt dauerhaft bestehen.

## Secrets im GitOps-Modell

Klartext-Secrets gehören nicht ins Repository. Übliche Muster:

- externe Secret-Plattform plus Referenzobjekt,
- verschlüsselte Secrets, deren Schlüssel außerhalb von Git liegt,
- kurzlebige Workload-Identitäten statt statischer Zugangsdaten.

Wichtig ist nicht nur Verschlüsselung, sondern der gesamte Lebenszyklus: Erzeugung, Berechtigung, Rotation, Audit und Widerruf.

## Rollback richtig verstehen

`git revert` setzt den gewünschten Zustand zurück. Das garantiert nicht automatisch, dass Datenbank, Queue oder externer Dienst rückwärtskompatibel sind.

Deshalb:

- Schemaänderungen expand-and-contract durchführen,
- alte und neue Version zeitweise kompatibel halten,
- Backups und Restore testen,
- irreversible Schritte explizit markieren,
- Health Checks und Abbruchkriterien definieren.

## Betriebsmetriken

GitOps sollte messbar sein:

- Zeit von Merge bis synchronisiertem Zustand,
- Anteil erfolgreicher Reconciliations,
- Anzahl und Dauer von Drift,
- Rollback-Häufigkeit,
- fehlgeschlagene Policy-Prüfungen,
- nicht autorisierte manuelle Änderungen.

## Einführungsplan

1. Eine unkritische Anwendung auswählen.
2. Sollzustand deklarativ und reproduzierbar beschreiben.
3. Read-only Drift-Erkennung aktivieren.
4. Pull-Request-Prüfungen und CODEOWNERS einführen.
5. Automatische Synchronisierung für risikoarme Ressourcen erlauben.
6. Secret- und Rollback-Modell testen.
7. Betriebsmetriken beobachten und erst danach skalieren.

## Anti-Patterns

- Git als Datenbank für Klartext-Secrets.
- Automatisches Löschen ohne Schutzregeln.
- Ein riesiges Repository ohne Ownership-Grenzen.
- Image-Tags ohne Digest.
- Änderungen direkt im Cluster und nie zurück in Git.
- Reconciliation ohne Alerts oder Verantwortliche.
- Rollback nur für YAML, nicht für Daten und Schnittstellen planen.

## Weiterführende Quellen

- [OpenGitOps](https://opengitops.dev/)
- [OpenGitOps Principles](https://opengitops.dev/)
- [Security of GitOps](https://opengitops.dev/blog/sec-gitops/)

Als Nächstes: [Infrastructure as Code](./infrastructure-as-code) und [Idempotenz](../concepts/idempotenz).
