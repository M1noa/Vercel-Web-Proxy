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
    http2: false,
    hooks: {
      onResponse: async (response) => {
        const originalSend = response.raw.send;
        response.raw.send = function (body) {
          // Disable caching
          response.raw.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          response.raw.setHeader('Pragma', 'no-cache');
          response.raw.setHeader('Expires', '0');

          console.log('Processing response body'); // Debugging line

          // Return the original response body without modification
          return originalSend.call(this, body);
        };

        // Handle redirects
        if (response.raw.headers['location']) {
          let newLocation = response.raw.headers['location'];
          if (newLocation.startsWith('/')) {
            newLocation = `./${newLocation.substring(1)}`; // Replace leading slash with './'
          } else {
            newLocation = `./${newLocation}`; // Add './' if it doesn't start with a slash
          }
          newLocation = `https://vp.minoa.cat/${newLocation}`;
          response.raw.headers['location'] = newLocation;
        }
      }
    }
  });
};

proxyHandler('https://nano-proxy.github.io/', '/nano/');
proxyHandler('https://aluu.xyz/', '/aluu/');
proxyHandler('https://holyunblocker.org/', '/holy/');
proxyHandler('https://shuttleproxy.com/', '/shuttle/');
proxyHandler('https://nebulaproxy.io/', '/nebula/');
proxyHandler('https://nano-proxy.github.io/', '/');
proxyHandler('https://anura.pro/', '/anura/');
proxyHandler('https://terbium-46q.pages.dev/', '/terbium/');
proxyHandler('https://metallic.eu.org/', '/metallic/');
proxyHandler('https://definitelyscience.com//', '/defsci/');

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
