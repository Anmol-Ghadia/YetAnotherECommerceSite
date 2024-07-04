import React from "react";
import '../scss/pages/LandingPage.scss';
import Logo from "../components/general/Logo";

export default function LandingPage() {
    return (
        <>
            <h1>Landing Page</h1>
            <Logo size='500px' doAnimate={true} />
        </>
    )
}
