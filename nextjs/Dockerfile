FROM node:10

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

# Building app
RUN npm run build

# Running the app
CMD [ "npm", "start" ]