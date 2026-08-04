---
title: Clean Architecture
description: Fachlogik von Frameworks, Datenbanken und Transportwegen entkoppeln.
---

# Clean Architecture – Abhängigkeiten zeigen nach innen

Clean Architecture schützt fachlich wichtige Regeln vor häufig wechselnden technischen Details. Datenbank, Web-Framework, Queue und UI sind Adapter; die Domäne soll ohne sie verständlich und testbar bleiben.

<div class="tag-row"><span class="tag">Architecture</span><span class="tag">Domain</span><span class="tag">Ports & Adapters</span><span class="tag">Testing</span></div>

## Die Schichten

Eine pragmatische Variante:

<div class="architecture-stack">
  <div class="architecture-layer"><strong>Frameworks & Adapter</strong><span>HTTP, CLI, Datenbank, Queue</span></div>
  <div class="architecture-layer architecture-layer--application"><strong>Application</strong><span>Use Cases, Ports, Transaktionen</span></div>
  <div class="architecture-layer architecture-layer--domain"><strong>Domain</strong><span>Regeln, Werte, Invarianten</span></div>
</div>

Die Dependency Rule: Quellcode-Abhängigkeiten zeigen nach innen. Die Domäne importiert kein Web-Framework und keinen Datenbanktreiber.

## Beispiel: Benutzer registrieren

### Domain

```typescript
class EmailAddress {
  private constructor(readonly value: string) {}

  static create(value: string): EmailAddress {
    const normalized = value.trim().toLowerCase()
    if (!normalized.includes('@')) throw new Error('invalid email')
    return new EmailAddress(normalized)
  }
}
```

### Application Port

```typescript
interface UserRepository {
  existsByEmail(email: EmailAddress): Promise<boolean>
  save(user: User): Promise<void>
}
```

### Use Case

```typescript
class RegisterUser {
  constructor(private readonly users: UserRepository) {}

  async execute(input: { email: string }): Promise<{ id: string }> {
    const email = EmailAddress.create(input.email)

    if (await this.users.existsByEmail(email)) {
      throw new Error('email already registered')
    }

    const user = User.register(email)
    await this.users.save(user)
    return { id: user.id }
  }
}
```

### Adapter

```typescript
class PostgresUserRepository implements UserRepository {
  // Übersetzt zwischen Domain-Objekten und Datenbankschema.
}
```

Der Use Case lässt sich mit einem In-Memory-Repository testen. PostgreSQL wird erst im Adapter relevant.

## Ports und Adapter

Ein **Port** beschreibt, was die Anwendung braucht oder anbietet. Ein **Adapter** übersetzt eine konkrete Technologie in diesen Vertrag.

| Port | möglicher Adapter |
|---|---|
| `UserRepository` | PostgreSQL, In-Memory, API |
| `PaymentGateway` | Stripe, Test-Fake |
| `Clock` | Systemzeit, feste Testzeit |
| `EventPublisher` | Kafka, In-Process |
| HTTP Input | Express, ASP.NET, Lambda Handler |

Ports gehören fachlich zur inneren Seite. Adapter hängen von ihnen ab, nicht umgekehrt.

## Datenmodelle nicht überall teilen

Ein einziges Modell für HTTP, Domain und Datenbank führt zu Kopplung:

- API-Feld wird zur Datenbankmigration,
- ORM-Annotationen landen in Fachobjekten,
- interne Felder werden versehentlich serialisiert,
- externe Validierung ersetzt fachliche Invarianten.

Bewusste Übersetzungen erzeugen etwas Code, schützen aber Grenzen und Sicherheitsannahmen.

## Transaktionen gehören zum Use Case

Die Anwendungsschicht kennt die fachliche Einheit der Arbeit:

```typescript
interface UnitOfWork {
  execute<T>(operation: () => Promise<T>): Promise<T>
}
```

Der Datenbankadapter implementiert die technische Transaktion. Der Use Case entscheidet, welche Schritte atomar sein müssen.

## Ereignisse und Nebenwirkungen

Ein Use Case kann ein Domain Event erzeugen. Das direkte Publizieren vor dem Datenbank-Commit erzeugt jedoch Inkonsistenz.

Outbox-Muster:

1. Fachänderung und Event werden in derselben Transaktion gespeichert.
2. separater Publisher liest unveröffentlichte Events.
3. erfolgreiche Zustellung wird markiert.
4. Konsumenten behandeln Wiederholungen idempotent.

## Teststrategie

| Bereich | Testart |
|---|---|
| Value Objects und Regeln | schnelle Unit Tests |
| Use Cases | Unit Tests mit Fakes |
| Adapter | Integrationstest gegen echte Technologie |
| Zusammenspiel | wenige End-to-End-Tests |

Wenn jeder Fachtest eine Datenbank und einen Webserver benötigt, zeigen die Abhängigkeiten wahrscheinlich in die falsche Richtung.

## Ordnerstruktur

```text
src/
├── domain/
│   ├── model/
│   └── services/
├── application/
│   ├── ports/
│   └── use-cases/
├── adapters/
│   ├── persistence/
│   ├── messaging/
│   └── web/
└── bootstrap/
```

Der Bootstrap verdrahtet konkrete Adapter. Er ist der Ort, an dem Framework und Anwendung bewusst zusammenkommen.

## Wann eine einfachere Architektur reicht

Für ein kleines CRUD-Werkzeug ohne komplexe Regeln kann eine klare Schichtenarchitektur genügen. Clean Architecture lohnt sich besonders bei:

- langlebiger Fachlogik,
- mehreren Ein- oder Ausgabekanälen,
- wechselnden Infrastrukturkomponenten,
- hoher Testanforderung,
- mehreren Teams und klaren Ownership-Grenzen.

Nicht jede Anwendung braucht Domain Events, Repository-Abstraktionen und fünf Projekte. Die Richtung der Abhängigkeiten ist wichtiger als die Anzahl der Ordner.

## Architektur-Smells

- Domain importiert ORM oder HTTP-Typen.
- Controller enthält Geschäftsregeln.
- Use Case gibt Datenbank-Entities zurück.
- Tests brauchen für jede Regel echte Infrastruktur.
- Interface spiegelt exakt die Methoden eines Vendors.
- Framework-Wechsel wäre ein kompletter Rewrite.
- Mapping-Code wird um jeden Preis vermieden.

## Review-Checkliste

- [ ] Kann die Fachlogik ohne Framework verstanden werden?
- [ ] Zeigen Abhängigkeiten zur Domain/Application?
- [ ] Sind Ports in Fachsprache formuliert?
- [ ] Übersetzen Adapter externe Modelle bewusst?
- [ ] Liegt die Transaktionsgrenze beim Use Case?
- [ ] Sind Nebenwirkungen und Wiederholungen bedacht?
- [ ] Passt die Architektur zur tatsächlichen Komplexität?

## Weiter

- [SOLID-Prinzipien](./solid-prinzipien)
- [Dependency Injection](../Dependency-Injection)
- [Idempotenz](./idempotenz)
