import React, { useEffect, useState } from "react";
import ProductTileDisplay from "../components/specific/ProductTileDisplay";


export default function BrowsePage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState(null);
    
    const [searchText, setSearchText] = useState('');
    const [quantity, setQuantity] = useState('25');
    const [minPriceText, setMinPriceText] = useState(0);
    const [maxPriceText, setMaxPriceText] = useState(0);

    // radio buttons for quantity
    const handleOptionChange = (event) => {
        setQuantity(event.target.value);
    };

    // Search Function
    const doSubmit = ()=> {
        if (searchText.trim() == '') {
            doQuery(quantity,minPriceText,maxPriceText);
        } else {
            doSearch(searchText,quantity,minPriceText,maxPriceText);
        }
    }

    // Query without kwywords
    const doQuery = (qty,min,max)=>{
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quantity: qty,
                minPrice: min.toString(),
                maxPrice: max.toString()
            })
        };
        fetch('/api-v1/product/query',parameters)
        .then(res=>res.json())
        .then((data)=>{
            if (!data['success']) {
                console.log("Error");
                console.log(data);
                return;
            }
            console.log(data);
            let newData = shuffleArray(data['payload']);
            setItems(newData);
            setIsLoaded(true);
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const doSearch = ()=>{

    }
    
    // Initial Display Items
    
    // Replace this later with an api call that
    //   displays random products
    useEffect(()=>{
        fetch('/api-v1/product/0/9')
        .then(res=>res.json())
        .then((data)=>{
            if (!data['success']) {
                console.log("Error");
                console.log(data);
                return;
            }
            console.log(data);
            let newData = shuffleArray(data['payload']);
            setItems(newData);
            setIsLoaded(true);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

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
            <ProductTileDisplay isLoaded={isLoaded} items={items} />
            <hr />
        </>
    )
}

function shuffleArray(array) {
    const newArray = [...array];
  
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
  
    return newArray;
  }
