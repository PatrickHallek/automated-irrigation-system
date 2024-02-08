FROM node
COPY . /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build
EXPOSE 5000
