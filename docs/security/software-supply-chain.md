---
title: Software Supply Chain
description: Abhängigkeiten, Builds, SBOM, Provenance und Artefakte entlang der Lieferkette absichern.
---

# Software Supply Chain – Vertrauen muss überprüfbar sein

Software besteht aus eigenem Code, Open-Source-Abhängigkeiten, Build-Tools, Basis-Images, CI-Runnern und veröffentlichten Artefakten. Ein Scan am Ende sieht nur einen Teil dieser Lieferkette.

<div class="tag-row"><span class="tag">SLSA</span><span class="tag">SBOM</span><span class="tag">Provenance</span><span class="tag">Dependencies</span></div>

## Die Kette modellieren

<div class="flow-strip">
  <span class="flow-step">Source</span><span class="flow-arrow">→</span>
  <span class="flow-step">Dependencies</span><span class="flow-arrow">→</span>
  <span class="flow-step">Build</span><span class="flow-arrow">→</span>
  <span class="flow-step">Artifact</span><span class="flow-arrow">→</span>
  <span class="flow-step">Registry</span><span class="flow-arrow">→</span>
  <span class="flow-step">Deployment</span>
</div>

Jeder Übergang braucht eine Antwort auf drei Fragen:

1. **Identität:** Wer oder was hat diese Aktion ausgeführt?
2. **Integrität:** Wurde der Inhalt seitdem verändert?
3. **Herkunft:** Aus welchen Quellen und Eingaben entstand er?

## Abhängigkeiten kontrollieren

Ein pragmatischer Prozess:

- direkte und transitive Abhängigkeiten inventarisieren,
- Lockfiles verpflichtend versionieren,
- Updates klein und regelmäßig halten,
- Sicherheitswarnungen priorisieren,
- unmaintained Pakete und unnötige Abhängigkeiten entfernen,
- Installationsskripte und neue Maintainer besonders prüfen,
- interne Mirrors oder Proxies für kritische Ökosysteme erwägen.

Eine alte Abhängigkeit ist nicht automatisch unsicher, und eine neue nicht automatisch sicher. Entscheidend sind bekannte Schwachstellen, Wartungszustand, Herkunft und erreichbarer Codepfad.

## Versionen und Digests

Bewegliche Tags sind bequem, aber nicht unveränderlich:

```text
image: vendor/app:latest           # unklar
image: vendor/app:1.4.2            # besser, Tag kann theoretisch wandern
image: vendor/app@sha256:abc...    # Inhalt eindeutig
```

Für reproduzierbare Builds sollten Compiler, Package Manager, Basis-Images und externe Actions kontrolliert versioniert werden. Automatisierte Update-Werkzeuge verhindern, dass Pins zu dauerhaftem Stillstand führen.

## SBOM: Stückliste der Software

Eine Software Bill of Materials listet Komponenten, Versionen und Beziehungen eines Artefakts. Sie hilft bei Fragen wie:

- Enthält eines unserer Produkte Paket X?
- Welche Version wurde ausgeliefert?
- Welche Artefakte sind von einer neuen Schwachstelle betroffen?
- Welche Lizenz- oder Herkunftsinformationen fehlen?

Eine SBOM ist ein Inventar, kein Sicherheitszertifikat. Sie muss zum konkreten Artefakt gehören, aktuell sein und maschinell ausgewertet werden.

## Provenance: Wie wurde gebaut?

Build Provenance dokumentiert unter anderem:

- Quell-Repository und Commit,
- Build-Plattform,
- Build-Prozess,
- zentrale Eingaben,
- Identität des Builders,
- Bezug zum erzeugten Artefakt.

Signierte Provenance erlaubt Konsumenten zu prüfen, ob ein Artefakt auf einer erwarteten Plattform aus einem erlaubten Repository gebaut wurde.

## SLSA als Reifegradmodell

SLSA beschreibt schrittweise stärkere Garantien für die Software-Lieferkette. Im Build Track der aktuellen Spezifikation reichen die Stufen von keinen Garantien bis zu gehärteten Build-Plattformen.

Pragmatische Etappen:

1. **Inventar:** Build ist reproduzierbar beschrieben, Artefakte sind eindeutig.
2. **Provenance:** Herkunft wird für jedes Release erzeugt.
3. **Hosted Build:** Build läuft auf kontrollierter Plattform, Provenance ist an sie gebunden.
4. **Hardened Build:** Plattform und Prozess schützen stärker gegen Manipulation während des Builds.

SLSA ist kein einzelnes Tool. Es liefert Vokabular und überprüfbare Ziele.

## Build-Umgebung härten

- ephemere Runner bevorzugen,
- Build und Deployment trennen,
- Netzwerkzugriff begrenzen,
- minimale Token-Rechte,
- keine Produktions-Secrets im Build,
- Abhängigkeiten aus kontrollierten Quellen,
- Artefakte nach dem Build nicht verändern,
- Logs, SBOM und Provenance gemeinsam aufbewahren.

Self-hosted Runner benötigen besondere Isolation. Ein Pull Request kann Code ausführen; ein langlebiger Runner kann Rückstände, Zugangsdaten oder Netzwerkzugang an den nächsten Job weitergeben.

## Vor dem Deployment verifizieren

Ein Deployment sollte nicht nur einen Tag akzeptieren, sondern Regeln prüfen:

- Digest ist freigegeben.
- Signatur stammt von erwarteter Identität.
- Provenance verweist auf erlaubtes Repository und Build-System.
- Security- und Policy-Checks sind erfolgreich.
- Artefakt hat die richtige Umgebungspromotion durchlaufen.

Diese Verifikation gehört möglichst an die Zielumgebung oder deren Admission-Grenze, nicht nur in denselben Build-Job, der das Artefakt erzeugt hat.

## Vulnerability Management

Eine Meldung wird nach mehr als CVSS bewertet:

- ist die Komponente im ausgelieferten Artefakt?
- ist der verwundbare Codepfad erreichbar?
- ist die Funktion exponiert?
- existieren Exploit oder aktive Ausnutzung?
- welche Kompensation reduziert das Risiko?
- welche Update- und Rollback-Kosten entstehen?

Trotz Priorisierung braucht jede akzeptierte Ausnahme Owner, Ablaufdatum und erneute Prüfung.

## Minimaler Einführungsplan

### Woche 1: Transparenz

- Lockfiles verpflichtend,
- automatisierte Dependency-Updates,
- Artefakte per Digest identifizieren,
- SBOM für Builds erzeugen.

### Woche 2: Build-Vertrauen

- minimale Workflow-Rechte,
- ephemere Runner,
- Build und Deploy trennen,
- Provenance erzeugen und aufbewahren.

### Woche 3: Verifikation

- Signaturen prüfen,
- Herkunfts-Policy definieren,
- Deployment nur für freigegebene Digests,
- Incident-Prozess für kompromittierte Komponenten proben.

## Review-Checkliste

- [ ] Sind direkte und transitive Komponenten inventarisiert?
- [ ] Werden Lockfiles und Digests genutzt?
- [ ] Ist der Build von einem sauberen Runner reproduzierbar?
- [ ] Sind externe Build-Schritte kontrolliert versioniert?
- [ ] Werden SBOM und Provenance pro Artefakt erzeugt?
- [ ] Prüft das Deployment Identität und Herkunft?
- [ ] Gibt es eine Frist für Security-Ausnahmen?
- [ ] Kann ein kompromittiertes Artefakt schnell gesperrt werden?

## Weiterführende Quellen

- [SLSA](https://slsa.dev/)
- [SLSA Specification 1.2](https://slsa.dev/spec/v1.2/)
- [OWASP CI/CD Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)

Passend dazu: [Container-Grundlagen](../devops/container-grundlagen) und [CI/CD Security](./cicd-security).
