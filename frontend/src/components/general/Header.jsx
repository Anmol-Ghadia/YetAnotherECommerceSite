import React from "react";
import Cookies from 'js-cookie';

export default function Header() {

    let username = window.localStorage.getItem('username');

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
            <p>Logged in as {username}</p>
            <span onClick={doLogout}>Logout</span>
        </>
    )
 
    return (
        <>
            <h1>Header</h1>
            {isloggedin? 
                loggedInContent:
                loggedOutContent       
            }
            <hr />
        </>
    )
}
