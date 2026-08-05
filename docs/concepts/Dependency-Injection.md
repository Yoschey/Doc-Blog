---
title: Dependency Injection in .NET
description: Abhängigkeiten explizit machen, Lebenszyklen wählen und testbare .NET-Komponenten bauen.
learning:
  level: Aufbau
  duration: 40 Minuten
  goals:
    - Dependency Injection, Inversion of Control und Service Locator unterscheiden.
    - Constructor Injection in modernem .NET anwenden.
    - Transient, Scoped und Singleton anhand des Zustands auswählen.
  terms: [Dependency Injection, IoC, Abstraktion, Lebenszyklus, Composition Root]
  practice: Extrahiere aus einer Klasse, die selbst Datei- oder Netzwerkzugriffe erzeugt, ein kleines Interface. Injiziere die Abhängigkeit und schreibe einen Unit-Test ohne echten I/O.
  check:
    - question: Was ist der Composition Root?
      answer: Der zentrale Ort, an dem konkrete Implementierungen erzeugt, konfiguriert und zu einem Objektgraphen verbunden werden, in ASP.NET Core typischerweise Program.cs.
    - question: Warum darf ein Singleton nicht einfach einen Scoped Service halten?
      answer: Der Singleton lebt länger und würde eine scoped Instanz über deren vorgesehenen Gültigkeitsbereich hinaus festhalten.
    - question: Was unterscheidet Service Locator von Constructor Injection?
      answer: Service Locator sucht Abhängigkeiten verdeckt zur Laufzeit; Constructor Injection macht sie im Konstruktorvertrag sichtbar.
  next: /concepts/solid-prinzipien
---

# Dependency Injection in .NET

Dependency Injection (DI) bedeutet: Eine Klasse erzeugt ihre benötigten Dienste nicht selbst, sondern erhält sie von außen. Dadurch werden Abhängigkeiten im Vertrag sichtbar und Implementierungen austauschbar.

## Ohne DI: harte Kopplung

```csharp
public sealed class OrderService
{
    public async Task ProcessAsync(Order order)
    {
        var repository = new SqlOrderRepository("production-connection");
        var mailer = new SmtpMailer();

        await repository.SaveAsync(order);
        await mailer.SendConfirmationAsync(order.CustomerEmail);
    }
}
```

Probleme:

- Klasse entscheidet über Konfiguration und Lebenszyklus.
- Unit-Test benötigt echte Datenbank und Mailserver oder invasive Tricks.
- alternative Implementierung verändert fachlichen Code.
- Abhängigkeiten sind am Konstruktor nicht erkennbar.

## Mit Constructor Injection

```csharp
public interface IOrderRepository
{
    Task SaveAsync(Order order, CancellationToken cancellationToken);
}

public interface IConfirmationSender
{
    Task SendAsync(Order order, CancellationToken cancellationToken);
}

public sealed class OrderService(
    IOrderRepository repository,
    IConfirmationSender confirmationSender)
{
    public async Task ProcessAsync(
        Order order,
        CancellationToken cancellationToken)
    {
        await repository.SaveAsync(order, cancellationToken);
        await confirmationSender.SendAsync(order, cancellationToken);
    }
}
```

Die Klasse beschreibt jetzt klar, was sie braucht. Sie entscheidet nicht, welche Datenbank oder welcher Mailanbieter verwendet wird.

## Composition Root in `Program.cs`

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();
builder.Services.AddScoped<IConfirmationSender, SmtpConfirmationSender>();
builder.Services.AddScoped<OrderService>();

var app = builder.Build();
app.Run();
```

Der Composition Root ist der zentrale Ort, an dem der Objektgraph verdrahtet wird. Fachklassen sollten den DI-Container nicht selbst abfragen.

## Lebenszyklen

| Lebenszyklus | Instanz | geeignet für |
|---|---|---|
| Transient | bei jeder Auflösung neu | leichte, zustandsarme Dienste |
| Scoped | einmal pro Scope, in Web-Apps meist Request | Request-Kontext, typische Datenbank-Session |
| Singleton | einmal für die Anwendung | thread-sichere, lang lebende Dienste ohne scoped Abhängigkeit |

Ein längerer Lebenszyklus darf keine kürzer lebende Instanz festhalten. Ein Singleton, das direkt einen scoped `DbContext` erhält, ist daher ein Fehler im Lebenszyklusdesign.

## Unit-Test ohne echten I/O

```csharp
public sealed class InMemoryOrderRepository : IOrderRepository
{
    public List<Order> Saved { get; } = [];

    public Task SaveAsync(Order order, CancellationToken cancellationToken)
    {
        Saved.Add(order);
        return Task.CompletedTask;
    }
}

[Fact]
public async Task Process_saves_order()
{
    var repository = new InMemoryOrderRepository();
    var sender = new RecordingConfirmationSender();
    var service = new OrderService(repository, sender);
    var order = new Order("order-123", "azubi@example.test");

    await service.ProcessAsync(order, CancellationToken.None);

    Assert.Contains(order, repository.Saved);
}
```

Der Test kontrolliert die Grenzen. Ob für jede Abhängigkeit ein Mock nötig ist, hängt vom Design ab; kleine Fakes sind oft leichter zu verstehen.

## Interfaces mit Bedacht

Nicht jede Klasse braucht automatisch ein eigenes Interface. Eine Abstraktion lohnt sich besonders an Grenzen:

- Netzwerk und APIs,
- Dateisystem und Uhrzeit,
- Datenbankzugriff,
- Nachrichtensystem,
- externe Identität oder Secret-Plattform.

Ein Interface mit nur einer Implementierung kann trotzdem sinnvoll sein, wenn Tests oder Architekturgrenzen davon profitieren. Es ist aber kein Selbstzweck.

## Häufige Fehler

- **Service Locator:** Klasse erhält `IServiceProvider` und sucht versteckt beliebige Dienste.
- **God Constructor:** sehr viele Parameter weisen auf zu viele Verantwortlichkeiten hin.
- **Falscher Lifetime:** Singleton hält scoped oder nicht thread-sicheren Zustand.
- **Konfiguration überall:** Fachcode liest globale Konfiguration statt typisierter Optionen.
- **I/O im Konstruktor:** Objektaufbau führt Netzwerk- oder Datenbankaktionen aus.
- **Container im Domain-Layer:** Fachlogik hängt direkt vom DI-Framework ab.

## Verbindung zu SOLID

DI unterstützt das Dependency-Inversion-Prinzip: High-Level-Logik hängt von geeigneten Abstraktionen, nicht von konkreten technischen Details. DI allein macht ein Design aber nicht automatisch sauber. Schlechte Grenzen bleiben schlechte Grenzen – nur konfigurierbarer.

## Checkliste

- [ ] Abhängigkeiten stehen im Konstruktor.
- [ ] Composition Root enthält die Verdrahtung.
- [ ] Lebenszyklen passen zu Zustand und Thread-Sicherheit.
- [ ] Abstraktionen liegen an sinnvollen Grenzen.
- [ ] Konstruktoren führen kein I/O aus.
- [ ] Klassen können ohne globalen Zustand getestet werden.
- [ ] Cancellation Tokens laufen durch asynchrone Grenzen.

Weiter: [SOLID-Prinzipien](/concepts/solid-prinzipien), [Clean Architecture](/concepts/clean-architecture), [Singleton Pattern](/Singelton).

**Primärquelle:** [.NET Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
