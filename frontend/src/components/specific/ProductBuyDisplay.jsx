import React, { useEffect, useState } from "react";

export default function ProductBuyDisplay({prod}) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [qty, setQty] = useState(0);

    useEffect(()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: window.localStorage.getItem('username'),
                productId: prod.productId
            })
        };

        fetch('/api-v1/user/cart',requestOptions)
        .then(res=>res.json())
        .then(data=>{
            setIsLoaded(true);
            if (data['success']) {
                setQty(data['payload']['amount']);
            }
        })
        .catch(error=>{
            console.log(error);
        })
    },[])

    const addQty = ()=>{
        setQty(quantity=>quantity+1);
    }
    const subQty = ()=>{
        setQty(quantity=>quantity-1);
    }

    const buyButton = <button onClick={addQty}>Add to Cart</button>
    const decideQuantity = (
        <>
            <button onClick={subQty}>Sub one</button>
            <span>{qty}</span>
            <button onClick={addQty}>Add one</button>
        </>
    )

    return (
        <>
        {isLoaded?
            (qty==0? buyButton:decideQuantity)
        :"loading"}    
        </>
    )
}
