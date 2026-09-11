# blow-up-frontend/Dockerfile
FROM node:22-alpine AS build
WORKDIR /srv
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /srv
ENV NODE_ENV=production
COPY --from=build /srv ./
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-p", "3000"]
