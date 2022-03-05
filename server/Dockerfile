FROM node:14.18.2-stretch-slim

EXPOSE 4000
WORKDIR /usr/app/
COPY . .
RUN npm install

CMD ["npm", "start"]