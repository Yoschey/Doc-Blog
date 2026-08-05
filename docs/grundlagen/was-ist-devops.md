---
title: Was ist DevOps?
description: DevOps als Kultur, Arbeitsweise und technische Feedbackschleife verstehen.
learning:
  level: Einstieg
  duration: 25 Minuten
  goals:
    - DevOps von einem Tool oder einer Stellenbezeichnung unterscheiden.
    - den Weg einer Änderung von der Idee bis zum Betrieb erklären.
    - sinnvolle Kennzahlen und Teamverantwortung einordnen.
  terms: [DevOps, Feedback, Flow, CI/CD, Verantwortung]
  practice: Zeichne den Weg einer kleinen Änderung in eurem Betrieb von der Anforderung bis zur Produktion. Markiere Wartezeiten, manuelle Übergaben und fehlendes Feedback.
  check:
    - question: Warum ist die Einführung eines CI-Servers allein noch kein DevOps?
      answer: Weil Technik ohne gemeinsame Verantwortung, schnelle Rückmeldung und einen verbesserten Arbeitsfluss nur einen einzelnen Prozessschritt automatisiert.
    - question: Was ist der Unterschied zwischen Deployment und Release?
      answer: Deployment bringt eine Version in eine Umgebung; Release macht eine Funktion für Nutzer verfügbar. Beides kann getrennt stattfinden.
    - question: Wozu dienen kleine Änderungen?
      answer: Sie reduzieren Risiko, sind leichter zu prüfen und liefern schneller verwertbares Feedback.
  next: /grundlagen/git-grundlagen
---

# Was ist DevOps?

DevOps verbindet Entwicklung (**Development**) und Betrieb (**Operations**) zu einer gemeinsamen Verantwortung für den gesamten Lebenszyklus einer Software. Das Ziel ist nicht „mehr Deployments um jeden Preis“, sondern Änderungen **sicher, klein, nachvollziehbar und wiederholbar** bis zu den Nutzern zu bringen.

## DevOps ist kein Produkt

Eine Organisation kann GitHub Actions, Docker und Kubernetes einsetzen und trotzdem langsame, riskante Übergaben haben. Umgekehrt kann ein kleines Team ohne große Plattform sehr gut nach DevOps-Prinzipien arbeiten.

DevOps besteht aus drei zusammenwirkenden Bereichen:

| Bereich | Leitfrage | Beispiele |
|---|---|---|
| Kultur | Wer trägt Verantwortung? | gemeinsame Ziele, respektvolle Reviews, Lernen aus Fehlern |
| Arbeitsfluss | Wie bewegt sich eine Änderung? | kleine Arbeitspakete, wenig Wartezeit, klare Prioritäten |
| Technik | Wie entsteht schnelles Feedback? | Versionskontrolle, Tests, CI/CD, Monitoring, IaC |

## Die Feedbackschleife

<div class="flow-strip"><span class="flow-step">Idee</span><span class="flow-arrow">→</span><span class="flow-step">Commit</span><span class="flow-arrow">→</span><span class="flow-step">Build & Test</span><span class="flow-arrow">→</span><span class="flow-step">Deployment</span><span class="flow-arrow">→</span><span class="flow-step">Beobachten</span></div>

Jede Station sollte eine klare Rückmeldung erzeugen:

- **Commit:** Was wurde warum geändert?
- **Build:** Lässt sich aus dem Quellstand ein Artefakt erzeugen?
- **Test:** Erfüllt es die überprüfbaren Erwartungen?
- **Deployment:** Ist die gewünschte Version in der Zielumgebung angekommen?
- **Betrieb:** Verhält sie sich für Nutzer und Systeme wie erwartet?

Je früher ein Fehler sichtbar wird, desto kleiner ist meist der Suchraum. Darum gehören schnelle lokale Prüfungen vor langsamere Integrations- oder End-to-End-Tests.

## Gemeinsame Verantwortung

„You build it, you run it“ bedeutet nicht zwingend, dass jede Entwicklerin nachts Bereitschaft hat. Gemeint ist: Die Folgen einer Änderung werden nicht an eine andere Abteilung wegdelegiert. Entwicklung, Plattform, Security und Betrieb schaffen gemeinsam:

- eindeutige Zuständigkeiten,
- verständliche Runbooks,
- automatisierte Qualitätsgrenzen,
- beobachtbare Systeme,
- sichere Standardwege und
- Zeit, aus Störungen zu lernen.

## Deployment ist nicht Release

Diese Begriffe werden oft verwechselt:

- **Deployment:** Eine Version wird technisch in eine Umgebung gebracht.
- **Release:** Eine Funktion wird für Nutzer freigeschaltet.

Feature Flags können beides trennen. Das Team deployt beispielsweise täglich, aktiviert die neue Funktion aber erst nach einem fachlichen Test für eine kleine Nutzergruppe.

## Kennzahlen mit Kontext

Vier häufig verwendete Perspektiven helfen bei der Diskussion:

- **Änderungsdurchlaufzeit:** Wie lange dauert es vom Commit bis zur produktiven Nutzung?
- **Deployment-Häufigkeit:** Wie oft kann das Team sicher ausliefern?
- **Fehlerquote von Änderungen:** Wie viele Änderungen verursachen Störungen oder Rückrollen?
- **Wiederherstellungszeit:** Wie schnell ist ein Dienst nach einer Störung wiederhergestellt?

Kennzahlen sind Gesprächsgrundlagen, keine Rangliste für einzelne Personen. Werden sie als Leistungsdruck eingesetzt, optimieren Menschen die Zahl statt das System.

## Ein kleines Beispiel

Ein Team ändert die Timeout-Konfiguration eines Webdienstes.

1. Die Änderung entsteht in einem kurzen Branch.
2. Ein Pull Request beschreibt Grund, Risiko und Test.
3. Die Pipeline prüft Syntax und automatisierte Tests.
4. Ein unveränderliches Artefakt wird gebaut.
5. Die Testumgebung erhält genau dieses Artefakt.
6. Ein Smoke Test prüft die wichtigste Nutzerfunktion.
7. Das Deployment erfolgt zunächst auf wenige Instanzen.
8. Fehlerrate und Latenz werden mit dem Ausgangswert verglichen.
9. Bei Verschlechterung wird auf die bekannte Version zurückgerollt.

DevOps steckt hier in der **gesamten lernenden Kette**, nicht in Schritt 3 allein.

## Anti-Patterns

- Ein „DevOps-Team“ wird zum neuen Übergabe-Silo.
- Pipelines bestehen aus undokumentierten manuellen Freigaben.
- Geschwindigkeit wird gemessen, Zuverlässigkeit aber nicht.
- Automatisierung reproduziert einen schlechten Prozess schneller.
- Störungen führen zur Schuldfrage statt zur Verbesserung von System und Schutzmechanismen.
- Produktion unterscheidet sich so stark von Test, dass Ergebnisse nicht übertragbar sind.

## Weiterlernen

- [Git-Grundlagen](./git-grundlagen)
- [CI/CD-Grundlagen](./ci-cd-grundlagen)
- [Observability](../devops/observability)
- [Incident-Checkliste](../examples/incident-checkliste)

**Primärquellen:** [What is DevOps? – Microsoft Learn](https://learn.microsoft.com/en-us/devops/what-is-devops), [Google SRE: DevOps and SRE](https://sre.google/sre-book/introduction/)
