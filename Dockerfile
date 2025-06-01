###############################################################################
#             Stage 1: Build (TypeScript kompilieren)                        #
###############################################################################
FROM node:16-alpine AS builder
# Setze Arbeitsverzeichnis
WORKDIR /usr/src/app

# 1.1 Kopiere package.json + package-lock.json ins Build-Image
COPY package*.json ./

# 1.2 Installiere Dev‐ und Prod‐Dependencies, damit tsc verfügbar ist
RUN npm install

# 1.3 Kopiere den gesamten src-Ordner (inkl. src/tsconfig.json und *.ts Dateien)
COPY src ./src

# 1.4 Führe den TypeScript‐Build aus.
#     Hier nimmt „npm run build“ automatisch die src/tsconfig.json als Konfigurationsdatei.
#     Achte darauf, dass in src/tsconfig.json outDir: "../dist" steht,
#     damit die kompilierten Dateien in /usr/src/app/dist landen.
RUN npm run build

###############################################################################
#            Stage 2: Production (nur Runtime-Dateien)                       #
###############################################################################
FROM node:16-alpine AS production
# Neues Arbeitsverzeichnis (Production-Stage)
WORKDIR /usr/src/app

# 2.1 Kopiere erneut package.json + package-lock.json (um production-only zu installieren)
COPY package*.json ./

# 2.2 Installiere nur die production-Dependencies
RUN npm install --production

# 2.3 Kopiere den fertig compilerten dist-Ordner aus der Build-Stage hierher
#     (das „--from=builder“ bezieht sich exakt auf die erste Stage mit alias „builder“)
COPY --from=builder /usr/src/app/dist ./dist

# (Optional) Falls Du z. B. statische Assets oder weitere Ordner brauchst,
#        kannst Du sie hier ebenfalls aus der Build-Stage holen:
# COPY --from=builder /usr/src/app/public ./public

# 2.4 Exponiere Port 3000, falls Dein Bot im Webhook‐Modus läuft.
#     Bei reinen Polling‐Bots ist EXPOSE nicht zwingend nötig, schadet aber auch nicht.
EXPOSE 3000
EXPOSE 5000

# 2.5 Als letztes: Starte den Bot über node dist/app.js
#     (Dein TypeScript‐Entrypoint war src/app.ts → kompiliert nach dist/app.js)
CMD ["node", "dist/app.js"]
