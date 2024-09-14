const Fastify = require('fastify');
const FastifyProxy = require('@fastify/http-proxy');
const server = Fastify();
const path = require('node:path');

// Static file serving
server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

// Proxy configuration
const proxies = {
  'nano.minoa.cat': 'https://nano-proxy.github.io/',
  'aluu.minoa.cat': 'https://aluu.xyz/',
  'default.minoa.cat': 'https://shuttleproxy.com/' // Default proxy
};

// Proxy handler function
const setupProxy = (host) => {
  const upstream = proxies[host] || proxies['default.minoa.cat'];
  server.register(FastifyProxy, {
    upstream,
    prefix: '/',
    http2: false
  });
};

// Register proxy for each host
server.addHook('onRequest', (request, reply, done) => {
  const host = request.headers.host;
  setupProxy(host);
  done();
});

// Serve list.html
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
