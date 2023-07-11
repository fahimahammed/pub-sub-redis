const express = require('express');
const redis = require('redis');

const app = express();
// const publisher = redis.createClient({url: 'redis://localhost:6379'});

let publisher = redis.createClient({
    url: 'redis://localhost:6379'
});

publisher.on('error', (err) => console.log('RedisError', err));
publisher.on('connect', (err) => console.log('Redis connected'));

  const connect = async () => {
    await publisher.connect();
  };

  connect();

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.status(200).json({message: `Redis Publisher active at ${port}`});
})

app.get('/publish', async(req, res)=> {
    const id = Math.floor(Math.random() * 10 + 1);
    const product = {
        id, name: `Product ${id}`
    }
    await publisher.publish('products', JSON.stringify(product));
    
    res.send({message: 'Product published successfully!', data: product});
})

app.listen(port, ()=>{
    console.log("Producer server running")
})