import { 
    doDBClose,
    doDBConnect
} from './database.js'
import dotenv from "dotenv";
import { isEnvironmentVariableSet } from "./helpers.js";
import makeApp from './app.js';
import { Express } from 'express';

const connectDB = true;
dotenv.config();
let isDBConnected: boolean= false;


// Perform checks before starting the server
if (isEnvironmentVariableSet()) {
    process.env.JWT_PRIVATE_KEY += Date.now().toString();
    console.log('server started at:', Date.now().toString());
} else {
    console.log('All Environment Variables are not set')
    process.exit(1);
}

const app: Express = makeApp();
const port = process.env.PORT || 5000;

async function endRoutine() {
    console.log('Server is closing. Performing cleanup...');
    if(isDBConnected) {
        await doDBClose();
        console.log("Database connection closed");
    } else {
        console.log("Database not connected, no need to close connection");
    }
    process.exit(0);
}

// Start Process
const server = app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  if (!connectDB) return;
  isDBConnected = doDBConnect();
    if (!isDBConnected) endRoutine;
});

process.on('SIGINT', endRoutine);
server.on('close',endRoutine);
