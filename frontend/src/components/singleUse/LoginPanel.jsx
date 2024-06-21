import React, { useContext, useState } from "react";
import { UserContext } from "../../App";
import Cookies from 'js-cookie';

export default function LoginPanel() {
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
        fetch("/api-v1/auth/login",requestOptions)
        .then(response => response.json())
        .then(async (data) => {
            if (data['success']) {
                const token = data['payload']['token'];
                const validFor = data['payload']['validity'];
                console.log(data);
                const options = {
                    expires: (validFor/(1*60*60*24)),
                    secure: false, // TRUE in Production !!!
                }
                Cookies.set('token',token, options);
                setErrorMessage("logged In!");
                setState(({
                    ...state,
                    currentPage: "UserPage",
                    username: inputUsername
                }))
            } else {
                setErrorMessage(data['payload']['message']);
            }
        })
        .catch(error => console.error(error));
    }

    const goToRegister = () => {
        setState(({
            ...state,
            currentPageState: 1
        }))
    }

    return (
    <>
        <h1>Login Page</h1>
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
        <button type="button" onClick={submitForm}>log in</button>
        <div className="register-now" onClick={goToRegister}>Register</div>
    </>
    );
}
