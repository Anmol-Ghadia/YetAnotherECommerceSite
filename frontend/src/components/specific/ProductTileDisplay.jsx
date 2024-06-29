import React from "react";
import ProductTile from "./ProductTile";

// Represents a collection of products being displayed
export default function ProductTileDisplay({isLoaded, items, pageCount}) {
    return (
        <>
            {isLoaded? items.map((item,index)=> (
                <ProductTile key={index} item={item} />
            )): 
            "loading..."}
        </>
    )
}
