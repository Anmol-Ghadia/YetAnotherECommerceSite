import React, { useContext } from "react";
import { UserContext } from "../App";
import TopBar from "../components/TopBar";

export default function ProductPage() {
    const user = React.useContext(UserContext);
    const [state, setState] = user;
    
    return (
    <div className="Container">
        <TopBar />
        Product page for product No.: {state["selectedProduct"]}
    </div>
    );
}
