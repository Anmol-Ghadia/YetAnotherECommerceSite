import express, { Express, Request, Response } from "express";
const { MongoClient, ServerApiVersion } = require('mongodb');
import dotenv from "dotenv";

dotenv.config();
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}
}
run().catch(console.dir);

const app: Express = express();
const port = process.env.PORT || 3000;

// Make static files public
// app.use(express.static('public'))

// Products
app.get('/api-v1/products/:productId',(req: Request, res: Response)=>{
    console.log(req.params);
    res.send(req.params['productId']);
})


// Route for home page
app.get("/", (req: Request, res: Response) => {
  res.send('<h1>Landing Page!</h1>');
});

// Start Process
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
