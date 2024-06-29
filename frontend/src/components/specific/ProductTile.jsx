import React from "react";

// Represents an individual product being displayed as a tile
export default function ProductTile({item}) {
    return (
        <>
            <a 
            href={"/browse/product/"+item.productId.toString()}>
                {item.name}, ${item.price}
            </a>
            <br />
        </>
    )
}
