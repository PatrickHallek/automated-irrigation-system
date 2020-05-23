FROM mhart/alpine-node:14
COPY . /src
WORKDIR /src
RUN apk add --no-cache make gcc g++ python linux-headers udev
RUN npm install
RUN npm rebuild serialport --build-from-source
EXPOSE 3000
