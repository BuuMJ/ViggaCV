FROM ghcr.io/puppeteer/puppeteer:20.1.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app 

COPY package*.json ./
RUN npm ci
COPY . .

# Add the following line to set the permissions
RUN chmod -R 777 /usr/src/app 

# Add debug information
RUN ls -al uploads/Cv
RUN ls -al /usr/src/app
RUN echo "LS: $(ls -al)" 
RUN echo "Node Version: $(node -v)"
RUN echo "NPM Version: $(npm -v)"


CMD ["npm", "start"]
