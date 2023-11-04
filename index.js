const Fastify = require('fastify');
const server = Fastify();

// Proxys
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://artclass.site/',
  prefix: '/', 
  http2: false,
});

// Chating
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://discord.com/app',
  prefix: '/discord/', 
  http2: false,
});

// Games
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://now.gg/play/roblox-corporation/5349/roblox',
  prefix: '/roblox/', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://nativegames.net/',
  prefix: '/native/', 
  http2: false,
});

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

server.listen({host: "0.0.0.0", port: 3000 });
