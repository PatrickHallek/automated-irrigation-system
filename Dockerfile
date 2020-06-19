FROM node:10
COPY . /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build
EXPOSE 4200
