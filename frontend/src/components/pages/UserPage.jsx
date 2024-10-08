import React, { useEffect } from "react";
import Cookies from 'js-cookie';

export default function UserPage() {

    
    // Redirect if not registered
    const goToLogin = ()=>{
        window.location.href = '/auth';
    }

    useEffect(()=>{
        const currentToken = Cookies.get('token');
        
        // If token exists then continue
        if (typeof currentToken !== 'string') {
            goToLogin();
            return;
        }

        const requestOptions = {
            headers: { 'Authorization': currentToken },
        };

        fetch('/api-v1/auth/verify',requestOptions)
        .then(res=>res.json())
        .then((data)=>{
            // Invalid token
            if (!data['success']) {
                Cookies.remove('token');
                goToLogin();
                return;
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);


    return (
        <h1>User Progile Page</h1>
    )
}
