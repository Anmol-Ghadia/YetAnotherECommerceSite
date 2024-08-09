import React, { useState } from "react";
import Cookies from 'js-cookie';
import '../../scss/components/specific/LoginPanel.scss';
import Logo from "../general/Logo";
import Button from '../basic/Button';
import ExampleTSComponent from '../basic/ExampleTSComponent.tsx';

export default function LoginPanel() {
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [responseReceived, setResponseReceived] = useState(false);
    const [usernameIncorrect, setUsernameIncorrect] = useState(true);
    const [passwordIncorrect, setPasswordIncorrect] = useState(true);

    const doSubmit = () => {
        // Data Validation
        // Username -> [5-25]
        const validCharsUsername = /^[a-zA-Z0-9()_\-.!@#$%^&\*]*$/
        var usernameValid = validCharsUsername.test(inputUsername);
        usernameValid &&= inputUsername.length <= 25;
        usernameValid &&= inputUsername.length >= 5;

        if (!usernameValid) {
            setErrorMessage("Username Invalid");
            setTimeout(()=>{setErrorMessage('')},6000);
            return;
        }

        // Data Validation
        // password -> [8-25]
        const validCharsPassword = /^[a-zA-Z0-9()_\-,. !@#$%^&\*]*$/
        var passwordValid = validCharsPassword.test(inputPassword);
        passwordValid &&= inputPassword.length <= 25;
        passwordValid &&= inputPassword.length >= 8;

        if (!passwordValid) {
            setErrorMessage("Password Invalid");
            setTimeout(()=>{setErrorMessage('')},6000);
            return;
        }


        // Send data
        setSubmitClicked(true)
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
            setResponseReceived(true);
            if (data['success']) { // Success
                setUsernameIncorrect(false);
                setPasswordIncorrect(false);
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
                setErrorMessage("Log In success!");
                setTimeout(()=>{
                    window.location.href = '/user'
                },1000);
            } else { // Failure
                const error = data['payload']['message'];
                if (error == "General Error") {
                    const errorDescription = data['payload']['description'];
                    setErrorMessage(errorDescription);
                    if (errorDescription == 'invalid password') {
                        setPasswordIncorrect(true);
                    } else if (errorDescription == 'invalid username') {
                        setUsernameIncorrect(true);
                        setPasswordIncorrect(true);
                    } else {
                        setPasswordIncorrect(true);
                        setUsernameIncorrect(true);
                    }
                } else {
                    setPasswordIncorrect(true);
                    setUsernameIncorrect(true);
                    setErrorMessage("Unexpected error");
                }

                // Reset State
                resetState();
            }
        })
        .catch(error => {
            setErrorMessage('Server unresponsive :(');
            resetState();
            
            console.error(error)
        });
    }

    // Sets a timeout to reset state in few seconds
    function resetState() {
        setTimeout(()=>{
            setSubmitClicked(false);
            setUsernameIncorrect(false);
            setPasswordIncorrect(false);
            setResponseReceived(false)
        },1000);
        setTimeout(()=>{
            setErrorMessage('');
        },6000);
    }

    function toggleVisiblity() {
        setPasswordVisible(!passwordVisible)
    }

    return (
        <div id="login-contianer">
            <ExampleTSComponent title={"Hello this is a example ts component"}/>
            <div id="panel-header" onClick={()=>{window.location.href = '/'}}>
                    <Logo size={'20%'} />
                Log In
            </div>

            <div id="panel-body">
            <div 
                className={"panel-input-field " + 
                    (submitClicked? "panel-input-field-expand-cover ":" ")}>
                <div 
                    className={"panel-input-expander " +
                        (responseReceived? 
                            usernameIncorrect? "fail ": "success "
                        :' ') }></div>
                <div className="image">
                    <img src="/user-solid.svg" alt="username" />
                </div>
                <input
                    type="text"
                    id="input-username"
                    value={inputUsername}
                    placeholder="Enter Username Here"
                    onChange={(e)=>{setInputUsername(e.target.value)}}/>
            
            </div>
            <div 
                id="panel-password-input" 
                className={"panel-input-field " + 
                    (submitClicked? "panel-input-field-expand-cover ":" ")
                    }>
                <div 
                    className={"panel-input-expander " +
                            (responseReceived? 
                                passwordIncorrect? "fail ": "success "
                            : ' ') }></div>
                <div className="image">
                    <img src="/lock-solid.svg" alt="username" />
                </div>
                <input
                    type={passwordVisible? "text":"password"}
                    id="input-password"
                    value={inputPassword}
                    placeholder="Password Here"
                    onChange={(e)=>{setInputPassword(e.target.value)}}/>
                <img
                    id="password-eye-symbol"
                    className={submitClicked? 'hide':''}
                    src={passwordVisible? "/eye-slash.svg":"/eye.svg"}
                    alt="username"
                    onClick={toggleVisiblity}/>
            </div>

            <div id="panel-error">{errorMessage}</div>
            <Button
                onClick={doSubmit}
                content={'Login'}/>
            <span id='register-now-container'>
                Don't have an account?
            <a href="/auth/register">Click to Resgister</a>
            </span>
            </div>
        </div>
    )
}
