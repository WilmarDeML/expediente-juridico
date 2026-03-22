# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx build frontend --prod
RUN npx nx build backend --prod

# Stage 2: Runtime Backend
FROM node:20-alpine AS backend
WORKDIR /app
COPY --from=builder /app/dist/apps/backend .
RUN npm install --production
CMD ["node", "main.js"]

# Stage 3: Runtime Frontend (Nginx ligero)
FROM nginx:alpine AS frontend
COPY --from=builder /app/dist/apps/frontend /usr/share/nginx/html