import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartItemDisplay } from "../components/general/CartItemDisplay";
import ProductBuyButton from "../components/specific/ProductBuyButton";

export default function ProductPage() {
    let params = useParams();
    let productId = params.id;

    let [prod , setProd] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);
    const [update, setUpdate] = useState(1);

    useEffect(()=>{

        fetch("/api-v1/product/"+productId.toString())
        .then((res) => res.json()) // Parse JSON asynchronously
        .then((obj) => {
            if (obj['success']) {
                setIsLoaded(true);
                setProd(obj['payload']);
                return;
            }
            console.log(obj);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });

    },[]);


    const link1 = 'https://picsum.photos/300/300';

    return (
        <>
            <hr />
            <h1>Single Product Page</h1>
            <p>Current product {productId}</p>
            {isLoaded ?
            <>
                <h2>{prod.name}</h2>
                <img src={link1} alt="Image"/>
                <h1>Image Here</h1>
                <p>{prod.description}</p>
                <p>Price: ${prod.price}</p>
                <ProductBuyButton prod={prod} setUpdate={setUpdate} />
            </> : "Loading..."
            }
            <hr />
            <CartItemDisplay update={update} />
        </>
    )
}
