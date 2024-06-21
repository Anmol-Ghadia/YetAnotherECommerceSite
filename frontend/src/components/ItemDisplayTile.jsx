import React, { useContext } from "react";
import './ItemDisplayTile.css';
import { UserContext } from "../App";

function ItemDisplayTile({data}) {
    const user = useContext(UserContext);
    const [state, setState] = user;
    
    return (
        <div
        className="tile-container"
        onClick={() => {
            setState(({
                ...state,
                currentPage: "ProductPage",
                selectedProduct: data.ProdId
            }))
        }}>
            <h1>{data.Name}</h1>
            <p>{data.Description}</p>
        </div>
    );
}

export default ItemDisplayTile;

