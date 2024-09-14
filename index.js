const Fastify = require('fastify');
const FastifyProxy = require('@fastify/http-proxy');
const server = Fastify();
const path = require('node:path');

// Static file serving
server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

// Predefined upstream URLs based on the domain
const proxyRoutes = {
  nano: 'https://nano-proxy.github.io/',
  aluu: 'https://aluu.xyz/',
  shuttle: 'https://shuttleproxy.com/',
};

// Single route handler
server.get('/*', (req, reply) => {
  const host = req.hostname || req.headers.host;

  // Determine which proxy to use based on the domain
  let upstream = null;
  if (host.includes('nano')) {
    upstream = proxyRoutes.nano;
  } else if (host.includes('aluu')) {
    upstream = proxyRoutes.aluu;
  } else if (host.includes('shuttle')) {
    upstream = proxyRoutes.shuttle;
  }

  // If no proxy match, redirect to /list
  if (!upstream) {
    reply.redirect('/list');
  } else {
    // Proxy the request to the appropriate upstream
    server.register(FastifyProxy, {
      upstream,
      prefix: '/', // Route all requests to the upstream
      http2: false
    });
    reply.callNotFound(); // Let Fastify handle the proxy route as a "not found" request
  }
});

// Serve list.html at /list
server.get('/list', (req, reply) => {
  reply.sendFile('list.html');
});

// Start the server
server.listen({ host: "0.0.0.0", port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
