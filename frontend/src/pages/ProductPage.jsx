import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import TopBar from "../components/TopBar";
import ProductListing from "../components/singleUse/ProductListing";

export default function ProductPage() {
    const user = React.useContext(UserContext);

    
    const [state, setState] = user;
    const [data, setData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // {
    //     description: "description here",
    //     name: "Name here",
    //     price: 99,
    //     productId: 99,
    //     images: {}
    // }


    const productId = state['currentPageState'];
    useEffect(() => {
        fetch("/api-v1/product/"+productId.toString())
        .then((res) => res.json()) // Parse JSON asynchronously
        .then((obj) => {
            console.log(obj);
            setData(obj);
            setIsLoaded(true);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    })
    
    return (
    <div className="Container">
        <TopBar />
        <ProductListing data={data}/>
        
        Product page for product No.: {productId}
    </div>
    );
}
