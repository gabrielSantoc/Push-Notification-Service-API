FROM node:20

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE $PORT

CMD ["node", "index.js"] 