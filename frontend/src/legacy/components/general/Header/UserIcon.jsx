import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import '../../../scss/components/general/Header/UserIcon.scss';

export default function UserIcon() {

    const removeUserDetails = ()=> {
        Cookies.remove('token');
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('firstName');
        window.localStorage.removeItem('lastName');
        window.localStorage.removeItem('profilePhoto');

    }

    useEffect(()=>{
        const currentToken = Cookies.get('token');
        
        // If token exists then continue
        if (typeof currentToken !== 'string') {
            removeUserDetails();
            return;
        }

    },[]);

    const doLogout = ()=>{
        removeUserDetails();
        window.location.href = '/';
    }

    let isloggedin = typeof Cookies.get('token') === 'string';

    let savedUsername = window.localStorage.getItem('username');
    let savedFirstName = window.localStorage.getItem('firstName');
    let savedLastName = window.localStorage.getItem('lastName');
    let savedProfilePhoto = window.localStorage.getItem('profilePhoto');

    let [userPanelVisible, setUserPanelVisible] = useState(false);

    const toggleUserPanel = () => {
        setUserPanelVisible(!userPanelVisible);
    }

    const miniDisplay = (
        <div id='mini-display'>
            <div>{savedFirstName?savedFirstName:null} {savedLastName?savedLastName.length>1?savedLastName.substring(0,1):null:null}</div>
            <div id='mini-display-username'>{savedUsername}</div>
        </div>
    )
    const miniDisplayLoggedOut = (
        <div id='mini-display'>
            <div>First Name</div>
            <div id='mini-display-username'>user-name</div>
        </div>
    )

    const userPanelDisplay = (
        <div id="user-panel-display" onMouseLeave={toggleUserPanel}>
            <a href="/user">User Page</a><br />
            <div onClick={doLogout}>Logout</div>
        </div>
    )
    const defaultProfilePhoto = '/user.png';

    return (
        <div id='user-container' onClick={toggleUserPanel}>
            {isloggedin? miniDisplay : miniDisplayLoggedOut}
            <div id="user-icon" style={{backgroundImage: `url(${isloggedin?savedProfilePhoto:defaultProfilePhoto})`}}></div>
            {userPanelVisible? userPanelDisplay : null}
        </div>
    )

}
