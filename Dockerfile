# To build:  docker build -t coink/coink-client .
# To run:    docker run -p 8000:3000 coink/coink-client

FROM        base

# Install Nodejs deps
RUN         apt-get update
RUN         apt-get install -y software-properties-common \
            python-software-properties python g++ make

# Install Nodejs and friends
RUN         add-apt-repository -y ppa:chris-lea/node.js
RUN         apt-get update
RUN         apt-get install -y nodejs

# Install npm deps
ADD         ./package.json /data/coink-client/package.json
RUN         cd /data/coink-client && npm install

# Add source
ADD         . /data/coink-client
#RUN         cd /data/coink-client && npm run-script build

# Run server
EXPOSE      3000
WORKDIR	    /data/coink-client
CMD         npm run-script build
