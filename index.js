const Fastify = require('fastify');
const server = Fastify();

// Main page
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://noctura.app/',
  prefix: '/', 
  http2: false,
});

// Proxys
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://mathforkids.xyz',
  prefix: '/mfk/', 
  http2: false,
});

// Games
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://now.gg/play/roblox-corporation/5349/roblox',
  prefix: '/roblox/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://1v1.lol/',
  prefix: '/1v1/', 
  http2: false,
});

// Other
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://wtmovies.com/',
  prefix: '/movie/', 
  http2: false,
});

server.listen({host: "0.0.0.0", port: 3000 });
