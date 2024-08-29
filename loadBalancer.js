import http from 'http';
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});

const targets = [
  { host: 'http://localhost:3001', id: 'microservice 1' },
  { host: 'http://localhost:3002', id: 'microservice 2' },
  { host: 'http://localhost:3003', id: 'microservice 3' },
  { host: 'http://localhost:3004', id: 'microservice 4' },
  { host: 'http://localhost:3005', id: 'microservice 5' },
  { host: 'http://localhost:3006', id: 'microservice 6' },
];


let current = 0;

const server = http.createServer((req, res) => {
  // Balanceo de carga por Round-Robin
  const target = targets[current];
  current = (current + 1) % targets.length;

  // Escuchar el evento 'proxyRes' para modificar la respuesta
  proxy.once('proxyRes', (proxyRes) => {
    let body = '';

    proxyRes.on('data', (chunk) => {
      body += chunk;
    });

    proxyRes.on('end', () => {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'application/json');
        try {
          const originalData = JSON.parse(body);
          res.end(JSON.stringify({
            instance: target.id,
            data: originalData
          }));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error procesando la respuesta del microservicio.');
        }
      }
    });
  });

  // Proxyear la solicitud al target
  proxy.web(req, res, { target: target.host }, (error) => {
    if (error && !res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error en el proxy.');
    }
  });
});

server.listen(3000, () => {
  console.log('Balanceador on the lain!!!!');
});
