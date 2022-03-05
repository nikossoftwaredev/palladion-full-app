FROM node:14.18.2-stretch-slim as reactBuild

RUN mkdir -p /usr/app/ && chown node:node /usr/app/
WORKDIR /usr/app/
COPY . .
RUN npm install
RUN npm run build


FROM nginx:1.18.0
EXPOSE 80
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=reactBuild /usr/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
