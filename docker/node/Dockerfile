FROM node:20.17-alpine3.20 AS build
WORKDIR /app
COPY ../app .
RUN npm i
RUN npm run build

FROM scratch
COPY --from=build /app/build /

