import React, { useState } from "react";


export default function RegisterPage() {
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const doSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword
            })
        };
        fetch("/api-v1/auth/register",requestOptions)
        .then(res => res.json())
        .then(async (data) => {
            if (data['success']) {
                setErrorMessage("Registered!");
                window.location.href = '/login';
            } else {
                setErrorMessage(data['payload']['message']);
            }
        })
        .catch(error => console.error(error));
    }


    return (
        <>
            <hr />
            <h1>Users will register Here</h1>
            Username: <input
            type="text"
            id="input-username"
            value={inputUsername}
            onChange={(e)=>{setInputUsername(e.target.value)}}/>
            <br />
            Password: <input
            type="password"
            id="input-password"
            value={inputPassword}
            onChange={(e)=>{setInputPassword(e.target.value)}}/>
            <br />
            <div>Response: {errorMessage}</div>
            <button onClick={doSubmit}>Register</button>
            <span 
            onClick={()=>{window.location.href='/auth'}}>
                Login
            </span>
            <hr />
        </>
    )
}
