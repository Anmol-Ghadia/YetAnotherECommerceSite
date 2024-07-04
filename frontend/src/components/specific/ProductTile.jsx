import React, { useEffect, useState } from "react";
import '../../scss/components/specific/ProductTile.scss';

// Represents an individual product being displayed as a tile
export default function ProductTile({item, img}) {
    function redirect() {
        window.location.href = "/browse/product/"+item.productId.toString();
    }

    function temporaryImage() {
        return `https://prd.place/450?padding=60&id=${item.productId}`
    }

    return (
        <>
            <div id='tile-with-space'>
                <div onClick={redirect} id='tile'>
                    <div id="tile-image-container">
                        <img id="tile-image" src={temporaryImage()} alt="product-image" />
                    </div>
                    <div id="tile-title">
                        {item.name}
                    </div>
                    <div id="tile-price">
                        ${item.price}
                    </div>
                </div>
            </div>
            {/* <a 
            href={"/browse/product/"+item.productId.toString()}>
                {item.name}, ${item.price}
            </a>
            <br /> */}
        </>
    )
}
