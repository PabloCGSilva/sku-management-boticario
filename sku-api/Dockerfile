FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npx prisma generate
RUN npm prune --omit=dev

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && npm start"]