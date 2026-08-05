---
title: Singleton Pattern
description: Das Singleton-Entwurfsmuster, seine Implementierung und seine versteckten Kosten verständlich erklärt.
learning:
  level: Aufbau
  duration: 30 Minuten
  goals:
    - Singleton als Lebenszyklusentscheidung statt nur als Codeform erkennen.
    - Thread-Sicherheit und Testbarkeit verschiedener Varianten bewerten.
    - Alternativen wie Dependency Injection und explizite Instanzen auswählen.
  terms: [Singleton, globaler Zustand, Lebenszyklus, Thread-Sicherheit, Testbarkeit]
  practice: Nimm eine Singleton-Implementierung und schreibe sie so um, dass der Aufrufer eine Abstraktion per Konstruktor erhält. Vergleiche anschließend den Unit-Test-Aufwand.
  check:
    - question: Garantiert ein privater Konstruktor allein genau eine Instanz?
      answer: Nein. Zusätzlich braucht es einen kontrollierten, thread-sicheren Erzeugungs- und Zugriffsweg; Reflection oder mehrere Prozessgrenzen sind weitere Kontexte.
    - question: Warum erschwert globaler Zustand Tests?
      answer: Tests beeinflussen sich über denselben Zustand, Reihenfolge wird relevant und Abhängigkeiten sind im Konstruktor nicht sichtbar.
    - question: Wann kann Singleton sinnvoll sein?
      answer: Bei einem tatsächlich pro Prozess eindeutigen, zustandsarmen Dienst mit kontrolliertem Lebenszyklus, wenn die Abhängigkeit trotzdem explizit injiziert wird.
  next: /Dependency-Injection
---

# Singleton Pattern – genau eine Instanz, viele Trade-offs

Ein Singleton stellt innerhalb eines definierten Gültigkeitsbereichs genau eine Instanz bereit und bietet einen global erreichbaren Zugriff. Der wichtige Teil ist nicht die statische Eigenschaft, sondern die Frage: **Wer kontrolliert Erzeugung, Lebensdauer und gemeinsamen Zustand?**

## Typische Eigenschaften

- Konstruktion ist von außen eingeschränkt.
- Initialisierung erfolgt einmalig und thread-sicher.
- Aufrufer erhalten dieselbe Instanz.
- Lebensdauer ist meist der gesamte Prozess.

„Einmal pro Prozess“ ist nicht „einmal im verteilten System“. Mehrere Worker, Container oder Server besitzen jeweils ihre eigene Instanz.

## C#: sichere Lazy-Initialisierung

```csharp
public sealed class ApplicationClock
{
    private static readonly Lazy<ApplicationClock> LazyInstance =
        new(() => new ApplicationClock());

    private ApplicationClock() { }

    public static ApplicationClock Instance => LazyInstance.Value;

    public DateTimeOffset UtcNow() => DateTimeOffset.UtcNow;
}
```

`Lazy<T>` übernimmt thread-sichere Initialisierung. Trotzdem bleibt `ApplicationClock.Instance` eine versteckte globale Abhängigkeit.

## Go: `sync.Once`

```go
package configuration

import "sync"

type Config struct {
	Endpoint string
}

var (
	instance *Config
	once     sync.Once
)

func Instance() *Config {
	once.Do(func() {
		instance = &Config{Endpoint: "https://example.test"}
	})
	return instance
}
```

Die Initialisierung ist geschützt. Veränderliche Felder der Instanz sind dadurch aber noch nicht automatisch threadsicher.

## Python: Modul statt Singleton-Klasse

Python-Module werden pro Interpreter normalerweise einmal geladen. Oft genügt deshalb eine Modulinstanz. Für Tests und explizite Abhängigkeiten ist eine normal erzeugte Klasse meist klarer:

```python
class Clock:
    def now(self):
        return datetime.now(timezone.utc)


def build_application():
    clock = Clock()
    return Application(clock=clock)
```

## Versteckte Kosten

### Unsichtbare Abhängigkeit

Eine Methode kann intern auf `Singleton.Instance` zugreifen, ohne dass ihr Vertrag dies zeigt. Aufrufer und Tests erkennen die Abhängigkeit erst im Code.

### Gemeinsamer veränderlicher Zustand

Ein Cache, Zähler oder Konfigurationsobjekt wird von vielen Stellen verändert. Reihenfolge und Parallelität beeinflussen das Ergebnis.

### Schwierige Tests

- Zustand muss zwischen Tests zurückgesetzt werden.
- Tests können nicht sicher parallel laufen.
- Ersatzimplementierungen erfordern globale Hooks.
- ein fehlgeschlagener Test verschmutzt Folgetests.

### Falsche Eindeutigkeit

In Container- oder Serverfarmen gibt es viele Prozesse. Ein Singleton koordiniert keine global eindeutige Nummer, keinen verteilten Lock und keine Cluster-Leaderwahl.

## Bessere Alternative: DI-Lebenszyklus

In .NET kann der Container einen Dienst einmal pro Anwendung erzeugen, während Verbraucher die Abhängigkeit explizit erhalten:

```csharp
builder.Services.AddSingleton<IClock, SystemClock>();

public sealed class ReportService(IClock clock)
{
    public Report Create() => new(clock.UtcNow());
}
```

Der Lebenszyklus ist zentral konfiguriert, die Klasse hängt von einer Abstraktion ab, und Tests können eine Fake Clock übergeben.

## Entscheidungshilfe

Frage vor der Verwendung:

1. Muss die Instanz wirklich pro Prozess eindeutig sein?
2. Ist ihr Zustand unveränderlich oder synchronisiert?
3. Kann die Abhängigkeit explizit injiziert werden?
4. Wie wird sie in parallelen Tests ersetzt?
5. Was passiert bei mehreren Prozessen oder Instanzen?
6. Wer beendet und räumt Ressourcen auf?

Ein Singleton ist kein automatisches Anti-Pattern. Globaler, veränderlicher und versteckter Zustand ist aber ein starkes Warnsignal.
