import { useEffect, useState } from 'react';
import '../../scss/components/general/ReviewStars.scss';

// Returns a star graphic with given stars
export function ReviewStars({stars}) {

    const [starList,setStarList] = useState([0,0,0,0,0]);

    const updateStarList = (num) => {
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
        setStarList(out);
    }

    useEffect(()=>{
        updateStarList(stars);
    },[stars])


    return (
        <div id="star-conainer">
            {starList.map((element,index)=>{
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
    )
}