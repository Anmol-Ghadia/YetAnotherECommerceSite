export {getProductByID,closeDBConnection};
const { MongoClient, ServerApiVersion } = require('mongodb');
import dotenv from "dotenv";

dotenv.config();

const CLIENT = new MongoClient(process.env.DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
    try {
    await CLIENT.connect();
    let db = CLIENT.db(process.env.DB_NAME);
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}

async function closeDBConnection() {
    await CLIENT.close();
}

run().catch(console.dir);

async function getProductByID(id:number) {
    try {
        // await client.connect();
        
        let db = CLIENT.db(process.env.DB_NAME);
        let collecton = db.collection(process.env.COLLECTION_NAME);

        let query = { "ProdId":id }
        const filteredDocs = await collecton.find(query).toArray();
        console.log('Found documents filtered by'+JSON.stringify(query) +' =>', filteredDocs);
        // await client.close();
        return JSON.stringify(filteredDocs);
    } catch {
        // await client.close();
        return 'ERROR 500';
    }
}
