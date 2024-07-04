import React, { useState } from "react";
import Cookies from 'js-cookie';
import '../../../scss/components/general/Header/UserIcon.scss';

export default function UserIcon() {

    let isloggedin = typeof Cookies.get('token') === 'string';

    const doLogout = ()=>{
        window.localStorage.removeItem('username');
        Cookies.remove('token');
        window.location.href = '/';
    }

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
            <div>{savedFirstName} {savedLastName.length>1?savedLastName.substring(0,1):''}</div>
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
    const defaultProfilePhoto = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';

    return (
        <div id='user-container' onClick={toggleUserPanel}>
            {isloggedin? miniDisplay : miniDisplayLoggedOut}
            <div id="user-icon" style={{backgroundImage: `url(${isloggedin?savedProfilePhoto:defaultProfilePhoto})`}}></div>
            {userPanelVisible? userPanelDisplay : null}
        </div>
    )

}
