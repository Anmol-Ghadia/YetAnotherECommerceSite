import React, { useState } from "react";
import Cookies from 'js-cookie';
import SiteNameLogo from "./Header/SiteNameLogo";
import '../../scss/components/general/Header.scss';
import DropDown from "./Header/DropDown";

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
        <div id='header-container'>
            <span id="header-left-container">
                <DropDown />
                <SiteNameLogo />
            </span>
            <span id="header-right-container">
                {isloggedin? 
                    loggedInContent:
                    loggedOutContent       
                }
            </span>
        </div>
    )
}
