---
title: Cloud-Grundlagen
description: IaaS, PaaS, SaaS, Regionen, Identitäten, Netzwerke, Kosten und Shared Responsibility einordnen.
learning:
  level: Einstieg
  duration: 40 Minuten
  goals:
    - Service- und Bereitstellungsmodelle unterscheiden.
    - Shared Responsibility auf konkrete Aufgaben übertragen.
    - eine kleine Cloud-Architektur anhand von Sicherheit, Verfügbarkeit und Kosten bewerten.
  terms: [IaaS, PaaS, SaaS, Region, IAM]
  practice: Wähle einen bekannten internen Dienst und ordne für On-Premises, IaaS und PaaS jeweils zu, wer Patchen, Backup, Identitäten, Netzwerk und Monitoring verantwortet.
  check:
    - question: Bedeutet Managed Service, dass der Kunde keine Betriebsverantwortung mehr hat?
      answer: Nein. Der Anbieter übernimmt definierte Schichten; Daten, Zugriffe, Konfiguration, Nutzung und oft Backup- oder Wiederherstellungstests bleiben Kundensache.
    - question: Was ist der Unterschied zwischen Skalierbarkeit und Elastizität?
      answer: Skalierbarkeit ist die Fähigkeit, Kapazität anzupassen; Elastizität ist die bedarfsgerechte, häufig automatische Anpassung über die Zeit.
    - question: Warum sind Tags oder Labels wichtig?
      answer: Sie ermöglichen Kosten- und Eigentumszuordnung, Automatisierung, Suche und Policy-Prüfungen.
  next: /devops/infrastructure-as-code
---

# Cloud-Grundlagen

Cloud Computing stellt IT-Ressourcen über standardisierte Schnittstellen bereit. Statt Hardware einzeln zu bestellen und manuell zu konfigurieren, werden Rechenleistung, Speicher, Datenbanken oder Plattformfunktionen bedarfsgerecht angefordert und gemessen abgerechnet.

## Servicemodelle

| Modell | Du verwaltest vor allem | Anbieter verwaltet zusätzlich |
|---|---|---|
| IaaS | Betriebssystem, Laufzeit, Anwendung, Daten | Hardware, physisches Netz, Virtualisierung |
| PaaS | Anwendung, Daten, fachliche Konfiguration | zusätzlich Betriebssystem und Laufzeitplattform |
| SaaS | Benutzer, Daten, Nutzung und Konfiguration | vollständige Anwendung und darunterliegende Plattform |

Die Grenzen sind produktspezifisch. Lies die Leistungsbeschreibung und den Shared-Responsibility-Vertrag des Dienstes.

## Bereitstellungsmodelle

- **Public Cloud:** geteilte Anbieterplattform mit logisch isolierten Kundenressourcen.
- **Private Cloud:** Cloud-Eigenschaften innerhalb einer dedizierten Organisation oder Umgebung.
- **Hybrid Cloud:** lokale und Cloud-Systeme sind gezielt verbunden.
- **Multi-Cloud:** Dienste mehrerer Cloud-Anbieter werden bewusst kombiniert.

Mehr Anbieter erhöhen nicht automatisch die Resilienz. Sie erhöhen auch Netzwerk-, Identitäts-, Betriebs- und Kompetenzaufwand.

## Regionen und Availability Zones

Eine Region ist ein geografischer Bereitstellungsbereich. Availability Zones sind getrennte Standorte oder Fehlerdomänen innerhalb einer Region. Ein Dienst über mehrere Zonen schützt nicht automatisch vor:

- fehlerhaften Deployments,
- gelöschten Daten,
- kompromittierten Identitäten,
- regionalen Abhängigkeiten,
- fehlerhafter DNS- oder Routingkonfiguration.

Hochverfügbarkeit ersetzt kein Backup, und ein Backup ersetzt keinen getesteten Wiederanlaufplan.

## Shared Responsibility

Der Anbieter schützt **die Cloud**; Kunden schützen ihre **Nutzung in der Cloud**. Konkrete Kundenaufgaben bleiben typischerweise:

- Identitäten und Berechtigungen,
- Datenklassifizierung und Verschlüsselungsanforderungen,
- sichere Netzwerkfreigaben,
- Konfiguration von Ressourcen,
- Patchen selbst verwalteter Schichten,
- Logging, Alarmierung und Incident Response,
- Backup- und Restore-Tests,
- Kosten- und Lebenszyklusmanagement.

## Identitäten vor Netzstandorten

Moderne Cloud-Systeme autorisieren Workloads möglichst über eigene Identitäten:

- menschliche Identität für interaktive Arbeit,
- Workload Identity oder Managed Identity für Anwendungen,
- kurzlebige Token statt statischer Schlüssel,
- Rollen mit minimal notwendigen Aktionen,
- getrennte Konten/Subscriptions/Projekte für Fehler- und Sicherheitsgrenzen.

`Administrator` für jede Automatisierung ist bequem, aber weder prüfbar noch sicher.

## Netzwerk-Grundmuster

Eine virtuelle Cloud-Netzwerkumgebung enthält meist:

- private Adressbereiche,
- Subnetze für unterschiedliche Vertrauenszonen,
- Routingtabellen,
- zustandsbehaftete oder zustandslose Filter,
- private und öffentliche Endpunkte,
- Namensauflösung,
- kontrollierte Übergänge zu On-Premises oder Internet.

„Private IP“ bedeutet nicht automatisch „vertrauenswürdig“. Authentisierung, Autorisierung und Verschlüsselung bleiben notwendig.

## Skalierung und Elastizität

- **Vertical scaling:** größere Instanz, mehr CPU/RAM.
- **Horizontal scaling:** mehr Instanzen.
- **Elasticity:** Kapazität passt sich dem Bedarf an.

Automatische Skalierung benötigt sinnvolle Signale und Grenzen. CPU allein bildet Warteschlangen, Datenbanklimits oder externe Rate Limits oft nicht ab.

## Kosten sind eine technische Eigenschaft

Cloud-Kosten entstehen nicht nur durch Rechenzeit:

- dauerhaft ungenutzte Ressourcen,
- Datentransfer zwischen Regionen oder ins Internet,
- überdimensionierte Datenbanken,
- hochvolumige Logs ohne Aufbewahrungsplan,
- Snapshots und verwaiste Datenträger,
- teure Abfragen oder API-Aufrufe.

Jede Ressource sollte mindestens Owner, Anwendung, Umgebung und Kostenstelle tragen. Budgets und Anomaliealarme müssen melden, aber nicht unkontrolliert produktive Ressourcen abschalten.

## Infrastructure as Code

Cloud-Ressourcen gehören in deklarative, versionierte Definitionen:

1. Änderung per Pull Request,
2. statische und Policy-Prüfung,
3. Plan mit verständlicher Differenz,
4. kontrollierte Anwendung,
5. Drift- und Zustandsüberwachung.

Gehe weiter zu [Infrastructure as Code](../devops/infrastructure-as-code) und [GitOps in der Praxis](../devops/gitops-praxis).

## Architekturfragen für Einsteiger

- Was ist die kleinste sinnvolle Fehlerdomäne?
- Welche Daten dürfen die Region verlassen?
- Wer kann Ressource und Daten löschen?
- Wie wird ein Secret bereitgestellt und rotiert?
- Welche Abhängigkeit begrenzt die Skalierung?
- Welche Logs belegen einen Zugriff?
- Wie lange darf Wiederherstellung dauern?
- Welche Kosten entstehen bei normaler und maximaler Last?

**Primärquellen:** [NIST Definition of Cloud Computing](https://csrc.nist.gov/publications/detail/sp/800-145/final), [AWS Shared Responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/), [Microsoft Azure shared responsibility](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), [Google Cloud shared responsibility](https://cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate)
