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

    // Page related
    const [currentSubPanel, setCurrentSubPanel] = useState(0);
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    const doSubmit = () => {
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
                setCurrentSubPanel(3)

            } else {
                setErrorMessage(data['payload']['message']);
            }
        })
        .catch(error => console.error(error));
    }

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

    const pageTwo = (
        <div className="page">
            <Label
                center={true}
                content={<h1>Lets setup your profile</h1>}/>
            <TextInput
                setFunction={setUsername}
                placeholder={'Username*'}
                />
            <TextInput
                type={'password'}
                setFunction={setPassword}
                placeholder={'password*'}
                />
            <TextInput
                type={'password'}
                setFunction={setPasswordRepeat}
                placeholder={'Retype password*'}
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
                    />
            </div>
            <TextInput
                type={'email'}
                setFunction={setEmail}
                placeholder={'Email*'}
                />
            <TextInput
                setFunction={setPhone}
                placeholder={'Phone Number*'}
                />
        </div>
    )

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
            <div className="top-spacer"></div>
        </>
    )

    const footer = (
        <>
            <div className="bottom-spacer"></div>
            <div id="footer">
                <LeftButton onClick={
                    ()=>{
                        currentSubPanel>0?
                        setCurrentSubPanel((c)=>{return c-1})
                        :window.location.href = '/';
                    }}/>
                <ProgressBar fractions={3} state={currentSubPanel} />
                {currentSubPanel==2?'':<LeftButton rotation={180} onClick={()=>{setCurrentSubPanel((c)=>{return c+1})}}/>}
            </div>
        </>
    )

    return (
        <div id="register-container">
            {header}
            {/* {pageZero} */}
            {currentSubPanel==0?
            pageZero
            :currentSubPanel==1?
            pageOne
            :currentSubPanel==2?
            pageTwo
            :pageThree}
            <Label
                center={true}
                content={errorMessage}/>
            {currentSubPanel!=3?footer:''}
        </div>
    )
}
