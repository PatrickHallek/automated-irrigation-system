FROM node:10
COPY . /src
WORKDIR /src
RUN npm install
EXPOSE 4200
