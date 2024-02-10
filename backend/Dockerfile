FROM node:10
COPY . /src
WORKDIR /src
RUN sed -i -e 's/deb.debian.org/archive.debian.org/g' \
           -e 's|security.debian.org|archive.debian.org/|g' \
           -e '/stretch-updates/d' /etc/apt/sources.list
RUN apt-get clean && apt-get update
RUN apt-get install -y libavahi-compat-libdnssd-dev
RUN npm install
RUN npm rebuild
EXPOSE 3000
