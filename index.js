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

// Define a dynamic proxy route for all paths
server.all('/*', async (req, reply) => {
  // Extract the part of the path after /prxy/
  const fullPath = req.url;
  const pathAfterPrxy = fullPath.replace(/^\/prxy\//, '');

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

  // Extract the proxy key from the path
  const [proxyKey] = pathAfterPrxy.split('/'); // Only consider the first part for routing

  // Find the upstream URL based on the proxy key
  const upstreamUrl = upstreams[proxyKey];
  
  if (!upstreamUrl) {
    reply.code(404).send('Upstream not found');
    return;
  }

  // Proxy the request to the appropriate upstream URL
  try {
    const proxyHandler = proxy({
      upstream: upstreamUrl,
      http2: false,
    });

    proxyHandler(req.raw, reply.raw);
  } catch (error) {
    reply.code(500).send('Proxy error');
  }
});

server.listen({ host: '0.0.0.0', port: 3000 }, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
