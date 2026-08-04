---
title: Container-Grundlagen
description: Images, Container, Volumes, Netzwerke und produktionsnahe Dockerfiles verstehen.
---

# Container-Grundlagen – reproduzierbar statt „läuft bei mir“

Ein Container ist ein isolierter Prozess mit einem definierten Dateisystem, Netzwerkzugang und Ressourcenrahmen. Er ist keine kleine virtuelle Maschine: Der Kernel wird mit dem Host geteilt, während Namespaces und Control Groups Prozesse voneinander trennen.

<div class="tag-row"><span class="tag">Docker</span><span class="tag">Container</span><span class="tag">Images</span><span class="tag">Compose</span></div>

## Image, Container und Registry

| Begriff | Bedeutung |
|---|---|
| Image | unveränderliche Vorlage aus mehreren Layern |
| Container | laufende Instanz eines Images mit beschreibbarer Schicht |
| Registry | Speicher und Verteilung für versionierte Images |
| Volume | persistente Daten außerhalb des Container-Lebenszyklus |
| Network | kontrollierte Kommunikation zwischen Containern und Außenwelt |

Der Build erzeugt ein Image. Der Start erzeugt daraus einen Container. Wird der Container gelöscht, verschwinden Änderungen in seiner beschreibbaren Schicht. Zustandsdaten gehören daher in ein Volume oder einen externen Dienst.

## Ein solides Dockerfile

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Warum mehrere Stages?

- Build-Werkzeuge landen nicht automatisch im Runtime-Image.
- Die Angriffsfläche und Image-Größe sinken.
- Abhängigkeits-Layer können separat gecacht werden.
- Build und Laufzeit werden klar getrennt.

::: tip Reihenfolge beeinflusst den Cache
Dateien, die sich selten ändern, zuerst kopieren. `package*.json` vor dem Quellcode erlaubt es, den teuren Installations-Layer wiederzuverwenden.
:::

## `.dockerignore` nicht vergessen

```text
.git
.github
node_modules
dist
.env*
*.log
Dockerfile*
compose*.yml
```

Der Build-Kontext wird an die Build Engine übertragen. Ohne Ignore-Datei landen unnötige oder sensible Dateien im Kontext und können versehentlich Teil eines Layers werden.

## Lokal bauen und starten

```bash
docker build --tag dev-garage:local .
docker run --rm \
  --name dev-garage \
  --publish 3000:3000 \
  --read-only \
  --tmpfs /tmp \
  dev-garage:local
```

Nützliche Diagnosebefehle:

```bash
docker ps --all
docker logs --follow dev-garage
docker inspect dev-garage
docker stats dev-garage
docker exec -it dev-garage sh
```

`docker exec` ist ein Diagnosewerkzeug, kein normaler Betriebsweg. Dauerhafte Änderungen gehören in Dockerfile, Konfiguration oder Deployment-Definition.

## Konfiguration und Secrets

Ein Image sollte zwischen Umgebungen identisch bleiben. Unterschiede kommen zur Laufzeit:

- harmlose Konfiguration über Umgebungsvariablen oder Dateien,
- Secrets über eine Secret-Plattform oder kurzlebige Identität,
- persistente Daten über Volumes oder externe Dienste,
- Feature Flags über ein dafür vorgesehenes System.

Secrets gehören nicht in `ARG`, `ENV`, Image-Layer oder Repository. Auch ein später gelöschter Wert kann in einem älteren Layer erhalten bleiben.

## Compose für lokale Stacks

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:local@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local
      POSTGRES_DB: app
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  db-data:
```

`depends_on` mit Healthcheck ist besser als eine reine Startreihenfolge. Ein gestarteter Prozess ist noch nicht zwingend bereit, Anfragen anzunehmen.

## Security-Baseline

- nicht als Root laufen,
- möglichst read-only Dateisystem,
- Linux Capabilities reduzieren,
- keine Docker-Socket-Mounts,
- Ressourcen begrenzen,
- Basis-Images klein und gepflegt halten,
- Images per Digest referenzieren, wenn Reproduzierbarkeit zählt,
- Images und Abhängigkeiten scannen,
- Signatur und Provenance beim Deployment prüfen.

## Healthchecks und Shutdown

Eine Anwendung braucht getrennte Signale:

- **Liveness:** Prozess steckt fest und muss neu gestartet werden.
- **Readiness:** Instanz kann aktuell Traffic verarbeiten.
- **Startup:** lange Initialisierung ist noch nicht abgeschlossen.

Außerdem sollte PID 1 Signale korrekt behandeln. Die Anwendung muss bei `SIGTERM` neue Arbeit stoppen, laufende Arbeit abschließen und innerhalb der Grace Period beenden.

## Typische Fehler

1. `latest` als einzige Version verwenden.
2. Daten im Container-Dateisystem erwarten.
3. Entwicklungsserver in Produktion starten.
4. komplettes Repository vor der Dependency-Installation kopieren.
5. Root-Benutzer und unnötige Werkzeuge im Runtime-Image behalten.
6. Logs in Dateien statt auf stdout/stderr schreiben.
7. Healthcheck mit „Prozess läuft“ verwechseln.

## Produktions-Checkliste

- [ ] Image ist eindeutig versioniert und unveränderlich.
- [ ] Lockfiles und Basis-Image sind kontrolliert.
- [ ] Runtime läuft ohne Root.
- [ ] Secrets werden erst zur Laufzeit bereitgestellt.
- [ ] Readiness und geordneter Shutdown funktionieren.
- [ ] CPU, RAM und temporärer Speicher sind begrenzt.
- [ ] Logs gehen strukturiert an stdout/stderr.
- [ ] Backup und Restore persistenter Daten wurden getestet.

## Weiterführende Quellen

- [Docker – Get started](https://docs.docker.com/get-started/)
- [Was ist ein Container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [Dockerfile schreiben](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)
- [Docker Compose Quickstart](https://docs.docker.com/compose/gettingstarted/)

Als Nächstes: [GitOps in der Praxis](./gitops-praxis) oder [Software Supply Chain](../security/software-supply-chain).
