FROM node
COPY . /src
WORKDIR /src
RUN apt-get update && apt-get -f install libavahi-compat-libdnssd-dev
RUN npm install
RUN npm rebuild
EXPOSE 3000
