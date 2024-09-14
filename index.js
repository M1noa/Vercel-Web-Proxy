const Fastify = require('fastify');
const FastifyProxy = require('@fastify/http-proxy');
const server = Fastify();
const path = require('node:path');

// Static file serving
server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

// Register all proxies beforehand
const proxyRoutes = [
  { domain: 'nano', upstream: 'https://nano-proxy.github.io/' },
  { domain: 'aluu', upstream: 'https://aluu.xyz/' },
  { domain: 'shuttle', upstream: 'https://shuttleproxy.com/' }
];

// Proxy handler based on domain name
server.get('/*', (req, reply) => {
  const host = req.hostname || req.headers.host;

  // Find matching upstream based on the host
  const proxy = proxyRoutes.find(route => host.includes(route.domain));

  if (proxy) {
    // If a matching proxy is found, forward the request
    reply.callNotFound(); // Let the proxy handle it
  } else {
    // Redirect to /list if no match is found
    reply.redirect('/list');
  }
});

// Register proxies globally for each domain prefix
proxyRoutes.forEach(route => {
  server.register(FastifyProxy, {
    upstream: route.upstream,
    prefix: '/',
    http2: false
  });
});

// Serve list.html
server.get('/list', (req, reply) => {
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
