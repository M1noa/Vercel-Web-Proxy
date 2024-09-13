const Fastify = require('fastify');
const FastifyProxy = require('@fastify/http-proxy');
const server = Fastify();
const path = require('node:path');

// Static file serving
server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

// Proxy handler based on domain name
const proxyHandler = (req, reply) => {
  const host = req.hostname || req.headers.host;
  let upstream = '';

  if (host.includes('nano')) {
    upstream = 'https://nano-proxy.github.io/';
  } else if (host.includes('aluu')) {
    upstream = 'https://aluu.xyz/';
  } else {
    // Redirect to /list if neither 'nano' nor 'aluu' is found in the domain
    reply.redirect('/list');
    return;
  }

  server.register(FastifyProxy, {
    upstream,
    prefix: '/', // Apply proxy for the root
    http2: false
  });

  reply.send(`Proxying to ${upstream}`);
};

// Dynamic proxy route
server.get('/*', proxyHandler);

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
