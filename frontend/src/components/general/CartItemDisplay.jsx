import React, { useEffect, useState } from "react";
import { CartItem } from "../specific/CartItem";
import Cookies from 'js-cookie';

// Represents the entire cart, with all the items
export function CartItemDisplay() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState(null);


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

    return (
        <>
        {isLoaded? items.map((item)=> {
               return <CartItem key={item.productId} item={item}/>
            }): 
            "Please log in"}
        </>   
    );
}
