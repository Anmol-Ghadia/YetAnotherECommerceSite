export {
    doDBConnect,
    getProductByID,
    doDBClose,
    Product
};
import { 
    Collection, 
    Db, 
    MongoClient,
    ServerApiVersion,
    Document,
    WithId,
    ObjectId
} from "mongodb";

let CLIENT:MongoClient;
let DB:Db;
let COLLECTION:Collection<Product>;

interface Product {
    _id: ObjectId;
    ProdId: number;
    Name: string;
    Description: string;
    price: number;
}


function doDBConnect(uri:string,dbName:string,collectionName:string):boolean {
    try {
        CLIENT = new MongoClient(uri, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            }
        });
        DB = CLIENT.db(process.env.DB_NAME);
        COLLECTION = DB.collection<Product>(collectionName);
        pingDB();
        return true;
    } catch (err) {
        doDBClose();
        return false;
    }
}

async function doDBClose() {
    await CLIENT.close();
}

// gets the document with given product id
async function getProductByID(id: number): Promise<WithId<Product> | null> {
    let query={ "ProdId": { $eq: id } };
    const filteredDocs = await COLLECTION.findOne(query,{ projection: { _id: 0 } });
    console.log('Found documents filtered by'+JSON.stringify(query) +' =>', filteredDocs);
    return filteredDocs;
}

// Pings the DB and prints the message
async function pingDB() {
    await DB.command({ ping: 1 });
    console.log("Pinged your deployment. You are currently connected to MongoDB!");
}
