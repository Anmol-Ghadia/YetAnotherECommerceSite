import express, { Express, Request, Response } from "express";
import { 
    doDBClose,
    doDBConnect
} from './database.js'
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routers.js";


let connectDB = true;
dotenv.config();
let isDBConnected: boolean= false;
// let mongo: MongoWrapper;

// Perform checks before starting the server
if (process.env.DB_URI == null ||
    process.env.DB_NAME == null ||
    process.env.PRODUCT_COLLECTION_NAME == null ||
    process.env.USER_COLLECTION_NAME == null ||
    process.env.JWT_PRIVATE_KEY == null) {
    console.log('Environment Variables Not set')
    process.exit(1);
} else {
    process.env.JWT_PRIVATE_KEY += Date.now().toString();
    console.log('server started at:', Date.now().toString());
}



const app: Express = express();
const port = process.env.PORT || 5000;

// Allow cross-origin requests
app.use(cors())

// Make static files public
// app.use(express.static('public'))

async function endRoutine() {
    console.log('Server is closing. Performing cleanup...');
    if(isDBConnected) {
        await doDBClose();
        console.log("Database connection closed");
    } else {
        console.log("Database not connected, no need to close connection");
    }
    process.exit(0); // Exit the process after cleanup
}

app.use(express.json());
app.use('/api-v1',router);

// Start Process
let server = app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  if (!connectDB) return;
  isDBConnected = doDBConnect();
    if (!isDBConnected) endRoutine;
});

process.on('SIGINT', endRoutine);
server.on('close',endRoutine);
