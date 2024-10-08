
// Represents a single cart item being displayed
export function CartItem({item}) {
    
    function goToProductPage() {
        window.location.href = "/browse/product/"+item.productId.toString()
    }

    return (
        <>
            <div onClick={goToProductPage}>
                <h2>{item.name} at ${item.price}</h2>
                <p>qty: {item.quantity}</p>
            </div>
        </>
    )
}
