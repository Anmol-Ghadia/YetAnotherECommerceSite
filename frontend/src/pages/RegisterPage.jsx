import React, { useState } from "react";


export default function RegisterPage() {
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputFirstName, setInputFirstName] = useState('');
    const [inputLastName, setInputLastName] = useState('');
    const [inputAddress, setInputAddress] = useState('');
    const [inputPhone, setInputPhone] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputProfilePhoto, setInputProfilePhoto] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const doSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword,
                firstName: inputFirstName,
                lastName: inputLastName,
                address: inputAddress,
                phone: parseInt(inputPhone),
                email: inputEmail,
                profilePhoto: inputProfilePhoto
            })
        };
        fetch("/api-v1/auth/register",requestOptions)
        .then(res => res.json())
        .then(async (data) => {
            if (data['success']) {
                setErrorMessage("Registered!");
                window.location.href = '/auth';
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
            onChange={(e)=>{setInputPassword(e.target.value)}} />
            <br />
            First Name: <input
            type="text"
            id="input-first-name"
            value={inputFirstName}
            onChange={(e)=>{setInputFirstName(e.target.value)}} />
            <br />
            Last Name: <input
            type="text"
            id="input-last-name"
            value={inputLastName}
            onChange={(e)=>{setInputLastName(e.target.value)}} />
            <br />
            Address: <input
            type="text"
            id="input-address"
            value={inputAddress}
            onChange={(e)=>{setInputAddress(e.target.value)}} />
            <br />
            Phone: <input
            type="number"
            id="input-phone"
            value={inputPhone}
            onChange={(e)=>{setInputPhone(e.target.value)}} />
            <br />
            Email: <input
            type="email"
            id="input-email"
            value={inputEmail}
            onChange={(e)=>{setInputEmail(e.target.value)}} />
            <br />
            Profile Photo URL: <input
            type="text"
            id="input-profile-photo"
            value={inputProfilePhoto}
            onChange={(e)=>{setInputProfilePhoto(e.target.value)}} />
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
