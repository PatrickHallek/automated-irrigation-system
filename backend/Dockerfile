FROM node
COPY . /src
WORKDIR /src
RUN apt-get install libavahi-compat-libdnssd-dev
RUN npm install
RUN npm rebuild
EXPOSE 3000
