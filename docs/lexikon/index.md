---
title: DevOps-Lexikon A–Z
description: Mehr als 100 zentrale Begriffe aus DevOps, Cloud, Linux, Security und Softwarebetrieb verständlich erklärt.
aside: false
outline: [2, 3]
---

# DevOps-Lexikon A–Z

Kurze Definitionen für Ausbildung, Review und täglichen Betrieb. Ein Begriff erklärt das gemeinsame Vokabular; die verlinkten Guides zeigen die praktische Anwendung.

<nav class="lexicon-nav" aria-label="Buchstabenindex">
  <a href="#a">A</a><a href="#b">B</a><a href="#c">C</a><a href="#d">D</a><a href="#e">E</a><a href="#f">F</a><a href="#g">G</a><a href="#h">H</a><a href="#i">I</a><a href="#j">J</a><a href="#k">K</a><a href="#l">L</a><a href="#m">M</a><a href="#n">N</a><a href="#o">O</a><a href="#p">P</a><a href="#q">Q</a><a href="#r">R</a><a href="#s">S</a><a href="#t">T</a><a href="#u">U</a><a href="#v">V</a><a href="#w">W</a><a href="#x">X</a><a href="#y">Y</a><a href="#z">Z</a>
</nav>

## A

**Agent** – Ausführende Instanz für einen Job, zum Beispiel ein Runner in einer CI/CD-Pipeline. Der Agent benötigt Werkzeuge, Netzwerkzugang und möglichst minimale Rechte.

**Agilität** – Fähigkeit, durch kleine Schritte und schnelles Feedback auf neue Erkenntnisse zu reagieren. Agil bedeutet nicht planlos oder ohne Dokumentation.

**Alert** – Benachrichtigung über einen Zustand, der zeitnah menschliche Reaktion erfordert. Gute Alerts sind handlungsorientiert und mit einem Runbook verknüpft.

**API** – Application Programming Interface; definierte Schnittstelle, über die Software Funktionen oder Daten anbietet. Eine Web-API verwendet häufig HTTP und JSON.

**Artefakt** – Unveränderliches Ergebnis eines Builds, etwa ein Paket, Container-Image oder Archiv. Ein Artefakt sollte eindeutig zu Commit und Pipeline-Lauf zurückverfolgbar sein.

**Authentisierung** – Prüfung, **wer** eine Identität ist, zum Beispiel durch Schlüssel, Token oder MFA. Oft als AuthN abgekürzt.

**Autorisierung** – Entscheidung, **was** eine authentisierte Identität tun darf. Oft als AuthZ abgekürzt.

**Autoscaling** – Automatische Anpassung von Kapazität anhand definierter Signale und Grenzen. Sie löst keine ineffiziente Anwendung und keine harte Abhängigkeit automatisch.

**Availability** – Anteil der Zeit oder Anfragen, in dem ein Dienst die vereinbarte Funktion bereitstellt. Sie sollte aus Nutzersicht und über ein klares SLI gemessen werden.

## B

**Backoff** – Zunehmende Wartezeit zwischen Wiederholungen. Exponentieller Backoff mit Jitter verhindert, dass viele Clients gleichzeitig erneut Last erzeugen.

**Backup** – Gesicherte Kopie von Daten für die Wiederherstellung. Erst ein erfolgreicher Restore-Test belegt, dass ein Backup brauchbar ist.

**Baseline** – Messbarer Normalzustand als Vergleich für Diagnose oder Veränderung. Ohne Baseline ist „hoch“, „langsam“ oder „ungewöhnlich“ oft nicht belastbar.

**Blue/Green Deployment** – Zwei vollständige Umgebungen; Traffic wird nach Prüfung von der alten auf die neue umgeschaltet. Der schnelle Rückweg kostet zusätzliche Kapazität.

**Branch** – Beweglicher Git-Zeiger auf einen Commit und damit eine Entwicklungslinie. Kurze Branches reduzieren Abweichung und Integrationsaufwand.

**Build** – Reproduzierbarer Vorgang, der Quellcode und deklarierte Abhängigkeiten in ein prüfbares Artefakt überführt.

## C

**Cache** – Zwischenspeicher für schneller wiederverwendbare Daten. Caches brauchen Schlüssel, Gültigkeitsregeln und eine Strategie für veraltete Inhalte.

**Canary Deployment** – Neue Version erhält zunächst nur einen kleinen Traffic-Anteil. Metriken und Abbruchkriterien entscheiden über Fortsetzung oder Rückweg.

**Change Failure Rate** – Anteil ausgelieferter Änderungen, die eine Störung, Korrektur oder Rücknahme erfordern. Definition und Messfenster müssen im Team konsistent sein.

**Checksum** – Fester Prüfwert über Daten, der versehentliche Veränderungen erkennbar macht. Eine [Checksum](../checksum) allein beweist ohne vertrauenswürdigen Vergleichswert keine Herkunft.

**CI** – Continuous Integration; häufiges Integrieren kleiner Änderungen mit automatisiertem Feedback. Siehe [CI/CD-Grundlagen](../grundlagen/ci-cd-grundlagen).

**CD** – Je nach Kontext Continuous Delivery oder Continuous Deployment. Deshalb die beabsichtigte Bedeutung immer ausschreiben.

**CLI** – Command Line Interface; textbasierte Bedienoberfläche, die sich gut dokumentieren und automatisieren lässt.

**Cloud Computing** – Bedarfsgerechte, über Schnittstellen bereitgestellte IT-Ressourcen mit messbarer Nutzung. Siehe [Cloud-Grundlagen](../grundlagen/cloud-grundlagen).

**Cluster** – Gruppe koordinierter Rechner oder Instanzen, die gemeinsam einen Dienst oder eine Plattform bereitstellen.

**Commit** – Unveränderlicher Git-Snapshot mit Metadaten und Verweis auf Vorgänger. Ein Commit sollte eine verständliche, zusammenhängende Absicht abbilden.

**Container** – Isolierter Prozess mit definiertem Dateisystem und Ressourcenrahmen, der den Kernel des Hosts teilt. Siehe [Container-Grundlagen](../devops/container-grundlagen).

**Cron** – Zeitgesteuerter Aufgabenplaner auf Unix-Systemen. Jobs brauchen absolute Pfade, kontrollierte Umgebung, Logging und Fehlerbehandlung.

## D

**Daemon** – Länger laufender Hintergrundprozess, der häufig eine Systemfunktion oder einen Netzwerkdienst bereitstellt.

**Dashboard** – Visualisierte Zusammenstellung von Signalen für eine konkrete Frage. Ein Dashboard ersetzt keine handlungsorientierte Alarmierung.

**Database Migration** – Versionierte Änderung an Schema oder Daten. Rückwärtskompatible, schrittweise Migrationen erleichtern Deployments und Rollbacks.

**Declarative Configuration** – Beschreibung des gewünschten Endzustands statt einzelner Arbeitsschritte. Ein Controller kann Ist und Soll wiederholt abgleichen.

**Dependency** – Externe Bibliothek, Dienstleistung oder Komponente, von der Software abhängt. Abhängigkeiten gehören versioniert, geprüft und aktualisiert.

**Deployment** – Technisches Ausbringen einer Version in eine Umgebung. Es ist vom fachlichen Release für Nutzer zu unterscheiden.

**DevOps** – Gemeinsame Verantwortung von Entwicklung und Betrieb, unterstützt durch Flow, Feedback, Automatisierung und kontinuierliches Lernen. Siehe [Was ist DevOps?](../grundlagen/was-ist-devops).

**DevSecOps** – Integration von Sicherheitsverantwortung und automatisierten Kontrollen in denselben Lebenszyklus statt einer späten separaten Prüfung.

**DNS** – Hierarchisches Namenssystem, das Namen mit Records wie IP-Adressen verbindet. Siehe [HTTP, DNS & TLS](../grundlagen/http-dns-tls).

**Drift** – Unbeabsichtigte Abweichung zwischen deklarierter Konfiguration und realem Zustand, häufig durch manuelle Änderungen.

## E

**Endpoint** – Adressierbarer Kommunikationspunkt einer API oder eines Dienstes, etwa Methode plus URL-Pfad.

**Environment** – Abgegrenzte Laufzeitumgebung wie Development, Test oder Produktion. Trennung umfasst Daten, Rechte, Konfiguration und Fehlerdomänen.

**Ephemeral** – Kurzlebig und ersetzbar. Ephemere Runner oder Container speichern dauerhaften Zustand außerhalb ihres eigenen Lebenszyklus.

**Error Budget** – Erlaubter Unzuverlässigkeitsanteil aus einem SLO. Er schafft eine gemeinsame Entscheidungsgrundlage zwischen Änderungsrate und Stabilitätsarbeit.

**Event** – Diskretes Ereignis zu einem Zeitpunkt, etwa ein Deployment, Login oder Fehler. Events können Logs, Metriken oder Automatisierung auslösen.

**Exit Code** – Ganzzahliger Rückgabestatus eines Prozesses. Unter Unix steht `0` üblicherweise für Erfolg, ein anderer Wert für eine definierte Fehlerklasse.

## F

**Failover** – Wechsel auf eine Ersatzinstanz oder -region nach Fehler. Failover muss regelmäßig getestet und auf Datenkonsistenz geprüft werden.

**Feature Flag** – Laufzeitsteuerung für Funktionen unabhängig vom Deployment. Flags brauchen Owner, Ablaufdatum und sichere Standardwerte.

**Firewall** – Kontrolliert Netzwerkverkehr anhand von Regeln. Sie ersetzt keine Authentisierung und schützt keinen Dienst, der selbst unsicher konfiguriert ist.

**Fork** – Eigenständige Kopie eines Repositorys mit eigener Geschichte und Rechten. CI für nicht vertrauenswürdige Forks darf keine privilegierten Secrets erhalten.

## G

**Gateway** – Übergang oder Router zwischen Netzen beziehungsweise Protokollen. Ein API Gateway kann zusätzlich Authentisierung, Routing und Rate Limits übernehmen.

**Git** – Verteilte Versionsverwaltung für Snapshots und Entwicklungslinien. Siehe [Git-Grundlagen](../grundlagen/git-grundlagen).

**GitOps** – Betriebsmethode, bei der deklarativer Git-Zustand geprüft und automatisiert mit Zielsystemen abgeglichen wird. Siehe [GitOps in der Praxis](../devops/gitops-praxis).

**Golden Signals** – Latenz, Traffic, Fehler und Sättigung als Ausgangspunkte für die Beobachtung nutzerrelevanter Dienste.

**Graceful Shutdown** – Geordnetes Beenden: neue Arbeit stoppen, laufende Arbeit abschließen, Ressourcen freigeben und innerhalb einer Frist enden.

## H

**Hash** – Einweg-Prüfwert fester Länge über Eingabedaten. Kryptografische Hashfunktionen unterstützen Integritätsprüfungen, sind aber keine Verschlüsselung.

**Healthcheck** – Automatisierte Prüfung eines definierten Zustands. Liveness, Readiness und Startup beantworten unterschiedliche Fragen.

**Helm** – Paketmanager und Template-System für Kubernetes-Ressourcen. Ein Chart bündelt Vorlagen, Standardwerte und Metadaten.

**HTTP** – Zustandsloses Anwendungsprotokoll für Requests und Responses. Siehe [HTTP, DNS & TLS](../grundlagen/http-dns-tls).

**HTTPS** – HTTP über einen durch TLS geschützten Kanal. Es bietet Verschlüsselung und Serverauthentisierung, wenn Zertifikate korrekt geprüft werden.

## I

**IaC** – Infrastructure as Code; versionierte, überprüfbare Definition von Infrastruktur. Siehe [Infrastructure as Code](../devops/infrastructure-as-code).

**Idempotenz** – Mehrmaliges Ausführen führt zum selben beabsichtigten Endzustand wie einmaliges Ausführen. Siehe [Idempotenz](../concepts/idempotenz).

**Identity** – Digitale Identität eines Menschen, Dienstes oder Workloads. Berechtigungen sollten kurzlebig und an den konkreten Zweck gebunden sein.

**Image** – Unveränderliches Paket aus Dateisystem-Layern und Metadaten, aus dem Container gestartet werden.

**Immutable** – Nach Erstellung nicht verändert. Neue Versionen ersetzen alte Artefakte oder Instanzen, statt sie manuell umzubauen.

**Incident** – Ungeplante Beeinträchtigung eines Dienstes, die koordinierte Reaktion erfordert. Siehe [Incident-Checkliste](../examples/incident-checkliste).

**Ingress** – Eingehender Netzwerkverkehr oder eine Kubernetes-Ressource für HTTP(S)-Routing zu Diensten.

**Integrationstest** – Prüft das Zusammenspiel mehrerer realer Komponenten oder Schnittstellen und ist meist langsamer als ein Unit-Test.

## J

**Jitter** – Zufällige Abweichung einer Wartezeit, damit viele Clients Wiederholungen nicht synchron ausführen.

**Job** – Abgegrenzte, ausführbare Arbeitseinheit in Pipeline, Scheduler oder Plattform mit Ergebnis und Status.

**JSON** – Textformat für strukturierte Daten aus Objekten, Arrays und primitiven Werten. Kommentare und nachgestellte Kommata gehören nicht zum Standardformat.

## K

**Key Rotation** – Kontrollierter Austausch kryptografischer Schlüssel oder Zugangsdaten. Rotation umfasst neue Ausgabe, Übergangsphase, Widerruf und Verifikation.

**Kubernetes** – Plattform zur Orchestrierung containerisierter Workloads über deklarative Ressourcen und Controller.

## L

**Latency** – Zeitdauer einer Operation oder Anfrage. Verteilungen und Perzentile sind aussagekräftiger als nur ein Durchschnitt.

**Least Privilege** – Jede Identität erhält nur die minimalen Rechte, Ressourcen und Zeitdauer für ihre Aufgabe.

**Load Balancer** – Verteilt Anfragen auf mehrere Ziele und kann Healthchecks, TLS-Terminierung oder Routing übernehmen.

**Lockfile** – Vom Paketmanager erzeugte, genaue Auflösung von Abhängigkeiten. Es unterstützt reproduzierbare Installationen und gehört normalerweise in Git.

**Logging** – Erfassung diskreter Ereignisse mit Zeit, Schweregrad und Kontext. Geheimnisse und unnötige personenbezogene Daten gehören nicht in Logs.

## M

**Main Branch** – Primäre, integrierte Entwicklungslinie eines Repositorys, häufig `main`. Schutzregeln können Review und erfolgreiche Checks verlangen.

**Merge** – Zusammenführen von Entwicklungslinien in Git. Konflikte erfordern eine fachliche Entscheidung über den gewünschten Endzustand.

**Metric** – Numerischer Zeitreihenwert wie Fehlerrate oder Speichernutzung. Labels ermöglichen Aufteilung, können aber bei hoher Kardinalität teuer werden.

**MTTR** – Mehrdeutige Abkürzung, etwa Mean Time to Repair oder Recover. Die konkrete Definition muss immer genannt werden.

**Mutable** – Nach Erstellung veränderbar. Veränderliche Systeme können unbemerkte Unterschiede und schwer reproduzierbare Fehler entwickeln.

## N

**Namespace** – Logische Namens- oder Isolationsgrenze, etwa in Linux oder Kubernetes. Ein Namespace ist nicht automatisch eine starke Sicherheitsgrenze.

**NAT** – Network Address Translation; verändert Adress- oder Portinformationen an einem Netzübertritt.

**Node** – Einzelner Rechner oder virtuelle Instanz in einem Cluster. In Kubernetes führt ein Node Pods aus.

## O

**Observability** – Fähigkeit, inneren Systemzustand aus externen Signalen zu erschließen. Siehe [Observability](../devops/observability).

**OIDC** – OpenID Connect; Identitätsschicht auf OAuth 2.0. CI-Systeme können darüber kurzlebige Cloud-Zugänge statt statischer Secrets erhalten.

**On-call** – Geplante Rufbereitschaft für zeitkritische Betriebsereignisse. Sie benötigt klare Eskalation, Runbooks, Übergaben und nachhaltige Belastungsgrenzen.

**OpenTelemetry** – Offener Standard und Werkzeugsatz zum Erzeugen, Verarbeiten und Exportieren von Traces, Metriken und Logs.

**Orchestrator** – System, das Platzierung, Lebenszyklus und gewünschten Zustand vieler Workloads koordiniert.

## P

**Package** – Versionierte, verteilbare Softwareeinheit samt Metadaten und Abhängigkeiten.

**Pipeline** – Automatisierte Abfolge von Jobs und Qualitätsstufen vom Quellstand zur Auslieferung.

**Port** – Logische Nummer eines TCP- oder UDP-Kommunikationsendpunkts. Siehe [Netzwerk-Grundlagen](../grundlagen/netzwerk-grundlagen).

**Postmortem** – Strukturierte, möglichst schuldarme Auswertung eines Incidents mit Fakten, Ursachenfaktoren und konkreten Verbesserungen.

**Pull Request** – Vorschlag, Änderungen eines Branches zu prüfen und in einen Zielbranch zu integrieren. Enthält Kontext, Diff, Diskussion und Checks.

**Proxy** – Vermittler, der Verkehr im Auftrag eines Clients oder Servers weiterleitet. Siehe [Proxy-Grundlagen](../proxy).

**Provenance** – Nachweis, wie, wo und aus welchen Eingaben ein Artefakt erzeugt wurde. Siehe [Software Supply Chain](../security/software-supply-chain).

## Q

**Quality Gate** – Überprüfbare Bedingung vor der nächsten Prozessstufe, etwa erfolgreiche Tests, Policy oder Freigabe.

**Queue** – Warteschlange, die Produktion und Verarbeitung von Arbeit entkoppelt. Tiefe, Alter und Durchsatz sind wichtige Betriebssignale.

## R

**RBAC** – Role-Based Access Control; Rechte werden Rollen zugeordnet und Identitäten erhalten Rollen statt vieler Einzelrechte.

**Reconciliation** – Wiederholter Abgleich von gewünschtem und aktuellem Zustand durch einen Controller.

**Registry** – Dienst zum Speichern und Verteilen versionierter Pakete oder Container-Images.

**Release** – Fachliche Bereitstellung einer Funktion für Nutzer. Kann über Feature Flags zeitlich vom Deployment getrennt sein.

**Repository** – Versionierter Speicher für Quellcode und Geschichte; bei Git lokal vollständig clonebar.

**Retry** – Wiederholung einer fehlgeschlagenen Operation. Nur bei vorübergehenden Fehlern, begrenzt und mit Backoff/Jitter einsetzen.

**Rollback** – Rückkehr zu einem bekannten vorherigen Zustand. Daten- und Schemaänderungen können den Rückweg begrenzen.

**Rollout** – Kontrollierte Einführung einer Version über Instanzen, Nutzergruppen oder Traffic-Anteile.

**Route** – Regel, die den nächsten Netzwerkweg oder das Ziel einer Anwendungsanfrage bestimmt.

**Runbook** – Handlungsanleitung für einen wiederkehrenden Betriebsfall mit Voraussetzungen, Schritten, Verifikation und Rückweg. Siehe [Runbook-Vorlage](../examples/runbook-vorlage).

## S

**SaaS** – Software as a Service; vollständig bereitgestellte Anwendung, deren Nutzung und Kundendaten trotzdem verantwortet werden müssen.

**SBOM** – Software Bill of Materials; maschinenlesbare Liste der Bestandteile eines Artefakts. Sie ist Inventar, nicht automatisch eine Risikoentscheidung.

**Scaling** – Anpassung der Kapazität vertikal oder horizontal. Skalierung braucht Limits, Zustandsstrategie und messbare Ziele.

**Secret** – Sensibler Wert wie Token, Passwort oder privater Schlüssel. Secrets gehören in einen kontrollierten Lebenszyklus aus Ausgabe, Nutzung, Rotation und Widerruf.

**Service** – Bereitgestellte technische oder fachliche Fähigkeit mit Schnittstelle und vereinbartem Verhalten.

**SLA** – Service Level Agreement; vertragliche Vereinbarung mit Folgen bei Nichterfüllung.

**SLI** – Service Level Indicator; konkrete Messgröße für eine aus Nutzersicht relevante Eigenschaft.

**SLO** – Service Level Objective; Zielbereich für ein SLI in einem Zeitraum.

**Smoke Test** – Schnelle Prüfung weniger kritischer Kernfunktionen nach Build oder Deployment. Siehe [Smoke Tests](../smoketest).

**Source of Truth** – Autoritative Quelle für einen Zustand. Der Begriff ist nur nützlich, wenn Schreibweg und Synchronisation eindeutig sind.

**Stage** – Vorgemerkte Git-Änderungen für den nächsten Commit oder eine abgegrenzte Phase einer Pipeline; Kontext beachten.

**State** – Gespeicherter Zustand eines Systems. State braucht Ownership, Konsistenz, Sicherung und kontrollierte Veränderung.

**Supply Chain** – Gesamtheit aus Quellcode, Abhängigkeiten, Buildsystem, Artefakten und Verteilung. Siehe [Software Supply Chain](../security/software-supply-chain).

## T

**Tag** – Unbewegliche Git-Referenz zur Kennzeichnung eines Commits oder Metadatenlabel an Ressourcen. Bedeutung hängt vom Kontext ab.

**Telemetry** – Automatisch erzeugte Betriebsdaten wie Logs, Metriken und Traces.

**Terraform** – Werkzeug für deklarative Infrastructure as Code mit Providern, Plan und State.

**TLS** – Transport Layer Security; schützt Kommunikation durch Verschlüsselung, Integrität und authentisierte Identität.

**Trace** – Verfolgung einer einzelnen Anfrage über Operationen und Dienstgrenzen anhand zusammengehöriger Spans.

**Trunk-based Development** – Kurze Entwicklungszweige oder direkte kleine Änderungen an einer zentralen Linie mit schneller Integration.

**TTL** – Time to Live; begrenzt Lebensdauer oder Cache-Gültigkeit, zum Beispiel bei DNS-Records oder Netzwerkpaketen.

## U

**Unit-Test** – Schneller, isolierter Test einer kleinen Verhaltenseinheit. Externe Abhängigkeiten werden kontrolliert ersetzt oder vermieden.

**Uptime** – Laufzeit oder Erreichbarkeitsanteil. Ein laufender Prozess kann dennoch keine korrekte Nutzerfunktion liefern.

## V

**Versionierung** – Eindeutige Kennzeichnung und Historie von Code, API, Schema, Paket oder Konfiguration.

**Virtual Machine** – Virtueller Rechner mit eigenem Gastbetriebssystem und Kernel, isoliert durch einen Hypervisor.

**Volume** – Persistenter Speicher, dessen Lebenszyklus von einem kurzlebigen Container oder einer Instanz getrennt ist.

## W

**Webhook** – HTTP-Aufruf, den ein System bei einem Ereignis an ein anderes sendet. Empfänger sollten Signatur, Wiederholung und Idempotenz berücksichtigen.

**Working Tree** – Sichtbarer Arbeitsbereich eines Git-Repositorys mit ausgecheckten und lokal veränderten Dateien.

**Workload** – Anwendung oder Aufgabe, die Rechenressourcen verbraucht und von einer Plattform ausgeführt wird.

## X

**X.509** – Standardformat für Public-Key-Zertifikate, das unter anderem Identität, öffentlichen Schlüssel, Aussteller und Gültigkeit beschreibt.

## Y

**YAML** – Menschenlesbares Datenformat, oft für Konfiguration. Einrückung und Datentypen sind relevant; siehe [YAML Guide](../yaml).

## Z

**Zero Downtime Deployment** – Auslieferung ohne geplante Unterbrechung der Nutzerfunktion. Erfordert Kapazität, kompatible Änderungen, Readiness und kontrollierte Traffic-Umschaltung.

**Zero Trust** – Sicherheitsmodell, das keinem Netzstandort pauschal vertraut und Zugriff fortlaufend anhand von Identität, Kontext und minimalen Rechten bewertet.

::: tip Begriff fehlt?
Nutze den Link „Diese Seite auf GitHub bearbeiten“ und ergänze Definition, Abgrenzung und einen passenden Praxislink. Gute Lexikoneinträge sind kurz, eindeutig und frei von Produktwerbung.
:::
