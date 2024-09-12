const Fastify = require('fastify');
const server = Fastify();
const path = require('node:path')

server.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
  constraints: { host: 'example.com' } // optional: default {}
})

server.get('/', function (req, reply) {
  reply.sendFile('index.html')
})
server.get('/list', function (req, reply) {
  reply.sendFile('list.html') 
})


// Proxy
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://shuttleproxy.com/',
  prefix: '/shuttle/', 
  http2: false,
});

// Google
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://google.com/',
  prefix: '/google/', 
  http2: false,
});

// github
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://github.com/',
  prefix: '/github/', 
  http2: false,
});

// Minecraft
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://eaglercraft.com/',
  prefix: '/minecraft/', 
  http2: false,
});

// Cod Zombies
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://nzp.gay/',
  prefix: '/cod/', 
  http2: false,
});

// neal fun
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://neal.fun/',
  prefix: '/neal/', 
  http2: false,
});

// roms
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://www.playroms.net/',
  prefix: '/roms/', 
  http2: false,
});

// Random Games
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://rando.gg/',
  prefix: '/rando/', 
  http2: false,
});

// itch io
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://itch.io/',
  prefix: '/itch/', 
  http2: false,
});

// Roblox
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://now.gg/play/roblox-corporation/5349/roblox',
  prefix: '/roblox/', 
  http2: false,
});

// 3kh0
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://adfree3kh0.github.io/',
  prefix: '/3kh/', 
  http2: false,
});

// 1v1.lol
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://1v1.lol/',
  prefix: '/1v1/', 
  http2: false,
});

// MVP
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://movieboxpro.app/',
  prefix: '/mvp/', 
  http2: false,
});

// Movies
server.register(require('@fastify/http-proxy'), {
  upstream: 'https://www.braflix.st/',
  prefix: '/braflix/', 
  http2: false,
});

server.listen({host: "0.0.0.0", port: 3000 });
