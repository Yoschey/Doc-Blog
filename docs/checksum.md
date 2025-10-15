# Checksummen – Funktionsweise und Anwendung

## Was ist eine Checksumme?
Eine Checksumme ist ein kurzer Zahlen- oder Zeichenwert, der aus dem Inhalt einer Datei berechnet wird.  
Sie dient dazu, Veränderungen oder Fehler im Inhalt zu erkennen, z. B. durch Übertragung, Speicherung oder Manipulation.

Kurz gesagt: Eine Checksumme ist wie ein digitaler Fingerabdruck einer Datei.

---

## Wie Checksummen funktionieren

1. Eine Datei (oder ein Datenstrom) wird an eine Hashfunktion übergeben.
2. Diese berechnet einen Hashwert (die Checksumme).
3. Wenn dieselbe Datei später erneut gehasht wird,
   - erhält man denselben Wert, wenn sie unverändert ist,
   - oder einen komplett anderen Wert, wenn sich auch nur ein Bit unterscheidet.

### Beispiel

Dateiinhalt:  
```
Hallo Welt
```

SHA256-Hash:  
```
872e4bdc3f... (64 hex-Zeichen)
```

Wenn nur ein Zeichen geändert wird („Hallo welt“) → völlig anderer Hash:  
```
2b0a28e9f1...
```

Schon kleinste Änderungen führen zu komplett anderen Hashwerten.

---

## Gängige Hashfunktionen und ihre Eigenschaften

| Typ | Bitlänge | Sicherheit | Verwendung |
|------|-----------|------------|-------------|
| CRC32 | 32 Bit | gering | Schnelle Übertragungsprüfung (ZIP-Dateien, Netzwerke) |
| MD5 | 128 Bit | unsicher | Nur noch für Plausibilitätsprüfungen |
| SHA1 | 160 Bit | unsicher | Wird abgelöst |
| SHA256 | 256 Bit | sicher | Standard für Datei- und Paketintegrität |
| SHA512 | 512 Bit | sehr sicher | Große Systeme oder Signaturen |

Empfehlung: Verwende SHA256 für Build-, Datei- und Paketprüfungen.

---

## Eigenschaften von Hashfunktionen

| Eigenschaft | Bedeutung |
|--------------|------------|
| Deterministisch | Gleiche Eingabe → gleicher Hash |
| Avalanche-Effekt | Eine Bit-Änderung → komplett anderer Hash |
| Einwegfunktion | Hash kann nicht zurückgerechnet werden |
| Kollisionsresistenz | Unterschiedliche Daten ergeben praktisch nie denselben Hash |

---

## Erzeugung von Checksummen

### PowerShell
```powershell
Get-FileHash .\MeinPaket.zip -Algorithm SHA256
```
Ausgabe:
```
Algorithm : SHA256
Hash      : D7A3A55E6B68...C921
Path      : C:\Builds\MeinPaket.zip
```

### Linux / macOS
```bash
sha256sum MeinPaket.zip
```
Ausgabe:
```
d7a3a55e6b68...c921  MeinPaket.zip
```

### Python
```python
import hashlib

with open("MeinPaket.zip", "rb") as f:
    file_hash = hashlib.sha256(f.read()).hexdigest()
print(file_hash)
```

---

## Anwendung in DevOps- und Build-Prozessen

### 1. Beim Build (Erstellung)
- Pipeline generiert `checksums.sha256` für alle Dateien:
  ```
  d7a3a55e6b68...c921  bin/app.exe
  44b7e61a213...b119  docs/manual.pdf
  ```

### 2. Beim Deployment oder Export
- Diese Datei wird zusammen mit dem Lieferpaket ausgeliefert.

### 3. Beim Check (Validierung)
- Der Validator liest `checksums.sha256`.
- Berechnet die Hashes der Dateien erneut.
- Vergleicht mit den gespeicherten Werten.

Ergebnis:
- Identische Hashes → Paket ist unverändert.
- Unterschiedliche Hashes → Datei wurde verändert oder beschädigt.

---

## Beispiel für Hashprüfung

```bash
sha256sum -c checksums.sha256
```
Ergebnis:
```
bin/app.exe: OK
docs/manual.pdf: OK
config/settings.json: FAILED
```

---

## Unterschied zwischen Checksummen und Signaturen

| Konzept | Beschreibung | Ziel |
|----------|---------------|------|
| Checksumme / Hash | Fingerabdruck einer Datei | Integrität |
| Digitale Signatur | Hash + private Schlüsselverschlüsselung | Integrität und Authentizität |

Eine Checksumme stellt sicher, dass eine Datei nicht verändert wurde.  
Eine digitale Signatur stellt zusätzlich sicher, dass sie von einer vertrauenswürdigen Quelle stammt.

---

## Zusammenfassung

| Thema | Erklärung |
|--------|------------|
| Was | Mathematischer Fingerabdruck einer Datei |
| Wozu | Prüfen, ob Datei verändert oder beschädigt wurde |
| Wie | Mit Hash-Funktion (z. B. SHA256) |
| Wann | Beim Erstellen, Übertragen, Installieren |
| Wo | Build-Pipelines, Deployments, Artefaktvalidierung |
| Vorteile | Schnell, sicher, plattformunabhängig |
| Grenzen | Erkennt keine gewollten Manipulationen ohne Signatur |

---

## Praxis-Tipp

Für Projekte wie einen Lieferpaket Checker:
1. Beim Build SHA256-Checksummen für jede Datei generieren.  
2. Diese in einer Datei `checksums.sha256` mitliefern.  
3. Der Checker:
   - liest die Datei,
   - berechnet alle Hashes neu,
   - und meldet Abweichungen.

So lässt sich die Integrität des gesamten Pakets zuverlässig prüfen.

---

**Autor:** Josh
**Stand:** 2025  
**Lizenz:** Frei verwendbar für technische Dokumentation und Ausbildung
