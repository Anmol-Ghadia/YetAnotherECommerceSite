import { 
    doDBClose,
    doDBConnect
} from './database.js'
import dotenv from 'dotenv';
import { isEnvironmentVariableSet } from './helpers.js';
import makeApp from './app.js';
import { Express } from 'express';
import { log } from './logger.js';
import { initialize } from './database/initialize.js';

dotenv.config();
let isDBConnected: boolean= false;


// Perform checks before starting the server
if (isEnvironmentVariableSet()) {
    process.env.JWT_PRIVATE_KEY += Date.now().toString();
} else {
    process.exit(1);
}

const app: Express = makeApp();
const port = process.env.PORT || 5000;

async function endRoutine() {
    log(0,'SERVER','shutting down');
    if(isDBConnected) {
        await doDBClose();
        log(0,'SERVER',`database connection closed`);
    } else {
        log(0,'SERVER',`cannot close db connection, db was not connected`)
    }
    process.exit(0);
}

// Start Process
const server = app.listen(port, async () => {
  log(0,`SERVER`,`listening at (http://localhost:${port})`);
  isDBConnected = doDBConnect();
  if (process.env.RESET_DB=='true') initialize();
if (!isDBConnected) endRoutine;
});

process.on('SIGINT', endRoutine);
server.on('close',endRoutine);
