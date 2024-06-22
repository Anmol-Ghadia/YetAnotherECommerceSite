import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Cookies from 'js-cookie';

export default function AuthPage() {

    useEffect(()=>{
        const currentToken = Cookies.get('token');
        
        // If token exists then continue
        if (typeof currentToken !== 'string') {
            return;
        }

        fetch('/api-v1/auth/verify')
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
        <>
            <h1>Authentication Page</h1>
            <Outlet />
            <h1>end of auth page</h1>
        </>
    )
}
