FROM nginx:alpine

COPY APPLICATION/ /usr/share/nginx/html/

EXPOSE 80
