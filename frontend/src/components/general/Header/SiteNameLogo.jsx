import { useState } from "react";
import Logo from "../Logo"
import '../../../scss/components/general/Header/SiteNameLogo.scss';

export default function SiteNameLogo() {

    let [animate, setAnimate] = useState(false);
    const toggleAnimate = ()=>{
        setAnimate(!animate);
    }

    return (
        <span 
            id="site-name-logo" 
            onClick={()=>{window.location.href="/"}}
            onMouseEnter={toggleAnimate}
            onMouseLeave={toggleAnimate}>
            <span>E-commerce</span>
            <span><Logo size='6vh' doAnimate={animate} /></span>
        </span>
    )
}
