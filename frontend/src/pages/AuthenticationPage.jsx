import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import TopBar from "../components/TopBar";

export default function AuthenticationPage() {
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
        // .then(response => response.json())
        .then(async (data) => {
            // Temporary, Send JSON from backend !!!
            console.log(data);
            const result = await data.body.getReader().read();

            const decoder = new TextDecoder('utf-8');
            const decodedString = decoder.decode(result.value);
            setErrorMessage(decodedString);
        })
        .catch(error => console.error(error));
    }

    return (
    <div className="Container">
        <TopBar />
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
    </div>
    );
}
