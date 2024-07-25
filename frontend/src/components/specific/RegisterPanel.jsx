import React, { useEffect, useState } from "react";
import '../../scss/components/specific/RegisterPanel.scss';
import ProgressBar from '../basic/ProgressBar';
import Button from '../basic/Button';
import TextInput from "../basic/TextInput";
import Label from "../basic/Label";
import LeftButton from "../basic/LeftButton";
import Logo from "../general/Logo";

export default function RegisterPanel() {
    // basic information
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    // Helpers
    const [appartmentNumber, setAppartmentNumber] = useState('');
    const [pincode, setPincode] = useState('');
    const [streetName, setStreetNumber] = useState('');
    const [country, setCountry] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    
    // Data Validation notification
    const [lastNameInvalid, setLastNameInvalid] = useState(false);
    const [phoneInvalid, setPhoneInvalid] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    
    const [pincodeInvalid, setPincodeInvalid] = useState(false);
    const [countryInvalid, setCountryInvalid] = useState(false);
    
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [passwordRepeatInvalid, setPasswordRepeatInvalid] = useState(false);

    // Page related
    const [currentSubPanel, setCurrentSubPanel] = useState(0);
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    const timeReset = 2000; // Time to reset invalid state
    const doNothing = ()=>{}; // Do nothing function call

    const header = (
        <>
            <div
                id="logo-container"
                onMouseEnter={()=>{setIsLogoHovered(true)}}
                onMouseLeave={()=>{setIsLogoHovered(false)}}>
                <Logo
                    size={'100px'}
                    doAnimate={isLogoHovered}/>
            </div>
            <div className="spacer"></div>
            <div className="spacer"></div>
            <div className="spacer"></div>
        </>
    )

         // Checks required data for page one,
    //   if unsuccessful returns false and displays notification
    //   if successful returns true
    const doPageZeroDataValidation = ()=>{
        const bool1 = lastName.length != 0;
        const bool2 = email.length != 0;
        const bool3 = phone.toString().length != 0;
        if (bool1 && bool2 && bool3) {
            return true;
        } else {
            !bool1? setLastNameInvalid(true):doNothing();
            !bool2? setEmailInvalid(true):doNothing();
            !bool3? setPhoneInvalid(true):doNothing();
            setErrorMessage("Fields with * are required");
            setTimeout(()=>{
                setLastNameInvalid(false)
                setEmailInvalid(false)
                setPhoneInvalid(false)
            },timeReset)
            setTimeout(()=>{
                setErrorMessage("");
            },timeReset*3)
        }
    }

    const pageZero = (
        <div className="page">
            <Label
                center={true}
                content={<h1>Create Account</h1>}/>
            <div className="page-zero-name-bar">
                <TextInput
                    setFunction={setFirstName}
                    placeholder={'First Name'}
                    />
                <TextInput
                    setFunction={setLastName}
                    placeholder={'Last Name*'}
                    invalid={lastNameInvalid}
                    />
            </div>
            <TextInput
                type={'email'}
                setFunction={setEmail}
                placeholder={'Email*'}
                invalid={emailInvalid}
                />
            <TextInput
                setFunction={setPhone}
                placeholder={'Phone Number*'}
                invalid={phoneInvalid}
                />
            <div className="spacer"></div>
            <Label
                center={true}
                content={
                    <>
                        <span id='login-now-container'>
                            Already have an account?
                        </span>
                        <a href="/auth">Click to Login</a>
                    </>
                }/>
        </div>
    )



            //   if unsuccessful returns false and displays notification
    //   if successful returns true
    const doPageOneDataValidation = ()=>{
        const bool1 = country.length != 0;
        const bool2 = pincode.toString().length != 0;
        if (bool1 && bool2) {
            return true;
        } else {
            !bool1? setCountryInvalid(true):doNothing();
            !bool2? setPincodeInvalid(true):doNothing();
            setErrorMessage("Fields with * are required");
            setTimeout(()=>{
                setCountryInvalid(false)
                setPincodeInvalid(false)
            },timeReset)
            setTimeout(()=>{
                setErrorMessage("");
            },timeReset*3)
        }
    }
    

    const pageOne = (
        <div className="page">
            <Label
                center={true}
                content={<h1>Shipping Information</h1>}/>
            <div className="page-one-row-one">
                <TextInput
                    setFunction={setAppartmentNumber}
                    placeholder={'Apt. no., floor, building Name'}
                    />
                <TextInput
                    setFunction={setCountry}
                    placeholder={'Country*'}
                    invalid={countryInvalid}
                    />
            </div>
            <div className="page-one-row-two">
                <TextInput
                    setFunction={setStreetNumber}
                    placeholder={'Street Name'}
                    />
                <TextInput
                    setFunction={setPincode}
                    placeholder={'Pincode*'}
                    invalid={pincodeInvalid}
                    />
            </div>
            <Label
                content={
                    <div className="page-one-disclaimer">
                        This can be changed later from user settings
                    </div>
                }/>
        </div>
    )


            //   if unsuccessful returns false and displays notification
    //   if successful returns true
    const doPageTwoDataValidation = ()=>{
        const bool1 = username.length != 0;
        const bool2 = password.length != 0;
        const bool3 = passwordRepeat.length != 0;
        const bool4 = passwordRepeat == password;
        
        // Regex Matching for username
        const validCharsUsername = /^[a-zA-Z0-9()_\-.!@#$%^&\*]*$/
        var boolUsernameRegex = validCharsUsername.test(username);
        boolUsernameRegex &&= username.length <= 25;
        boolUsernameRegex &&= username.length >= 5;

        // Regex Matching for password
        const validCharsPassword = /^[a-zA-Z0-9()_\-,. !@#$%^&\*]*$/
        var boolPasswordRegex = validCharsPassword.test(password);
        boolPasswordRegex &&= password.length <= 25;
        boolPasswordRegex &&= password.length >= 8;

        if (bool1 && bool2 && bool3 && bool4 && boolUsernameRegex && boolPasswordRegex) {
            return true;
        } else {
            !(bool1 && boolUsernameRegex)? setUsernameInvalid(true):doNothing();
            !(bool2 && boolPasswordRegex)? setPasswordInvalid(true):doNothing();
            !(bool3 && bool4)? setPasswordRepeatInvalid(true):doNothing();
            // Set a more descriptive error message here
            // Possibly make a separate component to handle this !!! TODO
            setErrorMessage("Error 'Temp !!!'");
            setTimeout(()=>{
                setUsernameInvalid(false);
                setPasswordInvalid(false);
                setPasswordRepeatInvalid(false);
            },timeReset)
            setTimeout(()=>{
                setErrorMessage("");
            },timeReset*3)
        }
    }

    const doSubmit = () => {
        if (!doPageTwoDataValidation()) {
            return;
        }
        // TEMP UNTIL BACKEND IS FIXED !!!
        // ADD More descriptive errors from backend !!!
        setFirstName(firstName.length==0?'PLACEHOLDER':firstName);
        setProfilePhoto(profilePhoto.length==0?'http://pluspng.com/img-png/user-png-icon-big-image-png-2240.png':profilePhoto)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                address: `${appartmentNumber}, ${streetName}, ${pincode}, ${country}`,
                phone: parseInt(phone),
                email: email,
                profilePhoto: profilePhoto
            })
        };
        fetch("/api-v1/auth/register",requestOptions)
        .then(res => res.json())
        .then(async (data) => {
            if (data['success']) {
                setErrorMessage("Registered!");
                setCurrentSubPanel((c)=>{return c+1})

            } else {
                setErrorMessage(data['payload']['message']);
            }
        })
        .catch(error => console.error(error));
    }

    const pageTwo = (
        <div className="page">
            <Label
                center={true}
                content={<h1>Lets setup your profile</h1>}/>
            <TextInput
                setFunction={setUsername}
                placeholder={'Username*'}
                invalid={usernameInvalid}
                />
            <TextInput
                type={'password'}
                setFunction={setPassword}
                placeholder={'password*'}
                invalid={passwordInvalid}
                />
            <TextInput
                type={'password'}
                setFunction={setPasswordRepeat}
                placeholder={'Retype password*'}
                invalid={passwordRepeatInvalid}
                />
            <TextInput
                setFunction={setProfilePhoto}
                placeholder={'Profile photo url'}
                />
            <div className="center">
                <Button 
                    onClick={doSubmit}
                    content={'Create Profile'}
                    fill={true}/>
            </div>
        </div>
    )

    const pageThree = (
        <div className="page">
            <Label
                center={true}
                content={<h1>Congratulations!</h1>}/>
            {/* TODO !!! add a celebration animation */}
            <Label
                center={true}
                content={<h2> You are all set up</h2>}/>
            <div className="center">
                <Button 
                    onClick={()=>{window.location.href='/auth'}}
                    content={'Continue'}
                    fill={true}/>
            </div>
        </div>
    )

            // Performs the appropriate data validation for the current page
    //   if success then moves to next page
    const handleClickNextSubpanel = ()=>{
        switch (currentSubPanel) {
            case 0:
                if (doPageZeroDataValidation()) {
                    setCurrentSubPanel((c)=>{return c+1})
                }
                break;
            case 1:
                if (doPageOneDataValidation()) {
                    setCurrentSubPanel((c)=>{return c+1})
                }
                break;
        
            default:
                setErrorMessage("Unexpected call to Next sub panel")
                break;
        }
    }

    const footer = (
        <>
            <div className="spacer"></div>
            <div className="spacer"></div>
            <div id="footer">
                <LeftButton onClick={
                    ()=>{
                        currentSubPanel>0?
                        setCurrentSubPanel((c)=>{return c-1})
                        :window.location.href = '/';
                    }}/>
                <div id="footer-middle">
                    <Label
                        center={true}
                        content={errorMessage}/>
                    <ProgressBar fractions={3} state={currentSubPanel} />
                </div>
                {currentSubPanel==2?'':<LeftButton rotation={180} onClick={handleClickNextSubpanel}/>}
            </div>
        </>
    )

    return (
        <div id="register-container">
            {header}
            {currentSubPanel==0?
            pageZero
            :currentSubPanel==1?
            pageOne
            :currentSubPanel==2?
            pageTwo
            :pageThree}
            {currentSubPanel!=3?footer:''}
        </div>
    )
}
