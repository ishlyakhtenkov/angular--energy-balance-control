FROM nginx:1.21.1-alpine
COPY ./dist/angular-energy-balance-control/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf