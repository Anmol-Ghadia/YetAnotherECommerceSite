import React from "react";
import './ItemDisplayTile.css';

function ItemDisplayTile({data}) {
    let viewProduct = (id) => {
        window.location.href = '/product/'+id;
    }
    return (
        <div
        className="tile-container"
        onClick={viewProduct(data.ProdId)}>
            <h1>{data.Name}</h1>
            <p>{data.Description}</p>
        </div>
    );
}

export default ItemDisplayTile;

