FROM node:10
COPY . /frontend
WORKDIR /frontend
RUN apt-get update && apt-get install avahi-utils -y
RUN npm install
RUN npm run build
EXPOSE 4200
