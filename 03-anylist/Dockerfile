# Etapa: deps (instala dependencias)
FROM node:18-alpine3.15 AS deps
RUN corepack enable
WORKDIR /app

# Copiamos manifest + lockfile de pnpm
COPY package.json pnpm-lock.yaml ./

# Instala TODAS las dependencias según el lockfile
RUN pnpm install --frozen-lockfile

# Etapa: build
FROM node:18-alpine3.15 AS builder
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# En Nest normalmente el script es "build": "nest build"
RUN pnpm build

# Etapa: runner (producción)
FROM node:18-alpine3.15 AS runner
RUN corepack enable
WORKDIR /usr/src/app

# Solo necesitamos package.json y lockfile para tener scripts y metadatos
COPY package.json pnpm-lock.yaml ./

# Opcional: si quieres deps solo de producción:
RUN pnpm install --prod --frozen-lockfile

# Copiamos el build ya compilado
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]
