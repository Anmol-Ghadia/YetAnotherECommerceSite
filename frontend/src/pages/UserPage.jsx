import React from "react";
import TopBar from "../components/TopBar";
import { UserContext } from "../App";

export default function UserPage() {
    const user = React.useContext(UserContext);
    const [state, setState] = user;
    let out = (<></>);
    if (state.username === null) {
        setState({
            ...state,
            currentPage: "AuthenticationPage",
        })
    } else {
        out = (
            <>
                <TopBar />
                logged In! this will be user home page
            </>
        )
    }
    return (
    <>
    {out}
    </>
    );
}
