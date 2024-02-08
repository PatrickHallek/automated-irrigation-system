FROM node
COPY . /frontend
WORKDIR /frontend
RUN npm install --install-strategy=nested
RUN npm run build
EXPOSE 5000
