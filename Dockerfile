FROM ubuntu:14.04
MAINTAINER Roy van Kaathoven

# Install Node.js and NPM
RUN apt-get update
RUN sudo apt-get install -y nodejs npm

# Copy NPM files
COPY ./package.json package.json

RUN npm install

# Copy the files
COPY ./src /src
COPY ./config /config
COPY ./Gruntfile.js Gruntfile.js

# Expose required ports
EXPOSE 3000
EXPOSE 5000

CMD ["nodejs", "src/app.js"]