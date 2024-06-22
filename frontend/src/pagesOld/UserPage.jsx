import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { UserContext } from "../App";
import Cookies from 'js-cookie';

export default function UserPage() {
    
    const user = React.useContext(UserContext);
    const [state, setState] = user;

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(()=>{
        fetch('/api-v1/auth/verify')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data['success']) {
                // Authenticated user
                console.log("user is authenticated");
                setIsLoaded(true);
            } else {
                console.log("user is  NOT authenticated");
                // redirect to authentication page
                setState({
                    ...state,
                    currentPage: "AuthenticationPage",
                })
                setIsLoaded(true);
            }
        })
    })

    const doLogout = () => {
        Cookies.remove('token');
        setState(({
            ...state,
            currentPage: "AuthenticationPage",
            username: null
        }))
    }

    const homePageContent = (
        <>
        <h1>Home Page</h1>
        <p>Display user information here</p>
        <input 
            type="button"
            value="Logout"
            onClick={doLogout}/>
        </>
    )

    return (
        <>
        <TopBar />
        {isLoaded? homePageContent :'Loading...'}
        </>
    );
}
