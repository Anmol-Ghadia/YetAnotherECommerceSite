import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { ReviewItem } from './ReviewItem';

export function ReviewDisplay({productId}) {
    const [reviews, setReviews] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(()=>{
        fetch(`/api-v1/review/product/`+productId.toString())
        .then(res=>res.json())
        .then((data)=>{
            if (!data['success']) {
                return;
            }
            setIsLoaded(true);
            setReviews(data['payload']);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);


    return (
        <>
            {isLoaded? reviews.map((review)=> {
               return <ReviewItem key={review.username} review={review}/>
            }): 
            "Loading Reviews"}
        </>
    )
}
