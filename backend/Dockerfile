FROM node
COPY . /src
WORKDIR /src
RUN apt-get clean && apt-get update
RUN apt-get install -y libavahi-compat-libdnssd-dev avahi-daemon avahi-utils
RUN npm install
RUN npm rebuild
EXPOSE 3000
