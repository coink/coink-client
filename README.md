# Coink Web Client

Make it rain with Coink.io's useful and tasty web client.

## Building

There are two ways currently of running the webclient.

### Traditional Method

[Leiningen][1] 2.3.4  - Clojure without exploding

[1]: https://github.com/technomancy/leiningen

```bash
run `lein ring server-headless`
Point to localhost:3000 in your browser of choice.
```

### Docker Method

```bash
sudo docker build -t coink/web-client .
sudo docker run -d -v $PWD:/data coink/web-client
```
