import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function ProductPage() {
    let params = useParams();
    let productId = params.id;

    let [prod , setProd] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);

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

    return (
        <>
            <hr />
            <h1>Single Product Page</h1>
            <p>Current product {productId}</p>
            {isLoaded ?
            <>
                <h2>{prod.name}</h2>
                <h1>Image Here</h1>
                <p>{prod.description}</p>
                <p>Price: ${prod.price}</p>
            </> : "Loading..."
            }
            <hr />
        </>
    )
}
