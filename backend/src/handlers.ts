import { Request,Response } from "express";
import { getProductByID, getProductByIDRange } from "./database";

export {handleSingleProductById,handleRangeProductById};

// Products handler
async function handleSingleProductById(req: Request, res:Response) {
    let id = parseInt(req.params['productId']);
    let out = await getProductByID(id)
    if (out == null) {
        res.send("Prod Not foun`d");
        return;
    }
    res.send(out);
}

async function handleRangeProductById(req:Request,res:Response) {
    let startId = parseInt(req.params['startProductId']);
    let endId = parseInt(req.params['endProductId']);
    let out = await getProductByIDRange(startId,endId);
    if (out.length == 0) {
        res.send('Nothing in range');
        return;
    }
    res.send(out);
}
