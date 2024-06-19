import { Request,Response } from "express";
import { getProductByID } from "./database";

export {handleSingleProductById};

// Products handler
async function handleSingleProductById(req: Request, res:Response) {
    let id = parseInt(req.params['productId']);
    let out = await getProductByID(id)
    if (out == null) {
        res.send("Prod Not found");
        return;
    }
    res.send(out);
}
