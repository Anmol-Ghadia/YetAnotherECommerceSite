import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import TopBar from "../components/TopBar";

export default function ProductPage() {
    const user = React.useContext(UserContext);
    const [state, setState] = user;
    const [data, setData] = useState({
        description: "description here",
        name: "Name here",
        price: 99,
        productId: 99,
        images: {}
    })


    const productId = state['currentPageState'];
    fetch("/api-v1/product/"+productId.toString())
    .then((res) => res.json()) // Parse JSON asynchronously
    .then((obj) => {
        console.log(obj);
        setData(obj);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

    
    return (
    <div className="Container">
        <TopBar />
        <h1>Product Page</h1>
        <h2>{data.name}</h2>
        <div 
        className="image-container"
        style={{
            width: 400 + 'px', 
            height:400 + 'px',
            border: 2 + 'px solid red'}}>
            Images here
        </div>
        <h3>${data.price}</h3>
        <p>{data.description}</p>
        <br />
        Product page for product No.: {productId}
    </div>
    );
}
