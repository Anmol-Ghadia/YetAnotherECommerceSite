import express, { Express, Request, Response } from "express";
import {connectDB, MongoWrapper} from './database.js'
import dotenv from "dotenv";

dotenv.config();
let mongo: MongoWrapper;

// Perform checks before starting the server
if (process.env.DB_URI == null ||
    process.env.DB_NAME == null ||
    process.env.COLLECTION_NAME == null) {
    console.log('Environment Variables Not set')
    process.exit(1);
}

const app: Express = express();
const port = process.env.PORT || 3000;

// Make static files public
// app.use(express.static('public'))

async function endRoutine() {
    // Perform cleanup operations here
    console.log('Server is closing. Performing cleanup...');
    await mongo.close();
    // Example: Close database connections, save logs, etc.
    process.exit(0); // Exit the process after cleanup
}

// Products
app.get('/api-v1/product/:productId',async (req: Request, res: Response)=>{
    let id = parseInt(req.params['productId']);
    console.log(id);
    let out = await mongo.getProductByID(id)
    if (out == null) {
        res.send("Prod Not found");
        return;
    }
    res.send(out);
})

// Route for home page
app.get("/", (req: Request, res: Response) => {
  res.send('<h1>Landing Page!</h1>');
});

// Start Process
let server = app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  let temp = await connectDB(
    process.env.DB_URI as string,
    process.env.DB_NAME as string,
    process.env.COLLECTION_NAME as string
    );
    if (temp == null) {
        endRoutine();
        return;
    }
    mongo = temp;
});


process.on('SIGINT', endRoutine);
server.on('close',endRoutine);
