import React from 'react';
import './TopBar.css';


function TopBar() {

    const goToUserPage = () => {
        window.location.href = '/user';
    }

    const goToRoutePage = () => {
        window.location.href = '/';
    }

    return (
        <header>
            <div className="site-banner" onClick={goToRoutePage}>
                <span>LOGO</span>
                <span className="sitename">Sitename</span>
            </div>
            <div className="user-banner" onClick={goToUserPage}>
                <span>User Name</span>
                <span>IMAGE</span>
            </div>
        </header>
    )
}

export default TopBar;
