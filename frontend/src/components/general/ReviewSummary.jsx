import { useEffect, useState } from "react"

export function ReviewSummary({productId}) {

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
            Review Count: {reviewCount}
            <br />
            Average Rating: {stars}
        </>
    )
}
