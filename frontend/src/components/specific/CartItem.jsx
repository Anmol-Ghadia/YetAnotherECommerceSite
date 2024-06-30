
// Represents a single cart item being displayed
export function CartItem({item}) {
    
    return (
        <>
            <h2>{item.name} at ${item.price}</h2>
            <p>qty: {item.quantity}</p>
        </>
    )
}
