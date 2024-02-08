FROM node
COPY . /frontend
WORKDIR /frontend
RUN npm install --legacy-bundling
RUN npm run build
EXPOSE 5000
