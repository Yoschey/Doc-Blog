---
title: Infrastructure as Code
description: Infrastruktur deklarativ, überprüfbar und wiederholbar verwalten.
---

# Infrastructure as Code – Infrastruktur wird zum Review-Objekt

Infrastructure as Code (IaC) beschreibt Infrastruktur in versionierbaren Dateien statt über manuelle Klickfolgen. Der größte Gewinn ist nicht Geschwindigkeit, sondern ein überprüfbarer Änderungsprozess mit reproduzierbaren Ergebnissen.

<div class="tag-row"><span class="tag">IaC</span><span class="tag">Terraform</span><span class="tag">State</span><span class="tag">Automation</span></div>

## Deklarativ und imperativ

**Imperativ** beschreibt Schritte:

1. Netzwerk anlegen.
2. Subnetz erzeugen.
3. VM starten.
4. Firewall-Regel hinzufügen.

**Deklarativ** beschreibt den Zielzustand:

```hcl
resource "example_network" "app" {
  name       = "app-production"
  cidr_block = "10.42.0.0/16"
  tags = {
    environment = "production"
    managed_by  = "terraform"
  }
}
```

Das Werkzeug berechnet den Weg vom aktuellen Zustand zum Ziel. Dadurch werden Vorschau, Drift-Erkennung und wiederholbare Ausführung möglich.

## Der sichere Workflow

```text
Änderung → Format/Validate → Plan → Review → Apply → Verify
```

### 1. Format und Validierung

Syntax, Typen und Modul-Schnittstellen werden früh geprüft. Das ist schnell und braucht meist keinen Zugriff auf die Zielumgebung.

### 2. Plan

Der Plan zeigt, welche Ressourcen erstellt, geändert oder gelöscht würden. Er ist ein Review-Artefakt, aber kein Geheimnis-freier Text: Provider können sensible Werte hineintragen.

### 3. Review

Reviewer prüfen nicht nur Syntax, sondern:

- Blast Radius,
- Namens- und Tagging-Regeln,
- Netzwerk- und IAM-Auswirkungen,
- Backups und Datenverlust,
- Kosten,
- Migrations- und Rollback-Weg.

### 4. Apply

Apply läuft kontrolliert, idealerweise mit kurzlebiger Identität und gegen den zuvor geprüften Commit. Parallele Applies auf denselben State müssen verhindert werden.

### 5. Verify

Ein erfolgreiches Apply bedeutet nur, dass der Provider keinen Fehler meldet. Danach folgen Health Check, Smoke Test und Monitoring.

## State ist kritisch

State verbindet Konfiguration und reale Ressourcen. Er kann IDs, Metadaten und sensible Werte enthalten.

Produktionsregeln:

- Remote Backend statt lokale Datei,
- Verschlüsselung im Ruhezustand und Transport,
- Zugriff nach Least Privilege,
- Locking gegen parallele Änderungen,
- Versionierung und Backup,
- getrennte States für begrenzten Blast Radius,
- kein State im normalen Git-Repository.

::: danger State niemals leichtfertig bearbeiten
Manuelle State-Operationen können Ressourcen aus der Verwaltung lösen oder falsche Änderungen auslösen. Vorher Backup erstellen, Befehl und Ziel exakt prüfen und danach einen neuen Plan ausführen.
:::

## Module als Produkt behandeln

Ein gutes Modul besitzt:

- einen klaren Zweck,
- kleine und stabile Inputs,
- dokumentierte Outputs,
- sichere Defaults,
- Beispiele,
- Versionshistorie,
- automatisierte Tests,
- verantwortliche Owner.

Ein Modul sollte keine komplette Organisation abbilden. Kleine, kombinierbare Bausteine lassen sich leichter verstehen und aktualisieren.

## Repository-Aufteilung

Eine mögliche Struktur:

```text
infrastructure/
├── modules/
│   ├── network/
│   └── service/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── production/
├── policies/
└── tests/
```

Umgebungen sollten nicht durch Copy & Paste auseinanderlaufen. Gemeinsame Module plus kleine, sichtbare Unterschiede sind wartbarer.

## Drift und Imports

Bestehende Ressourcen können in IaC übernommen werden. Der sichere Ablauf:

1. Ressource dokumentieren und Owner klären.
2. passende Konfiguration schreiben,
3. Ressource importieren,
4. Plan ohne unerwartete Änderung anstreben,
5. erst dann normale Verwaltung aktivieren.

Drift sollte regelmäßig erkannt werden. Nicht jede Abweichung darf automatisch korrigiert werden; bei Datenbanken, Netzwerken und IAM ist oft ein Review nötig.

## Destruktive Änderungen entschärfen

- Lifecycle-Schutz für kritische Ressourcen,
- Löschungen nur mit separater Freigabe,
- Backups vor Datenmigrationen,
- schrittweise Migration statt Replace-in-place,
- Feature Flags oder Parallelbetrieb,
- Wartungsfenster mit klarer Abbruchgrenze.

## Tests für Infrastruktur

Mehrere Ebenen ergänzen sich:

| Ebene | Beispiel |
|---|---|
| statisch | Format, Validate, Lint |
| Policy | erlaubte Regionen, Verschlüsselung, Tags |
| Plan-Review | unerwartete Deletes oder IAM-Erweiterungen |
| Integration | Modul in temporärer Umgebung anwenden |
| Betrieb | Health, Konnektivität, Backup/Restore |

## Häufige Fehler

- Ein State für alles.
- Provider-Versionen nicht begrenzen.
- Secrets als normale Variablen und Outputs behandeln.
- Plan ungeprüft automatisch anwenden.
- Module ohne Versionierung direkt vom Hauptbranch beziehen.
- manuelle Änderungen stillschweigend tolerieren.
- `destroy` als vollständige Rollback-Strategie betrachten.

## Checkliste für Pull Requests

- [ ] Ist der Plan vollständig und verständlich?
- [ ] Gibt es Deletes, Replacements oder IAM-Erweiterungen?
- [ ] Sind Provider und Module kontrolliert versioniert?
- [ ] Bleiben Secrets aus Logs, Plan und Outputs?
- [ ] Ist der State korrekt getrennt und gesperrt?
- [ ] Sind Kosten- und Kapazitätsänderungen plausibel?
- [ ] Existieren Verifikation und Rückweg?

## Weiterführende Quellen

- [Terraform – Infrastructure as Code](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code)
- [Terraform Language](https://developer.hashicorp.com/terraform/language)
- [Terraform Style Guide](https://developer.hashicorp.com/terraform/language/style)

Als Nächstes: [GitOps in der Praxis](./gitops-praxis) und [Secrets Management](../security/secrets-management).
