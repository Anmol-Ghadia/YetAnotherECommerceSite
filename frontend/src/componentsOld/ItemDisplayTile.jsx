import React, { useContext } from "react";
import './ItemDisplayTile.css';
import { UserContext } from "../App";

function ItemDisplayTile({data}) {
    const user = React.useContext(UserContext);
    const [state, setState] = user;
    
    return (
        <div
        className="tile-container"
        onClick={() => {
            setState(({
                ...state,
                currentPage: "ProductPage",
                currentPageState: data.productId
            }))
        }}>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
        </div>
    );
}

export default ItemDisplayTile;

