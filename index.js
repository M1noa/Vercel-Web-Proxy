const Fastify = require('fastify');
const server = Fastify();

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://1v1.lol/',
  prefix: '/1v1/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://shellshock.io/',
  prefix: '/shellshock/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://skribbl.io/',
  prefix: '/skribbl/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://shuttleproxy.com/',
  prefix: '/prox/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://discord.com/',
  prefix: '/discord/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://omegle.onl/',
  prefix: '/omegle/', 
  http2: false,
});

server.listen({host: "0.0.0.0", port: 3000 });
