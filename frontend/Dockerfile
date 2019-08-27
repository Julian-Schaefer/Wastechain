FROM node:8
WORKDIR /app
COPY package.json /app/package.json
RUN yarn
COPY . /app
CMD ["yarn", "start"]