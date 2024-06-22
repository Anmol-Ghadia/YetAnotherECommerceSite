import React from "react";
import { Outlet } from "react-router-dom";


export default function AuthPage() {
    return (
        <>
            <h1>Authentication Page</h1>
            <Outlet />
            <h1>end of auth page</h1>
        </>
    )
}
