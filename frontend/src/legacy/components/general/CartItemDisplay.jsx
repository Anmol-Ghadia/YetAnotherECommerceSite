import React, { useEffect, useState } from "react";
import { CartItem } from "../specific/CartItem";
import Cookies from 'js-cookie';

// Represents the entire cart, with all the items
export function CartItemDisplay() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState(null);


    function computeTotal(data) {
        let total = 0;
        for (let index = 0; index < data.length; index++) {
            const cartItem = data[index];
            total += cartItem.price * cartItem.quantity;
        }
        return total;
    }

    useEffect(()=>{
        const requestOptions = {
            headers: { 'Authorization': Cookies.get('token') },
        };
        fetch('/api-v1/user/cart',requestOptions)
        .then(res=>res.json())
        .then((data)=>{
            if (!data['success']) {
                return;
            }
            setIsLoaded(true);
            setItems(data['payload']);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

    function getItemsDisplay() {
        let total = computeTotal(items);
        return (
            <>
                <h2>Total Amount: ${total}</h2>
                {items.map((item)=> {
                    return <CartItem key={item.productId} item={item}/>
                })}
            </>
        )
            
    }

    return (
        <>
        {isLoaded? getItemsDisplay() : "Please log in"}
        </>   
    );
}
