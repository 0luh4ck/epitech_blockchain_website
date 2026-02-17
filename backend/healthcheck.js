// Script de health check pour Render.com
// Permet de vérifier que le serveur est bien démarré

import http from 'http';

const options = {
  host: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('ERROR:', err.message);
  process.exit(1);
});

request.end();
