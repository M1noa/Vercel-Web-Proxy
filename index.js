const Fastify = require('fastify');
const server = Fastify();

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://discord.com/app',
  prefix: '/discord', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://reddit.com',
  prefix: '/reddit', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://radon.games',
  prefix: '/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://schoolcheats.net/',
  prefix: '/chez', 
  http2: false,
});

server.listen({host: "0.0.0.0", port: 3000 });

