import express, { Express, Request, Response } from "express";
import {getProductByID,closeDBConnection} from './database.js'
import dotenv from "dotenv";
import { ServerApiVersion } from "mongodb";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Make static files public
// app.use(express.static('public'))

function endRoutine() {
    // Perform cleanup operations here
    console.log('Server is closing. Performing cleanup...');
    closeDBConnection();
    // Example: Close database connections, save logs, etc.
    process.exit(0); // Exit the process after cleanup
}

// Products
app.get('/api-v1/products/:productId',async (req: Request, res: Response)=>{
    let id = parseInt(req.params['productId']);
    console.log(id);
    let out = await getProductByID(id)
    res.send(out);
})


// Route for home page
app.get("/", (req: Request, res: Response) => {
  res.send('<h1>Landing Page!</h1>');
});

// Start Process
let server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});


process.on('SIGINT', endRoutine);
server.on('close',endRoutine);
