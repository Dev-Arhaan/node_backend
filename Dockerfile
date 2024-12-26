# use an official nodejs as a parent image

FROM node:23-alpine

# set working directory in container

WORKDIR /app

# Copy package.json and lock.json

COPY package*.json /app/

# Install all necessary npm packages

RUN npm i

# Copy rest of the code

COPY . /app/

# Expose the port the app runs on

EXPOSE 5000

# Define command to run application

CMD ["node", "./src/server.js"]

