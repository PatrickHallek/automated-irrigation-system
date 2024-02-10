FROM node:10
COPY . /src
WORKDIR /src
RUN apt-get clean && apt-get update
RUN apt-get install -y libavahi-compat-libdnssd-dev
RUN npm install
RUN npm rebuild
EXPOSE 3000
