import React, { useContext, useState } from "react";
import TopBar from "../components/TopBar";
import LoginPanel from "../components/singleUse/LoginPanel";
import RegisterPanel from "../components/singleUse/RegisterPanel";
import { UserContext } from "../App";

export default function AuthenticationPage() {
    
    const user = React.useContext(UserContext);
    const [state, setState] = user;

    let subPage = (<h1>state not set</h1>);

    switch (state['currentPageState']) {
        case 0: // Login Page
            subPage = (<LoginPanel/>)
            break;
        case 1: // Register Page
            subPage = (<RegisterPanel />);
            break;
    
        default:
            subPage = (<LoginPanel/>)
            break;
    }


    return (
    <div className="Container">
        <TopBar />
        {subPage}
    </div>
    );
}