# ----- Estágio 1: Dependências -----
# (Este estágio instala todas as dependências)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ----- Estágio 2: Builder -----
# (Este estágio compila o código TS para JS)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ----- Estágio 3: Produção Final -----
# (Este é o resultado final e otimizado)
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main.js" ]

# ----- Estágio 4: Desenvolvimento -----
# (Este estágio é usado apenas pelo Docker Compose)
FROM deps AS development
WORKDIR /app
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]