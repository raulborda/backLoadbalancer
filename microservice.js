import express from 'express';
const app = express();

const PORT = process.argv[2] || 3000;
const instanceId = process.argv[3] || 'microservice';

app.get('/', (req, res) => {
  res.json({
    instance: instanceId
  });
});

app.listen(PORT, () => {
  console.log(`${instanceId} corriendo en http://localhost:${PORT}`);
});
