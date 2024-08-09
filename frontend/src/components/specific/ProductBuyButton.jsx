import React, { useEffect, useState } from "react";
import Cookie from 'js-cookie';
import '../../scss/components/specific/ProductBuyButton.scss';

// Represents the buy button with ability to 
//      increase or decrease quantity
export default function ProductBuyButton({prod}) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [qty, setQty] = useState(0);
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    useEffect(()=>{
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookie.get("token")
            }
        };

        fetch(`/api-v1/user/cart/product/${prod.productId}`,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            setIsLoaded(true);
            if (data['success']) {
                setQty(data['payload']['quantity']);
                setIsLoggedIn(true);
            }
        })
        .catch(error=>{
            console.log(error);
        })
    },[])

    useEffect(()=>{
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookie.get("token")
            },
            body: JSON.stringify({
                "quantity": qty
            })
        };

        fetch(`/api-v1/user/cart/product/${prod.productId}`,requestOptions)
        .then(console.log('quantity updated'))
        .catch(error=>{
            console.log(error);
        })
    },[qty,prod])

    const addQty = ()=>{
        if (isLoggedIn) {
            setQty(quantity=>quantity+1);
        } else {
            // Prompt user to login
            console.log('please log in');
        }
    }
    const subQty = ()=>{
        if (isLoggedIn) {
            setQty(quantity=>quantity-1);
        } else {
            // Prompt user to login
            console.log('please log in');
        }
    }

    const buyButton = <button id="add-to-cart-button" onClick={addQty}>Add to Cart</button>
    const decideQuantity = (
        <>
            <button id="sub-button" onClick={subQty}>Sub one</button>
            <div id="quantity-display">{qty}</div>
            <button id="add-button" onClick={addQty}>Add one</button>
        </>
    )

    return (
        <div id="buy-button-container">
        {isLoaded?
            (qty===0? buyButton:decideQuantity)
        :"loading"}    
        </div>
    )
}
