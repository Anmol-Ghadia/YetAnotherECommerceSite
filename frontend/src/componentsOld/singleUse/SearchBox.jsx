import React from "react";
import ItemDisplayTile from '../ItemDisplayTile.jsx';
import './SearchBox.css'

function SearchBox() {
    const [tiles, setTiles] = React.useState(null);

    React.useEffect(() => {
        fetch("/api-v1/product/1/6")
        .then((res) => res.json()) // Parse JSON asynchronously
        .then((data) => {
            setTiles(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, [])

    return (
        <div className="display-container">
            {tiles ? tiles.map((item, index) => (
            <ItemDisplayTile key={item.productId} data={item} />
            )) : 'Loading data...'}
        </div>
    );
}

export default SearchBox;
