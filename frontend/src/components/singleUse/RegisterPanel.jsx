import React, { useContext, useState } from "react";
import { UserContext } from "../../App";
import Cookies from 'js-cookie';

export default function RegisterPanel() {
    // Context
    const user = React.useContext(UserContext);
    const [state, setState] = user;

    // Page states
    const [inputUsername,setInputUsername] = useState('');
    const [inputPassword,setInputPassword] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    const submitForm = () => {
        const data = {
            username: inputUsername,
            password: inputPassword
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch("/api-v1/auth/register",requestOptions)
        .then(response => response.json())
        .then(async (data) => {
            if (data['success']) {
                console.log(data);
                setErrorMessage("Registered!");
                setState(({
                    ...state,
                    currentPageState: 0
                }))
            } else {
                setErrorMessage(data['payload']['message']);
            }
        })
        .catch(error => console.error(error));
    }

    const goToLogin = () => {
        setState(({
            ...state,
            currentPageState: 0
        }))
    }

    return (
    <>
        <h1>Registration Page</h1>
        <input
            type="text"
            name="username_input"
            id="username_input"
            value={inputUsername}
            onChange={(e)=>{setInputUsername(e.target.value)}}
        />
        <br />
        <input
            type="text"
            name="password_input"
            id="password_input"
            value={inputPassword}
            onChange={(e)=>{setInputPassword(e.target.value)}}
        />
        <br />
        <span>{errorMessage}</span>
        <br />
        <button type="button" onClick={submitForm}>Register</button>
        <div className="register-now" onClick={goToLogin}>Log in</div>
    </>
    );
}
