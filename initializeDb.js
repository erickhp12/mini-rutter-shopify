const { MongoClient } = require('mongodb');

async function initializeData () {
    // const declaracion
    try {
        const url = 'https://rutterinterview.myshopify.com/admin/api/2022-04';
        const token = 'shpua_b1c9a97a8a3a33ee4a1aa0600b160cab';
        const uri = 'mongodb://localhost:27017/';
        const dbName = 'shopify';
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);

        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(collection => collection.name === 'products');
    
        if (collectionExists) {
            console.log('Data is already on the database');
        } else {
            console.log('Inserting data');
         
            // fetch data from shopify
            const { products } = await fetch(`${url}/products.json`, { headers: { 'X-Shopify-Access-Token':token }}).then((response) => response.json());
            const { orders } = await fetch(`${url}/orders.json`, { headers: { 'X-Shopify-Access-Token':token }}).then((response) => response.json());
        
            // insert products
            const productsCollection = db.collection('products');
            products.forEach(element => {
                const product = {
                    platform_id: element.id,
                    name: element.title
                }
                productsCollection.insertOne(product, () => client.close());
            });

            // insert orders
            const ordersCollection = db.collection('orders');
                orders.forEach(element => {
                const order = {
                    platform_id: element.id,
                    line_items: element.line_items
                }
                ordersCollection.insertOne(order, () => client.close());
            });
            console.log('Initialization done....');
        }
    } catch (error) {
        console.error('Error checking collection:', error);
        return 'An error occured';
    }
    return 'Initialization done....';
}


module.exports = { initializeData }