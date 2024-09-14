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

// Register all proxies during server initialization (once)
Object.keys(proxyRoutes).forEach(key => {
  server.register(FastifyProxy, {
    upstream: proxyRoutes[key],
    prefix: `/${key}`, // Use the domain keyword as the prefix
    http2: false
  });
});

// Handler to redirect to the correct proxy or list page
server.get('/*', (req, reply) => {
  const host = req.hostname || req.headers.host;

  if (host.includes('nano')) {
    reply.redirect('/nano');
  } else if (host.includes('aluu')) {
    reply.redirect('/aluu');
  } else if (host.includes('shuttle')) {
    reply.redirect('/shuttle');
  } else {
    // Redirect to /list if no matching proxy is found
    reply.redirect('/list');
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
