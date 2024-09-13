const Fastify = require('fastify');
const server = Fastify();
const path = require('node:path');
const proxy = require('@fastify/http-proxy');

server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
});

server.get('/', function (req, reply) {
  reply.sendFile('index.html');
});

server.get('/list', function (req, reply) {
  reply.sendFile('list.html');
});

// Catch-all route for dynamic proxy
server.all('/*', async (req, reply) => {
  const urlPath = req.raw.url;

  const pathAfterPrxy = urlPath.replace(/^\/prxy\//, '');

  // Define a map of upstream URLs
  const upstreams = {
    'shuttle': 'https://shuttleproxy.com/',
    'google': 'https://google.com/',
    'github': 'https://github.com/',
    'minecraft': 'https://eaglercraft.com/',
    'cod': 'https://nzp.gay/',
    'neal': 'https://neal.fun/',
    'roms': 'https://www.playroms.net/',
    'rando': 'https://rando.gg/',
    'itch': 'https://itch.io/',
    'roblox': 'https://now.gg/play/roblox-corporation/5349/roblox',
    '3kh': 'https://adfree3kh0.github.io/',
    '1v1': 'https://1v1.lol/',
    'mvp': 'https://movieboxpro.app/',
    'braflix': 'https://www.braflix.st/',
  };

  // Extract the proxy key
  const [proxyKey] = pathAfterPrxy.split('/'); // Only consider the first part for routing

  // Find the upstream URL based on the proxy key
  const upstreamUrl = upstreams[proxyKey];
  
  if (upstreamUrl) {
    // If an upstream URL is found, use it
    try {
      const proxyHandler = proxy({
        upstream: upstreamUrl,
        http2: false,
      });

      // Pass the original request and reply objects to the proxy handler
      proxyHandler(req.raw, reply.raw);
    } catch (error) {
      reply.code(500).send('Proxy error');
    }
  } else {
    // If no predefined upstream is found, proxy to the path after /prxy/
    try {
      const dynamicProxyHandler = proxy({
        upstream: `https://${pathAfterPrxy}`,
        http2: false,
      });

      // Pass the original request and reply objects to the proxy handler
      dynamicProxyHandler(req.raw, reply.raw);
    } catch (error) {
      reply.code(500).send('Proxy error');
    }
  }
});

server.listen({ host: '0.0.0.0', port: 3000 }, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
