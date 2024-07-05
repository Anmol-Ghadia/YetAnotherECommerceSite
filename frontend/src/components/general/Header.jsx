import SiteNameLogo from "./Header/SiteNameLogo";
import '../../scss/components/general/Header.scss';
import DropDown from "./Header/DropDown";
import UserIcon from "./Header/UserIcon";

export default function Header() {
 
    return (
        <>
            <div id='header-container'>
                <span id="header-left-container">
                    <DropDown />
                    <SiteNameLogo />
                </span>
                <div></div>
                <span id="header-right-container">
                <UserIcon />
                </span>
            </div>
            <div id="header-separator"></div>
        </>
    )
}
