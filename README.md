Coink Web Client
============

Coink.io Web Client

Deps: leiningen clojure util

To start the server:

cd into /coink
run `lein ring server-headless`
Point to localhost:3000 in your browser of choice.

Docker Install
--------------

```bash
sudo docker build -t coink/web-client .
sudo docker run -d -v $PWD:/data coink/web-client
```
