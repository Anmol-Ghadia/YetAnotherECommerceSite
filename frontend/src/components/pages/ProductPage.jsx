import React, { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { useParams } from "react-router-dom";
import ProductBuyButton from "../specific/ProductBuyButton";
import { ReviewDisplay } from "../general/ReviewDisplay";
import { ProductReviewSummary } from "../specific/ProductReviewSummary";
import '../../scss/components/pages/ProductPage.scss';

export default function ProductPage() {
    let params = useParams();
    let productId = params.productId;

    let isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
    let [prod , setProd] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);
    let [mainImage, setMainImage] = useState("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdevelopers.elementor.com%2Fdocs%2Fassets%2Fimg%2Felementor-placeholder-image.png&f=1&nofb=1&ipt=949dfac48a9efa8410cc6a84a0b6820180c16cf41136ea19d9786b700f7c6ea6&ipo=images");

    useEffect(()=>{

        fetch("/api-v1/product/"+productId.toString())
        .then((res) => res.json()) // Parse JSON asynchronously
        .then((obj) => {
            if (obj['success']) {
                setIsLoaded(true);
                setProd(obj['payload']);
                if (obj['payload']['images'] != 0) setMainImage(obj['payload']['images'][0]);
                return;
            }
            console.log(obj);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });

    },[]);


    const link1 = 'https://picsum.photos/300/300';
    function changeImage(index) {
        return ()=> {
            setMainImage(prod.images[index]);
        }
    }

    return (
            <>
            {isLoaded?
                (isPortrait?
            <>
                <div id="product-title">{prod.name}</div>
                <div id="image-container">
                    <img src={mainImage} alt="product image" />
                </div>
                <div id="product-overview-bar">
                    <div id="image-array">
                        {
                            prod==null? '' :
                            prod.images.map((url,index)=> {
                                return (
                                    <>
                                        <div
                                        onClick={changeImage(index)} className="image-array-single-container">
                                            <img className="image-array-image" src={url} alt="product image" key={index} />
                                        </div>
                                        {
                                            prod.images.length-1 == index? 
                                            <></>:
                                            <div className="image-array-spacer"></div>
                                        }
                                    </>
                                );
                            })
                        }
                    </div>
                    <div id="price-review-container">
                        <span id="price-display">${prod.price}</span>
                        <ProductReviewSummary productId={productId} />
                    </div>
                </div>
                <div id="product-main-description">
                    <p>This is a short description of the product, to catch consumer's attention</p>
                    <div id="product-buy-button-container">
                        <ProductBuyButton prod={prod} />
                    </div>
                </div>
                <div className="description-container">
                    <p>{prod.description}</p>
                </div>
                <div className="description-container">
                    <p>{prod.description}</p>
                </div>
                <div className="description-container">
                    <p>{prod.description}</p>
                </div>
                <div className="sold-by-container">
                    <p>Sold by <i><b>{prod.username}</b></i></p>
                </div>
                <h2>Reviews</h2>
                <ReviewDisplay productId={productId} />
            </>:
            <>
                <div id="product-title">{prod.name}</div>
                <div id="image-array-container">
                    <div id="image-array">
                        {
                            prod==null? '' :
                            prod.images.map((url,index)=> {
                                return (
                                    <>
                                        <div
                                        onClick={changeImage(index)} className="image-array-single-container">
                                            <img className="image-array-image" src={url} alt="product image" key={index} />
                                        </div>
                                        {
                                            prod.images.length-1 == index? 
                                            <></>:
                                            <div className="image-array-spacer"></div>
                                        }
                                    </>
                                );
                            })
                        }
                    </div>
                    <div id="image-container">
                        <img src={mainImage} alt="product image" />
                    </div>
                    <div id="right-panel">
                        <div id="right-panel-above">
                            <span id="price-display">${prod.price}</span>
                            <div className="image-array-spacer"></div>
                            <div id="product-average-rating-container">
                                <ProductReviewSummary productId={productId} />
                            </div>
                            <div className="image-array-spacer"></div>
                            <div id="product-buy-button-container">
                                <ProductBuyButton prod={prod} />
                            </div>
                            
                        </div>
                        <div id="right-panel-below">
                            <p id="main-description">This is a short description of the product, to catch consumer's attention</p>
                            <div className="sold-by-container">
                                <p>Sold by <i><b>{prod.username}</b></i></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="description-container">
                    <p>{prod.description}</p>
                </div>
                <div className="description-container">
                    <p>{prod.description}</p>
                </div>
                <div className="description-container">
                    <p>{prod.description}</p>
                </div>
                <h2>Reviews</h2>
                <ReviewDisplay productId={productId} />
            </>)
            :'Loading...'}
        </>
    )
}
