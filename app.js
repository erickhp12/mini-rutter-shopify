// Require the necessary modules
const express = require('express');
const { initializeData } = require('./initializeDb');
const { MongoClient } = require('mongodb');

// Create an Express app
const app = express();

const uri = 'mongodb://localhost:27017';
const dbName = 'shopify';


app.get('/products', async (req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
    
        const db = client.db(dbName);
        const collection = db.collection('products');
        const result = await collection.find({}).toArray();
        
        client.close();
        res.status(200).send(result);
    } catch(error) {
        res.status(500).send([]);
    }
});

app.get('/orders', async (req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
    
        const db = client.db(dbName);
        const collection = db.collection('orders');
        const result = await collection.find({}).toArray();
        
        client.close();
        res.status(200).send(result);
    } catch(error) {
        res.status(500).send([]);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    intialization();
});

const intialization = async () => await initializeData()
