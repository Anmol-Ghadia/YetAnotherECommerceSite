import { useEffect, useState } from "react"
import { ReviewStars } from "../general/ReviewStars";
import '../../scss/components/specific/ProductReviewSummary.scss';

// Returns a specific product's review summary for the product page 
export function ProductReviewSummary({productId}) {

    const [stars,setStars] = useState(0);
    const [reviewCount,setReviewCount] = useState(0);

    useEffect(()=>{
        fetch('/api-v1/review/product/stats/'+productId.toString())
        .then(res=>res.json())
        .then(body=>{
            if (!body['success']) {
                console.log('error fetching rating summary')
                return;
            }
            setStars(body['payload']['rating']);
            setReviewCount(body['payload']['count']);
        })
        .catch(err=>{
            console.log('error fetching rating summary:',err);
        })
    })
    
    return (
        <>
        <div id="stars-container">
            <ReviewStars stars={stars}/>
            <div id="star-description">
                from {reviewCount} ratings
            </div>
        </div>
        </>
    )
}
