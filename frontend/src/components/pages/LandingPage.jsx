import React, { useState } from "react";
import '../../scss/components/pages/LandingPage.scss';
import Logo from '../general/Logo';

export default function LandingPage() {
    let [isLogoHovered,setIsLogoHovered] = useState(false);

    const toggleIsLogoHovered = ()=>{
        setIsLogoHovered(!isLogoHovered);
    }

    return (
        <>
            <div id='page-1'>
                <div id='logo-container' onMouseEnter={toggleIsLogoHovered} onMouseLeave={toggleIsLogoHovered}>
                    <Logo size={'30vh'} doAnimate={isLogoHovered} />
                </div>
                <div id='gradient'>E-Commerce Site</div>
            </div>           
        </>
    )
}
