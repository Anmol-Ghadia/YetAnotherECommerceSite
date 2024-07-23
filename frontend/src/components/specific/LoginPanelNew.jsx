import { useState } from 'react';
import '../../scss/components/specific/LoginPanelNew.scss';
import LeftButton from '../basic/LeftButton';
import TextInput from '../basic/TextInput';
import Logo from "../general/Logo";
import Button from '../basic/Button';
import Label from '../basic/Label';
import Cookies from 'js-cookie';

export default function LoginPanelNew() {

    let [isLogoHovered,setIsLogoHovered] = useState(false);
    
    let [username, setUsername] = useState('');
    let [usernameInvalid, setUsernameInvalid] = useState(false);

    let [password, setPassword] = useState('');
    let [passwordInvalid, setPasswordInvalid] = useState(false);

    let [formSuccess, setFormSuccess] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    // clears all user notifications after certain delay
    const waitAndResetState = async()=>{
        setTimeout(()=>{
            setUsernameInvalid(false);
            setPasswordInvalid(false);
        },1500);
        setTimeout(()=>{
            setErrorMessage(false);
        },6000);
    }

    // notifies user of invalid username
    const notifyUsernameInvalid = ()=>{
        setUsernameInvalid(true)
        setErrorMessage('Invalid Username');
        waitAndResetState();
    }

    // notifies user of invalid password
    const notifyPasswordInvalid = ()=>{
        setPasswordInvalid(true)
        setErrorMessage('Invalid Password');
        waitAndResetState();
    }

    // Interprets the response for type of error and notifies the user
    const interpretErrorMessageAndNotify = (str)=>{
        const usernameRegex = /username/
        if (usernameRegex.test(str.toLowerCase())) {
            notifyUsernameInvalid();
            return;
        }
        const passwordRegex = /password/
        if (passwordRegex.test(str.toLowerCase())) {
            notifyPasswordInvalid();
            return;
        }
        setErrorMessage(str);
        waitAndResetState();
    }

    // Saves user data on device
    const handleUserLogin = (data)=>{
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
    }

    const handleSuccesAndExit = ()=>{
        setFormSuccess(true);
        setTimeout(()=>{
            window.location.href = '/user'
        },1500);
    }

    // Submits user credentials for authentication
    const doSubmit = ()=>{
        // Data Validation for username
        const validCharsUsername = /^[a-zA-Z0-9()_\-.!@#$%^&\*]*$/
        var usernameValid = validCharsUsername.test(username);
        usernameValid &&= username.length <= 25;
        usernameValid &&= username.length >= 5;

        if (!usernameValid) {
            notifyUsernameInvalid();
            return;
        }

        // Data Validation for password
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
                handleUserLogin(data);
                handleSuccesAndExit();
                return;
            }
            interpretErrorMessageAndNotify(data['payload']['description'])
            
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
                invalid={usernameInvalid}
                success={formSuccess}/>
            <TextInput
                setFunction={setPassword}
                placeholder={'Password'}
                type={'password'}
                invalid={passwordInvalid}
                success={formSuccess}/>
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
