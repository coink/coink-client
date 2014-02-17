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

VOLUME      ["/data"]
WORKDIR     /data

# Run server
EXPOSE      3000
CMD cd /data/coink && LEIN_ROOT=1 lein ring server-headless
