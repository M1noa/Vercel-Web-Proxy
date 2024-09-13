const Fastify = require('fastify');
const FastifyProxy = require('@fastify/http-proxy');
const server = Fastify();
const path = require('node:path');

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
          response.raw.setHeader('Cache-Control', 'no-store');

          console.log('Processing response body'); // Debugging line

          if (typeof body === 'string' && response.raw.headers['content-type'] && response.raw.headers['content-type'].includes('text/html')) {
            console.log('Modifying HTML content'); // Debugging line

            // Modify HTML content
            body = body.replace(/href="(https?:\/\/[^"]*)"/g, `href="https://vp.minoa.cat/$1"`)
                       .replace(/src="(https?:\/\/[^"]*)"/g, `src="https://vp.minoa.cat/$1"`)
                       .replace(/href="\/([^"]*)"/g, `href="./$1"`)
                       .replace(/src="\/([^"]*)"/g, `src="./$1"`)
                       .replace(/href="([^"]*)"/g, (match, p1) => {
                         if (p1.startsWith('http') || p1.startsWith('//')) {
                           return `href="https://vp.minoa.cat/${p1}"`;
                         }
                         return `href="./${p1}"`;
                       })
                       .replace(/src="([^"]*)"/g, (match, p1) => {
                         if (p1.startsWith('http') || p1.startsWith('//')) {
                           return `src="https://vp.minoa.cat/${p1}"`;
                         }
                         return `src="./${p1}"`;
                       })
                       // Replace all <title> tags with <title>Minoa</title>
                       .replace(/<title>.*?<\/title>/g, '<title>Minoa</title>');

            // Debugging output
            console.log(body);
          }
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

// Register all proxies
proxyHandler('https://oxide.3kh0.net/', '/');
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

server.get('/list', function (req, reply) {
  reply.sendFile('list.html');
});

// Start server
server.listen({host: "0.0.0.0", port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
