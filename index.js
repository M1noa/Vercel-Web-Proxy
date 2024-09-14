const Fastify = require('fastify');
const FastifyProxy = require('@fastify/http-proxy');
const path = require('node:path');
const server = Fastify();

// Static file serving
server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

// Proxy handler
const proxyHandler = (upstream, prefix) => {
  server.register(FastifyProxy, {
    upstream,
    prefix,
    http2: false
  });
};

// Register all proxies
proxyHandler('https://nano-proxy.github.io/', '/nano/');
proxyHandler('https://aluu.xyz/', '/');
proxyHandler('https://shuttleproxy.com/', '/shuttle/');

server.get('/list', function (req, reply) {
  reply.sendFile('list.html');
});

// Start server
server.listen({ host: "0.0.0.0", port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
