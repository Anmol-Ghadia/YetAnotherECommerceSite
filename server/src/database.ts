export {connectDB, MongoWrapper};
import { 
    Collection, 
    Db, 
    MongoClient,
    ServerApiVersion,
    Document,
    WithId,
    ObjectId
} from "mongodb";

async function connectDB(uri:string,dbName:string,collectionName:string):Promise<MongoWrapper | null> {
    let client;
    try {
        client = new MongoClient(uri, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            }
        });
        let mongoWrapper = new MongoWrapper(client,dbName,collectionName);
        await mongoWrapper.ping();
        return mongoWrapper;
    } catch (err) {
        client?.close();
    }
    return null;
}


class MongoWrapper {
    protected client: MongoClient;
    protected db: Db;
    protected collection: Collection<Product>;
    protected dbName:string;
    protected collectionName:string;


    constructor(client: MongoClient,dbName:string,collectionName:string) {
        let db = client.db(process.env.DB_NAME);
        let collection = db.collection<Product>(collectionName);

        this.client = client;
        this.dbName=dbName;
        this.collectionName=collectionName;
        this.db = db;
        this.collection = collection;
    }

    // Returns the JSON object for the given product ID
    async getProductByID(id: number): Promise<WithId<Product> | null> {
        let query={ "ProdId": { $eq: id } };
        const filteredDocs = await this.collection.findOne(query);
        console.log('Found documents filtered by'+JSON.stringify(query) +' =>', filteredDocs);
        return filteredDocs;
    }

    // Safely closes the connection
    async close() {
        await this.client.close();
    }

    // Pings the database
    async ping() {
        await this.db.command({ ping: 1 });
        console.log("Pinged your deployment. You are currently connected to MongoDB!");
    }

}

interface Product {
    _id: ObjectId;
    ProdId: number;
    Name: string;
    Description: string;
    price: number;
}
