import React from "react";
import ProductTile from "./ProductTile";

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
