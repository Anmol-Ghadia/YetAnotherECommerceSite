import React, { useState } from "react";
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const doSubmit = () => {
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword
            })
        };
        fetch("/api-v1/auth/login",parameters)
        .then(res => res.json())
        .then((data) => {
            if (data['success']) {
                console.log(data);
                const token = 'Bearer ' + data['payload']['token'];
                const validFor = data['payload']['validity'];
                const cookieParameters = {
                    expires: (validFor/(1*60*60*24)),
                    secure: false, // TRUE in Production !!!
                }
                const user = data['payload']['user'];
                window.localStorage.setItem('username',user['username']);
                window.localStorage.setItem('firstName',user['firstName']);
                window.localStorage.setItem('lastName',user['lastName']);
                window.localStorage.setItem('profilePhoto',user['profilePhoto']);
                Cookies.set('token',token, cookieParameters);
                setErrorMessage("logged In!");
                window.location.href = '/user'
            } else {
                setErrorMessage(data['payload']['message']);
            }
        })
        .catch(error => console.error(error));

        
    }

    return (
        <>
            <hr />
            <h1>Users will login here</h1>
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
            <button onClick={doSubmit}>Login</button>
            <span 
            onClick={()=>{window.location.href='/auth/register'}}>
                Register
            </span>
            <hr />
        </>
    )
}
