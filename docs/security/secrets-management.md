---
title: Secrets Management
description: Secrets zentral verwalten, kurzlebig bereitstellen, rotieren und sicher widerrufen.
---

# Secrets Management – vom versteckten String zum kontrollierten Lebenszyklus

Ein Secret ist ein Wert, der eine Identität oder einen privilegierten Zugriff ermöglicht: Passwort, API-Key, Token, privater Schlüssel, Zertifikat oder Datenbank-Zugang. Die `.env`-Datei ist ein Transportformat, aber noch keine Secret-Strategie.

<div class="tag-row"><span class="tag">Secrets</span><span class="tag">Rotation</span><span class="tag">Least Privilege</span><span class="tag">OIDC</span></div>

## Der Lebenszyklus

Ein Secret durchläuft mehrere Zustände:

```text
Erzeugen → Speichern → Verteilen → Verwenden → Rotieren → Widerrufen → Löschen
```

Für jede Phase braucht es einen Owner, eine technische Kontrolle und ein Audit-Signal. Nur „verschlüsselt gespeichert“ zu sagen, beantwortet weder, wer lesen darf, noch wie ein kompromittierter Wert schnell ersetzt wird.

## Das bessere Ziel: weniger Secrets

Bevor ein Vault eingeführt wird, sollte geprüft werden, ob das Secret vermeidbar ist.

Bevorzugte Reihenfolge:

1. Workload- oder Managed Identity,
2. kurzlebiges, dynamisch ausgestelltes Token,
3. kurzlebige Zugangsdaten aus einem Broker,
4. rotierbares statisches Secret,
5. nur im Ausnahmefall langfristiger gemeinsamer Schlüssel.

Kurzlebige Identitäten reduzieren das Zeitfenster eines Leaks und machen manuelle Rotation seltener.

## Zentrale Anforderungen

| Bereich | Frage |
|---|---|
| Authentifizierung | Wie beweist die Workload ihre Identität? |
| Autorisierung | Darf sie genau dieses Secret lesen? |
| Audit | Wer hat wann welchen Pfad abgerufen? |
| Rotation | Kann alt und neu kontrolliert überlappen? |
| Verfügbarkeit | Starten kritische Dienste auch bei Teilstörungen? |
| Widerruf | Wie wird kompromittierter Zugriff sofort beendet? |

## Secret-Pfade und Ownership

Ein verständliches Namensmodell verhindert Wildwuchs:

```text
production/payments/api/signing-key
production/payments/database/app-user
staging/payments/database/app-user
```

Metadaten sollten Owner, Zweck, Umgebung, Rotationsintervall und betroffene Systeme nennen. Der eigentliche Secret-Wert bleibt getrennt.

## Zugriff nach Least Privilege

Eine Workload sollte nur den konkreten Secret-Pfad und nur die nötige Operation erhalten. „Alle Secrets lesen“ ist selten erforderlich.

Beispiel einer konzeptionellen Policy:

```text
identity: checkout-api-production
allow: read production/checkout/database/app-user
deny:  read production/*
ttl:   30 minutes
```

Menschen brauchen nicht automatisch dieselben Rechte wie Anwendungen. Break-Glass-Zugriff sollte zeitlich begrenzt, begründet und besonders protokolliert werden.

## Bereitstellung an Anwendungen

Mögliche Wege:

- Datei auf einem speicherbasierten temporären Dateisystem,
- lokaler Sidecar oder Agent,
- direkte API-Abfrage mit Workload Identity,
- Plattform-Integration, die Werte zur Laufzeit injiziert.

Umgebungsvariablen sind bequem, können aber über Prozess-Dumps, Diagnoseendpunkte, `/proc`, Crash Reports oder Fehlkonfiguration sichtbar werden. Für besonders sensible Werte sind kurzlebige Dateien mit restriktiven Rechten oft kontrollierbarer.

## Rotation ohne Ausfall

Ein robustes Rotationsmuster:

1. neuen Wert erzeugen,
2. Zielsystem akzeptiert alten und neuen Wert,
3. Anwendungen laden den neuen Wert,
4. Nutzung des alten Werts fällt auf null,
5. alten Wert widerrufen,
6. Rotation und Verifikation dokumentieren.

Die Anwendung muss Secrets neu laden können, ohne dass ein vollständiger Notfall-Restart aller Instanzen notwendig ist.

## Secrets in CI/CD

Regeln für Pipelines:

- keine Secrets bei Pull Requests aus Forks,
- Produktions-Secrets nur in geschützten Environments,
- Token-Rechte minimal setzen,
- Ausgaben und Debug-Logs prüfen,
- OIDC statt Cloud-Schlüssel verwenden,
- keine Secrets in Artefakten, Caches oder Testreports,
- Secrets nicht als Kommandozeilenargument übergeben, wenn Prozesslisten sichtbar sind.

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  deploy:
    environment: production
    # Cloud-Login tauscht GitHubs OIDC-Identität gegen ein kurzlebiges Token.
```

## Leak Detection und Reaktion

Wenn ein Secret im Repository auftaucht, reicht das Löschen aus dem letzten Commit nicht. Der Wert kann in Historie, Forks, Caches und Logs liegen.

Sofortmaßnahmen:

1. Secret widerrufen oder rotieren.
2. betroffene Systeme und Rechte bestimmen.
3. Zugriffs- und Nutzungslogs sichern.
4. verdächtige Nutzung untersuchen.
5. Secret aus aktueller Quelle entfernen.
6. Historie nur bei echtem Bedarf und mit koordiniertem Vorgehen bereinigen.
7. Ursache und fehlende Kontrolle beheben.

::: danger Rotation zuerst
Ein geleakter Wert bleibt auch dann kompromittiert, wenn er aus Git entfernt wurde. Erst widerrufen, dann aufräumen.
:::

## Lokale Entwicklung

- Beispielkonfiguration als `.env.example` ohne Werte committen.
- echte `.env`-Dateien ignorieren.
- getrennte, niedrig privilegierte Dev-Zugänge verwenden.
- produktive Daten und Secrets lokal vermeiden.
- Secret-CLI oder Plattform-Login nutzen, statt Werte in Chat, Wiki oder Tickets zu kopieren.

## Betriebscheckliste

- [ ] Jedes Secret hat Owner und dokumentierten Zweck.
- [ ] Rechte sind pfad- und operationsbezogen.
- [ ] Langfristige Schlüssel wurden auf Vermeidbarkeit geprüft.
- [ ] Rotation ist automatisiert und getestet.
- [ ] Audit-Logs werden überwacht und geschützt.
- [ ] Break-Glass-Zugriff ist zeitlich begrenzt.
- [ ] Anwendungen können neue Werte ohne Ausfall laden.
- [ ] Leak Detection deckt Git, Images und Logs ab.
- [ ] Es existiert ein geprobter Widerrufsprozess.

## Weiterführende Quellen

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [GitHub Actions und OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)

Weiter: [CI/CD absichern](./cicd-security).
