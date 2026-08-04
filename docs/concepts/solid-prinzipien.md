---
title: SOLID-Prinzipien
description: SOLID als praktische Entscheidungswerkzeuge für wartbaren Code verstehen.
---

# SOLID-Prinzipien – fünf Fragen an einen Entwurf

SOLID ist kein Qualitätssiegel und keine Checkliste für möglichst viele Interfaces. Die fünf Prinzipien helfen, Änderungsdruck, Verantwortlichkeiten und Abhängigkeiten sichtbar zu machen.

<div class="tag-row"><span class="tag">Design</span><span class="tag">Architecture</span><span class="tag">Maintainability</span><span class="tag">Testing</span></div>

## S – Single Responsibility Principle

> Eine Einheit sollte einen klaren Verantwortungsbereich und damit einen wesentlichen Grund zur Änderung haben.

Problematisch:

```typescript
class InvoiceService {
  calculateTotal(invoice: Invoice) { /* Fachlogik */ }
  saveToDatabase(invoice: Invoice) { /* Persistenz */ }
  renderPdf(invoice: Invoice) { /* Darstellung */ }
  sendEmail(invoice: Invoice) { /* Transport */ }
}
```

Vier unterschiedliche Änderungsgründe liegen in einer Klasse. Besser getrennt:

```typescript
class InvoiceCalculator { /* Fachlogik */ }
class InvoiceRepository { /* Persistenz */ }
class InvoiceDocumentRenderer { /* Darstellung */ }
class InvoiceDelivery { /* Transport */ }
```

Zu kleine Einheiten können ebenfalls schaden. Die Grenze ist sinnvoll, wenn die Teile unabhängig geändert, getestet oder ausgetauscht werden.

### Review-Fragen

- Welche Rolle fordert diese Änderung an?
- Müssen fachliche und technische Gründe dieselbe Datei ändern?
- Kann die Einheit mit einem Satz ohne „und“ beschrieben werden?

## O – Open/Closed Principle

> Verhalten sollte erweiterbar sein, ohne stabile Kernlogik ständig zu verändern.

Eine lange Fallunterscheidung wächst mit jedem neuen Typ:

```typescript
function price(order: Order): number {
  if (order.customerType === 'standard') return order.total
  if (order.customerType === 'partner') return order.total * 0.9
  if (order.customerType === 'employee') return order.total * 0.8
  throw new Error('unknown customer type')
}
```

Eine explizite Strategie macht Erweiterung lokal:

```typescript
interface PricingPolicy {
  calculate(order: Order): number
}

class PartnerPricing implements PricingPolicy {
  calculate(order: Order) {
    return order.total * 0.9
  }
}
```

Nicht jede `if`-Anweisung ist ein Verstoß. Wenn die Varianten klein, stabil und gemeinsam geändert werden, ist eine Fallunterscheidung oft klarer als ein abstraktes Plugin-System.

## L – Liskov Substitution Principle

> Eine Implementierung muss dort einsetzbar sein, wo ihre Abstraktion erwartet wird, ohne überraschende Vertragsbrüche.

Ein klassisches Warnsignal ist eine Unterklasse, die geerbte Operationen nicht unterstützt:

```typescript
interface WritableStore {
  read(key: string): Promise<string | undefined>
  write(key: string, value: string): Promise<void>
}

class ReadOnlyStore implements WritableStore {
  async write(): Promise<void> {
    throw new Error('not supported')
  }
}
```

Besser sind passende Fähigkeiten:

```typescript
interface ReadableStore {
  read(key: string): Promise<string | undefined>
}

interface WritableStore extends ReadableStore {
  write(key: string, value: string): Promise<void>
}
```

Der Vertrag umfasst mehr als Typen:

- Vorbedingungen dürfen nicht überraschend strenger werden.
- Nachbedingungen dürfen nicht schwächer werden.
- dokumentierte Fehler und Seiteneffekte bleiben kompatibel.
- Performance- oder Konsistenzannahmen können Teil des Vertrags sein.

## I – Interface Segregation Principle

> Konsumenten sollten nicht von Fähigkeiten abhängen, die sie nicht benötigen.

Zu breit:

```typescript
interface UserPlatform {
  findUser(id: string): Promise<User>
  createUser(input: NewUser): Promise<User>
  deleteUser(id: string): Promise<void>
  exportAllUsers(): Promise<Buffer>
  resetPassword(id: string): Promise<void>
}
```

Ein Report braucht wahrscheinlich nur Lesen:

```typescript
interface UserReader {
  findUser(id: string): Promise<User>
}

interface UserWriter {
  createUser(input: NewUser): Promise<User>
  deleteUser(id: string): Promise<void>
}
```

Kleine Interfaces reduzieren Testaufwand und Berechtigungen. Sie sollten aber fachlich benannt sein; ein Interface pro Methode ohne Domänenbedeutung erzeugt nur Fragmentierung.

## D – Dependency Inversion Principle

> Fachlich wichtige Regeln sollten nicht direkt von technischen Details abhängen. Beide hängen von einer geeigneten Abstraktion ab.

Direkt gekoppelt:

```typescript
class RegisterUser {
  private database = new PostgresUserRepository()
  private mailer = new SmtpMailer()
}
```

Abhängigkeiten explizit:

```typescript
interface UserRepository {
  save(user: User): Promise<void>
}

interface WelcomeMessage {
  send(user: User): Promise<void>
}

class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly welcome: WelcomeMessage
  ) {}
}
```

Die Fachlogik kennt Fähigkeiten, nicht konkrete Datenbank oder Mailbibliothek. Die konkrete Anwendung verdrahtet Implementierungen am Rand.

## Prinzipien wirken zusammen

Ein typischer Entwurf:

- SRP trennt Fachregel, Persistenz und Transport.
- ISP beschreibt kleine, konsumorientierte Ports.
- DIP richtet Abhängigkeiten zur Fachlogik aus.
- LSP sorgt dafür, dass Adapter den Port-Vertrag einhalten.
- OCP erlaubt neue Adapter oder Strategien ohne Kernumbau.

## Wann SOLID übertrieben wird

- Interface und Implementierung haben immer exakt eine Klasse ohne Änderungsdruck.
- Einfache Datenumwandlung verteilt sich über zehn Dateien.
- Abstraktionen spiegeln Framework-Typen statt Domänensprache.
- Jede zukünftige Möglichkeit wird vorab eingebaut.
- Navigation und Debugging werden schwerer als die eigentliche Änderung.

Eine gute Abstraktion folgt beobachtetem Änderungsdruck. Sie ist keine Wette auf jede denkbare Zukunft.

## Refactoring-Reihenfolge

1. Verhalten mit Tests absichern.
2. konkrete Änderungsgründe identifizieren.
3. kleinste sinnvolle Grenze ziehen.
4. Abhängigkeit explizit machen.
5. Namen an Fachsprache ausrichten.
6. Komplexität nach der Änderung erneut bewerten.

## Review-Checkliste

- [ ] Ist die Verantwortung der Einheit klar?
- [ ] Liegen Fachlogik und Infrastruktur unnötig zusammen?
- [ ] Erfüllen Implementierungen den gesamten Vertrag?
- [ ] Müssen Konsumenten ungenutzte Methoden kennen?
- [ ] Zeigen zentrale Abhängigkeiten zur Fachlogik?
- [ ] Löst die Abstraktion ein reales Änderungsproblem?
- [ ] Ist die Lösung einfacher zu testen und zu erklären?

## Weiter

- [Dependency Injection](../Dependency-Injection)
- [Clean Architecture](./clean-architecture)
- [Idempotenz](./idempotenz)
