import { useEffect, useState } from "react"

// Represents a single cart item being displayed
export function CartItem({item}) {
    
    const [productTitle, setProductTitle] = useState(item.productId);

    useEffect(()=>{
        fetch(`/api-v1/product/${item.productId}`)
        .then(res=>res.json())
        .then(body=>{
            if (body['success']) {
                const newTitle = `${body['payload']['name']} :${body['payload']['price']}`
                setProductTitle(newTitle);
            }
        })
    },[])

    return (
        <>
            <h2>{productTitle}</h2>
            <p>qty: {item.quantity}</p>
        </>
    )
}
