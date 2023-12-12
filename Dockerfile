FROM ghcr.io/puppeteer/puppeteer:20.1.2
# FROM node:14

# RUN apt-get update && apt-get install -y poppler-utils

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npm", "start"]