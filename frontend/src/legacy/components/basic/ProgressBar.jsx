import { useEffect, useState } from 'react';
import '../../scss/components/basic/ProgressBar.scss';


// Represents a Progress bar with number of 'fractions' and 
//   current 'state'
// fractions is a number (statring from 1)
// state is the current fraction (0 indexed)
export default function ProgressBar({fractions, state}) {
    
    let [elements,setElements] = useState('');

    useEffect(()=>{
        setElements(Array(fractions).fill(null).map((_, index)=>{
            if (index<state) {
                return <div key={index} className='completed-bar'></div>;
            } else if (state==index) {
                return <div key={index} className='current-bar'></div>;
            }
            return <div key={index} className='incomplete-bar'></div>;
        }))
    },[state]);

    return (
    <div
    id="page-progress-container"
    data-stage={state}
    style={{gridTemplateColumns: `repeat(${fractions},1fr)`}}>
        {elements}
    </div>
    )
}