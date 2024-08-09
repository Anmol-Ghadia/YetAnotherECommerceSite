import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Cookies from 'js-cookie';
import '../scss/pages/AuthPage.scss';

export default function AuthPage() {

    useEffect(()=>{
        const currentToken = Cookies.get('token');
        
        // If token exists then continue
        if (typeof currentToken !== 'string') {
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
                return;
            }
            window.location.href = '/user';
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

    return (
        <div id='main'>
            <div id="auth-container">
                <Outlet />
            </div>
        </div>
    )
}
