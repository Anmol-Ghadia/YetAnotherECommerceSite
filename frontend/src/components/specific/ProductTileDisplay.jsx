import React from "react";
import ProductTile from "./ProductTile";

// Represents a collection of products being displayed
export default function ProductTileDisplay({isLoaded, items}) {
    return (
        <>
            {isLoaded? items.map((item)=> (
                <ProductTile key={item.productId} item={item} />
            )): 
            "loading..."}
        </>
    )
}
