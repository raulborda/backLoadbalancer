import { spawn }  from 'child_process';

const services = [
  { port: 3001, id: 'microservice 1' },
  { port: 3002, id: 'microservice 2' },
  { port: 3003, id: 'microservice 3' },
  { port: 3004, id: 'microservice 4' },
  { port: 3005, id: 'microservice 5' },
  { port: 3006, id: 'microservice 6' }
];

services.forEach(service => {
  const child = spawn('node', ['microservice.js', service.port, service.id]);

  child.stdout.on('data', (data) => {
    console.log(`stdout (${service.id}): ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr (${service.id}): ${data}`);
  });

  child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
});
