import { useState } from "react";
import '../../../scss/components/general/Header/DropDown.scss';

export default function DropDown() {

    let [dropDownShown, setDropDownShown] = useState(false);

    const toggleDropDown = () => {
        setDropDownShown(!dropDownShown);
    }

    const dropDown = (
        <div id='drop-down-container' onMouseLeave={toggleDropDown}>
            <a href="/">Landing Page</a><br />
            <a href="/browse">Browse products</a><br />
            <a href="/browse/product/0">specific product</a><br />
            <a href="/user">User Page</a><br />
            <a href="/user/cart">User's cart</a><br />
            <a href="/auth">Login for user</a><br />
            <a href="/auth/register">register new user</a><br />
        </div>
    )

    return (
        <>
            <div id="dropdown-burger" onClick={toggleDropDown} onMouseEnter={toggleDropDown}>
                <div id='burger-top'></div>
                <div id='burger-middle'></div>
                <div id='burger-bottom'></div>
            </div>
            {dropDownShown? dropDown: null}
        </>
    );
}
