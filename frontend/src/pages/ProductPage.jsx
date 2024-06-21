import React, { useContext } from "react";
import { UserContext } from "../App";

export default function ProductPage() {
    const user = useContext(UserContext);
    const [state, setState] = user;
    
    return (
    <div className="Container">
        Product page for product No.: {state["selectedProduct"]}
    </div>
    );
}
