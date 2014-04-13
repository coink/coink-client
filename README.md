# Coink Web Client

Breathe insight into your data with Coink.io.

## Building

There are two ways currently of running the webclient.

### Docker Method

```bash
sudo docker build -t coink/web-client .
sudo docker run -d -p 3000 coink/web-client
```

### Boring Method

Install npm, then in the coink root directory run:

```bash
`npm install`
`npm run-script build`
```
Point to localhost:3000 in your browser of choice.

