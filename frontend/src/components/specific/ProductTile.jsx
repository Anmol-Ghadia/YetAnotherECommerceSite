import React from "react";


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
