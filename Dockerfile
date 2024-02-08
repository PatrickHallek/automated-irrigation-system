FROM node
COPY . /frontend
WORKDIR /frontend
RUN npm install --loglevel verbose
RUN npm run build --loglevel verbose
EXPOSE 5000
