
FROM node:22.3-alpine3.19 as build

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY . .

ARG VITE_BACKEND_URL=http://www.example.com
RUN sh -c "echo \"VITE_BACKEND_URL=${VITE_BACKEND_URL}\" > .env.production"
RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
