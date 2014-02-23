FROM        base

# Install Java
RUN         apt-get install software-properties-common -y
RUN         apt-add-repository ppa:webupd8team/java -y
RUN         apt-get update
RUN         echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections
RUN         apt-get install oracle-java7-installer -y

# Install Leiningen
RUN         apt-get install curl -y
RUN         curl https://raw.github.com/technomancy/leiningen/stable/bin/lein > /usr/local/bin/lein
RUN         chmod a+x /usr/local/bin/lein
RUN         LEIN_ROOT=1 /usr/local/bin/lein

# Install key
RUN	    mkdir -p /root/.ssh
ADD         id_rsa /root/.ssh/id_rsa
RUN         chown -R root:root /root/.ssh

# Pull source
RUN         apt-get install -y git
WORKDIR	    /data
RUN         ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN         git clone git@github.com:coink/coink-client.git

# Run server
WORKDIR	    /data/coink-client
EXPOSE      3000
CMD         LEIN_ROOT=1 lein ring server-headless
