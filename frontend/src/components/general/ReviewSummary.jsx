import { useEffect, useState } from "react"
import '../../scss/components/general/ReviewSummary.scss';

export function ReviewSummary({productId}) {

    const [stars,setStars] = useState([0,0,0,0,0]);
    const [reviewCount,setReviewCount] = useState(0);


    const getArrayFromStars = (num) => {
        let out = [0,0,0,0,0];
        let index = 0;
        while (num > 0) {
            if (num >= 1) {
                out[index] = 1;
                num--;
            } else {
                out[index] = 0.5;
                num -= 0.5;
            }
            index++;
        }
        setStars(out);
    }
    
    useEffect(()=>{
        fetch('/api-v1/review/product/stats/'+productId.toString())
        .then(res=>res.json())
        .then(body=>{
            if (!body['success']) {
                console.log('error fetching rating summary')
                return;
            }
            getArrayFromStars(body['payload']['rating']);
            setReviewCount(body['payload']['count']);
        })
        .catch(err=>{
            console.log('error fetching rating summary:',err);
        })
    })
    
    return (
        <>
        <div id="temp">
            {/* Review Count: {reviewCount}
            <br />
            Average Rating: {stars} */}
            <div id="star-conainer">
                {stars.map((element,index)=>{
                    switch (element) {
                        case 1:
                            return <img src="/star-solid.svg" key={index} />;
                        case 0:
                            return <img src="/star-regular.svg" key={index} />;
                        default:
                            return <img src="/star-half-stroke-solid.svg" key={index} />;
                    }
                })}
            </div>
            <div id="star-description">
                from {reviewCount} ratings
            </div>
        </div>
        </>
    )
}
