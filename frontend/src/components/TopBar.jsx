import React from 'react';
import './TopBar.css';
import { UserContext } from "../App";

function TopBar() {
    const user = React.useContext(UserContext);
    const [state, setState] = user;
    const goToUserPage = () => {
        setState(({
            ...state,
            currentPage: "UserPage",
            currentPageState: 0
        }))
    }

    const goToRoutePage = () => {
        setState(({
            ...state,
            currentPage: "SearchPage",
            currentPageState: 0
        }))
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
