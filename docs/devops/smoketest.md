# 💨 Was ist ein Smoke Test?

Ein **Smoke Test** ist ein **schneller, oberflächlicher Test**, der prüft, ob ein System oder eine neue Software-Build **grundlegend funktioniert**, bevor man tiefergehende Tests oder Deployments durchführt.  

Man kann sich das vorstellen wie:  
> „Zuerst schauen wir, ob das System überhaupt *atmet*, bevor wir anfangen, es intensiv zu untersuchen.“

---

## 🧩 Ursprung des Begriffs
Der Begriff kommt ursprünglich aus der **Hardware-Welt**:
> Wenn du ein neues Gerät einschaltest und es **kein Rauch aufsteigt**, ist das schon mal ein gutes Zeichen – also „Smoke Test passed“. 😄  

In der Software wurde der Begriff übernommen, um zu prüfen, ob eine neue Version „überhaupt lauffähig“ ist.

---

## ⚙️ Typische Merkmale eines Smoke Tests

| Merkmal | Beschreibung |
|----------|---------------|
| 🎯 Ziel | Sicherstellen, dass die wichtigsten Funktionen nach einem Build oder Deployment funktionieren |
| ⏱️ Dauer | Sehr kurz – oft nur wenige Minuten |
| 🧪 Tiefe | Oberflächlich – keine Detailvalidierung oder Edge-Cases |
| 🔁 Häufigkeit | Nach jedem neuen Build oder Deployment |
| 🚦 Ergebnis | „Pass“ (weiter testen) oder „Fail“ (sofort stoppen) |

---

## 💻 Beispiele in der Praxis (DevOps-Kontext)

### 🧰 1. **Nach einem Deployment**
Du hast eine neue Version in der Staging- oder Test-Umgebung ausgerollt.  
Ein automatisierter Smoke Test prüft:
- Läuft der Webserver (HTTP 200)?
- Funktioniert das Login?
- Sind die wichtigsten Services erreichbar (z. B. API, DB, Cache)?
- Gibt es kritische Errors in den Logs?

Wenn **alles grün** ist → man kann weiter mit Integrationstests, Performance-Tests oder UAT fortfahren.  
Wenn **nicht** → Rollback oder Fehleranalyse.

---

### ⚙️ 2. **In einer CI/CD-Pipeline**
Typische Struktur:
```yaml
stages:
  - build
  - deploy_staging
  - smoke_test
  - integration_tests
  - deploy_production
```
Im Schritt **`smoke_test`** prüfst du z. B.:

`curl -f https://staging.example.com/health || exit 1`

oder führst ein kleines Testskript aus, das die wichtigsten Endpoints aufruft.

---

### ☁️ 3. **Bei Infrastructure-as-Code (IaC) Deployments**

Nach dem Provisionieren einer neuen Umgebung mit Terraform oder Ansible kann ein Smoke Test prüfen:

- Sind alle EC2-Instanzen / Pods erreichbar?
    
- Ist der Load Balancer aktiv?
    
- Antworten die Health-Checks korrekt?
    

---

## 🚨 Warum Smoke Tests wichtig sind

|Grund|Nutzen|
|---|---|
|Frühzeitige Fehlererkennung|Probleme werden sofort erkannt, bevor sie sich weiter ausbreiten|
|Zeitersparnis|Tiefergehende Tests werden nur bei stabilen Builds ausgeführt|
|Vertrauen in Deployments|Teams erkennen schnell, ob ein Build grundsätzlich „lebensfähig“ ist|
|Automatisierbarkeit|Perfekt für CI/CD – schnell, deterministisch, automatisierbar|

---

## 🧠 Kurz gesagt:

> Ein **Smoke Test** ist wie ein „Gesundheitscheck“ direkt nach dem Deployment.  
> Er prüft: _„Lebt das System?“_ – nicht _„Läuft alles perfekt?“_