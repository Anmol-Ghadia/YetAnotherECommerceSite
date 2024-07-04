import React from "react";
import Cookies from 'js-cookie';
import Logo from "./Logo";

export default function Header() {

    let username = window.localStorage.getItem('username');
    let firstName = window.localStorage.getItem('firstName');

    let isloggedin = typeof Cookies.get('token') === 'string';

    const doLogout = ()=>{
        window.localStorage.removeItem('username');
        Cookies.remove('token');
        window.location.href = '/';
    }

    const loggedOutContent = (
        <>
            <p>currently logged out</p>
        </>
    )

    const loggedInContent = (
        <>
            <p>Welcome {firstName}!</p>
            <span onClick={doLogout}>Logout</span>
        </>
    )
 
    return (
        <>
            <span><Logo size='30px' doAnimate={false} /></span>
            <span>Ordinary E-commerce Site</span>
            {isloggedin? 
                loggedInContent:
                loggedOutContent       
            }
            <hr />
        </>
    )
}
