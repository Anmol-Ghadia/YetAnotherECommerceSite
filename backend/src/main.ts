import express, { Express, Request, Response } from "express";
import { 
    doDBClose,
    doDBConnect,
    getProductByID } from './database.js'
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routers.js";

dotenv.config();
let isDBConnected: boolean;
// let mongo: MongoWrapper;

// Perform checks before starting the server
if (process.env.DB_URI == null ||
    process.env.DB_NAME == null ||
    process.env.COLLECTION_NAME == null) {
    console.log('Environment Variables Not set')
    process.exit(1);
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

app.use('/api-v1',router);

// Start Process
let server = app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  isDBConnected = doDBConnect(
    process.env.DB_URI as string,
    process.env.DB_NAME as string,
    process.env.COLLECTION_NAME as string
    );
    if (!isDBConnected) endRoutine;
});

process.on('SIGINT', endRoutine);
server.on('close',endRoutine);
