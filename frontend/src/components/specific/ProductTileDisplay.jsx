import React from "react";
import ProductTile from "./ProductTile";
import '../../scss/components/specific/ProductTileDisplay.scss'

// Represents a collection of products being displayed
export default function ProductTileDisplay({isLoaded, items}) {
    return (
        <div id='tile-container'>
            {isLoaded? items.map((item,index)=> (
                <ProductTile key={index} item={item} img='https://picsum.photos/1000/1000' />
            )): 
            "loading..."}
        </div>
    )
}
