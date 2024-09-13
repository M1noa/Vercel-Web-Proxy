const Fastify = require('fastify');
const server = Fastify();
const path = require('node:path');

// Static file serving
server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

// Serve static files
server.get('/', function (req, reply) {
  reply.sendFile('index.html');
});
server.get('/list', function (req, reply) {
  reply.sendFile('list.html');
});

// Proxy handler
const proxyHandler = (upstream, prefix) => {
  server.register(require('@fastify/http-proxy'), {
    upstream,
    prefix,
    http2: false,
    hooks: {
      onResponse: async (response) => {
        const originalSend = response.raw.send;
        response.raw.send = function (body) {
          if (typeof body === 'string' && response.raw.headers['content-type'] && response.raw.headers['content-type'].includes('text/html')) {
            // Modify HTML content
            body = body.replace(/href="\/([^"]*)"/g, `href="/${prefix}$1"`)
                       .replace(/src="\/([^"]*)"/g, `src="/${prefix}$1"`)
                       .replace(/href="(https:\/\/[^"]*)"/g, `href="/${prefix}$1"`)
                       .replace(/src="(https:\/\/[^"]*)"/g, `src="/${prefix}$1"`)
                       .replace(new RegExp(`href="${upstream}"`, 'g'), '')
                       .replace(new RegExp(`src="${upstream}"`, 'g'), '');
          }
          return originalSend.call(this, body);
        };

        // Handle redirects
        if (response.raw.headers['location']) {
          let newLocation = response.raw.headers['location'];
          if (newLocation.startsWith('/')) {
            newLocation = newLocation.substring(1); // Remove leading slash
          }
          newLocation = `${prefix}${newLocation}`;
          response.raw.headers['location'] = newLocation;
        }
      }
    }
  });
};

// Register all proxies
proxyHandler('https://shuttleproxy.com/', '/shuttle/');
proxyHandler('https://google.com/', '/google/');
proxyHandler('https://github.com/', '/github/');
proxyHandler('https://eaglercraft.com/', '/minecraft/');
proxyHandler('https://nzp.gay/', '/cod/');
proxyHandler('https://neal.fun/', '/neal/');
proxyHandler('https://www.playroms.net/', '/roms/');
proxyHandler('https://rando.gg/', '/rando/');
proxyHandler('https://itch.io/', '/itch/');
proxyHandler('https://now.gg/play/roblox-corporation/5349/roblox', '/roblox/');
proxyHandler('https://adfree3kh0.github.io/', '/3kh/');
proxyHandler('https://1v1.lol/', '/1v1/');
proxyHandler('https://movieboxpro.app/', '/mvp/');
proxyHandler('https://www.braflix.st/', '/braflix/');

// Start server
server.listen({host: "0.0.0.0", port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
