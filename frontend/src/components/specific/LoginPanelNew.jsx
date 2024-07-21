import { useState } from 'react';
import '../../scss/components/specific/LoginPanelNew.scss';
import LeftButton from '../basic/LeftButton';
import TextInput from '../basic/TextInput';
import Logo from "../general/Logo";
import Button from '../basic/Button';
import Label from '../basic/Label';

export default function LoginPanelNew() {

    let [username, setUsername] = useState('');
    let [usernameInvalid, setUsernameInvalid] = useState(false);

    let [password, setPassword] = useState('');
    let [passwordInvalid, setPasswordInvalid] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');
    let [isLogoHovered,setIsLogoHovered] = useState(false);

    const waitAndResetState = async()=>{
        setTimeout(()=>{
            setUsernameInvalid(false);
            setPasswordInvalid(false);
        },1500);
        setTimeout(()=>{
            setErrorMessage(false);
        },6000);
    }

    const notifyUsernameInvalid = ()=>{
        setUsernameInvalid(true)
        setErrorMessage('Invalid Username');
        waitAndResetState();
    }
    const notifyPasswordInvalid = ()=>{
        setPasswordInvalid(true)
        setErrorMessage('Invalid Password');
        waitAndResetState();
    }

    const doSubmit = ()=>{
        // Data Validation
        // Username -> [5-25]
        const validCharsUsername = /^[a-zA-Z0-9()_\-.!@#$%^&\*]*$/
        var usernameValid = validCharsUsername.test(username);
        usernameValid &&= username.length <= 25;
        usernameValid &&= username.length >= 5;

        if (!usernameValid) {
            notifyUsernameInvalid();
            return;
        }

        // Data Validation
        // password -> [8-25]
        const validCharsPassword = /^[a-zA-Z0-9()_\-,. !@#$%^&\*]*$/
        var passwordValid = validCharsPassword.test(password);
        passwordValid &&= password.length <= 25;
        passwordValid &&= password.length >= 8;

        if (!passwordValid) {
            notifyPasswordInvalid();
            return;
        }

        // Send data
        const parameters = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        };
        fetch("/api-v1/auth/login",parameters)
        .then(res => res.json())
        .then((data) => {
            if (data['success']) { // Success
                setErrorMessage('success');
                // TODO !!!
                return;
            }
            // TODO !!!
            // Mark password or username as invalid based on received response
            setErrorMessage(data['payload']['description'])
            waitAndResetState();
        })
        .catch(error => {
            setErrorMessage('Server unresponsive :(');
            console.error(error)
        });
    }

    const floating = (
        <>
            <div id="back-button-container">
                <LeftButton />
            </div>
            <div
                id="logo-container"
                onMouseEnter={()=>{setIsLogoHovered(true)}}
                onMouseLeave={()=>{setIsLogoHovered(false)}}>
                <Logo
                    size={'100px'}
                    doAnimate={isLogoHovered}/>
            </div>
        </>)

    const form = (
        <div id="form">
            <Label
                center={true}
                content={<h1>Login</h1>}/>
            <TextInput
                setFunction={setUsername}
                placeholder={'Username'}
                invalid={usernameInvalid}/>
            <TextInput
                setFunction={setPassword}
                placeholder={'Password'}
                type={'password'}
                invalid={passwordInvalid}/>
            <Label
                center={true}
                content={errorMessage}/>
            <div className="center">
                <Button 
                    onClick={doSubmit}
                    content={'submit'}
                    fill={true}/>
            </div>
        </div>)

    const footer = (
        <>
            <span id='register-now-container'>
                Don't have an account?
            </span>
            <a href="/auth/register">Click to Resgister</a>
        </>)


    return (
    <div id="login-container">
        {floating}
        
        <div class='login-top-spacer'></div>
        {form}
        <Label
            content={footer}
            center={true}/>
    </div>);
}
