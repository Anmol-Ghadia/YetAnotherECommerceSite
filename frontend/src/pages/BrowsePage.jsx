import React, { useEffect, useState } from "react";
import ProductTileDisplay from "../components/specific/ProductTileDisplay";


export default function BrowsePage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [showLoadMore, setShowLoadMore] = useState(false);
    
    const [searchText, setSearchText] = useState('');
    const [quantity, setQuantity] = useState('25');
    const [minPriceText, setMinPriceText] = useState(0);
    const [maxPriceText, setMaxPriceText] = useState(1000);

    // radio buttons for quantity
    const handleOptionChange = (event) => {
        setQuantity(event.target.value);
    };

    // Search Function
    function doSubmit() {
        fetchProducts(true);
    }

    function addMoreData() {
        fetchProducts(false);
    }

    // True for newQuery if calling to remove old products
    function fetchProducts(newQuery) {
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                minPrice: parseInt(minPriceText),
                maxPrice: parseInt(maxPriceText),
                quantity: parseInt(quantity),
                search: searchText
            })
        };
        fetch("/api-v1/misc/search",parameters)
        .then(res=>res.json())
        .then((body)=>{
            if (!body['success']) {
                console.log(body);
                return
            }
            if (newQuery) {
                setIsLoaded(true);
                setPageCount(0);
                setItems(body['payload']);
            } else {
                setIsLoaded(true);
                setPageCount(count=>count+1);
                setItems(combineArrays(items,body['payload']));
            }
            if (searchText.length===0) {
                setShowLoadMore(true);
            } else {
                setShowLoadMore(false);
            }
        })
        .catch(err=>console.log(err));
    }

    useEffect(()=>{
        fetchProducts(true);
    },[])


    return (
        <>
            <hr />
            <h1>Browse Page</h1>
            Search:
            <input 
                type="text" 
                name="search" 
                id="search-box"
                value={searchText}
                onChange={(e)=>{setSearchText(e.target.value)}}/>
            <br />
            Quantity:
            10<input 
                type="radio"
                name="quantity"
                id="quantity-10"
                value="10"
                onChange={handleOptionChange}
                checked={quantity === "10"} />
            25<input 
                type="radio"
                name="quantity"
                id="quantity-25"
                value="25"
                onChange={handleOptionChange}
                checked={quantity === "25"} />
            50<input 
                type="radio"
                name="quantity"
                id="quantity-50"
                value="50"
                onChange={handleOptionChange}
                checked={quantity === "50"} />
            <br />
            Min Price amount:
            <input 
                type="number"
                name="price-range-min"
                id="price-range-min"
                value={minPriceText}
                onChange={(e)=>{setMinPriceText(e.target.value)}} />
            <br />
            Max Price amount:
            <input 
                type="number"
                name="price-range-max"
                id="price-range-max"
                value={maxPriceText}
                onChange={(e)=>{setMaxPriceText(e.target.value)}} />
            <br />
            <button onClick={doSubmit}>Search</button>
            <br />
            <ProductTileDisplay isLoaded={isLoaded} items={items} pageCount={pageCount} />
            {showLoadMore? 
            <button onClick={addMoreData}>Load more</button> :
            <></>}
            <hr />
        </>
    )
}

function combineArrays(arr1, arr2) {
    let out = [];
    if (arr1 != null) {
        arr1.forEach(element => {
            out.push(element);
        });
    }
    if (arr2 != null) {
        arr2.forEach(element => {
            out.push(element);
        });
    }
    return out;
}
