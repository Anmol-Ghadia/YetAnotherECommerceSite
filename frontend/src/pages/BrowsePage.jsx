import React, { useEffect, useState } from "react";
import ProductTile from "../components/specific/ProductTile";

export default function BrowsePage() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState(null);

    useEffect(()=>{
        fetch('/api-v1/product/0/9')
        .then(res=>res.json())
        .then((data)=>{
            if (!data['success']) {
                console.log("Error");
                console.log(data);
                return;
            }
            console.log(data);
            setItems(data['payload']);
            setIsLoaded(true);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

    return (
        <>
            <hr />
            <h1>Browse Page</h1>
            <form action="" method="get">
                Search:
                <input type="text" name="search" id="search-box" />
                <br />
                Quantity:
                15<input type="radio" name="quantity" id="quantity-15" />
                30<input type="radio" name="quantity" id="quantity-30" />
                60<input type="radio" name="quantity" id="quantity-60" />
                <br />
                Min Price amount:
                <input type="number" name="price-range-min" id="price-range-min" />
                <br />
                Max Price amount:
                <input type="number" name="price-range-max" id="price-range-max" />
                <br />
                <button type="submit">Search</button>
            </form>
            {isLoaded? items.map((item)=> (
                    <ProductTile key={item.productId} item={item} />
            )): "loading..."}
            <hr />
        </>
    )
}
