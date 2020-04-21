FROM node:13.2-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Internal port
EXPOSE 9428

# For the user to be able to update config files without re-building image
# VOLUME ["/usr/src/app/config"]

CMD [ "/bin/sh", "-c", "npm start" ]
