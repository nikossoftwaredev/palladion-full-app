FROM node:14.18.2-stretch-slim

RUN mkdir /var/react && chown node:node /var/react
WORKDIR /var/react
WORKDIR /usr/app/
COPY . .
RUN npm install
RUN npm run build


FROM nginx:1.18.0
EXPOSE 7777
EXPOSE 80
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=reactBuild /var/react/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
