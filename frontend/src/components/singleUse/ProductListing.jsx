import React from "react";

export default function ProductListing({data}) {

    return (
        data==null? 
        <>
            <h1>Loading ...</h1>
        </>
        :
        <>
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
        </>
    )
}
