FROM node
COPY . /src
WORKDIR /src
RUN apt-get update && apt-get install -y libavahi-compat-libdnssd-dev
RUN npm install --legacy-bundling
RUN npm rebuild
EXPOSE 3000
