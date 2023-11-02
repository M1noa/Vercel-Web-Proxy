const Fastify = require('fastify');
const server = Fastify();
const express = require('express');
const axios = require('axios');

const app = express();

// Middleware to log visitor information
app.use((req, res, next) => {
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  console.log(`New Visitor : IP: ${ip}`);
  next();
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://1v1.lol/',
  prefix: '/1v1', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://https://shellshock.io/',
  prefix: '/shellshock', 
  http2: false,
});

server.register(require('@fastify/http-proxy'), {
  upstream: 'https://skribbl.io/
  prefix: '/skribbl', 
  http2: false,
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


server.listen({host: "0.0.0.0", port: 3000 });

