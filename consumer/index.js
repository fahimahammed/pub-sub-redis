const express = require('express');
const redis = require('redis');

const app = express();

let client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => console.log('RedisError', err));
client.on('connect', () => console.log('Redis connected'));

const connect = async () => {
  await client.connect();
};

connect();

const productData = [];

(async () => {
    // const client = redis.createClient({
    //     url: 'redis://localhost:6379'
    //   }); 
    const subscriber = client.duplicate();
    await subscriber.connect();
 
    await subscriber.subscribe('products', (message) => {
      console.log(message); // 'message'
      productData.push(JSON.parse(message));
    });
  
  })();

const port = process.env.PORT || 3002;

app.get('/', (req, res) => {
  res.status(200).json({ message: `Redis Consumer active at ${port}` });
});

app.get('/subscriber', (req, res) => {
  res.status(200).json({ productData });
});

app.listen(port, () => {
  console.log('Consumer server running');
});
