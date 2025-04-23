FROM node:20-alpine AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE ${PORT}
CMD ["npm", "run", "dev"]