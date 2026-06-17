FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Lance Vite en mode développement et accepte les connexions du PC hôte
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]