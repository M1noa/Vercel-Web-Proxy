const Fastify = require('fastify');
const server = Fastify();

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://discord.com/app',
  prefix: '/', 
  http2: true,
});

server.listen({host: "0.0.0.0", port: 3000 });

