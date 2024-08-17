import { useState } from 'react';
import LeftButton from '../../basic/LeftButton.tsx';
import TextInput from '../../basic/TextInput.tsx';
import Logo from '../../basic/Logo.tsx';
import Button from '../../basic/Button.tsx';
import Label from '../../basic/Label.tsx';
import fetchAuthLogin from '../../../api/AuthLogin.ts';
import isUsernameValid from '../../../dataValidation/username.ts';
import isPasswordValid from '../../../dataValidation/password.ts';
import '../../../scss/components/pages/AuthPage/LoginPanel.scss';

const LoginPanel: React.FC = function _() {
  const [username, setUsername] = useState('');
  const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);

  const [password, setPassword] = useState('');
  const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false);

  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // clears all user notifications after certain delay
  const waitAndResetState = async () => {
    setTimeout(() => {
      setUsernameInvalid(false);
      setPasswordInvalid(false);
    }, 1500);
    setTimeout(() => {
      setErrorMessage('');
    }, 6000);
  };

  // notifies user of invalid username
  const notifyUsernameInvalid = () => {
    setUsernameInvalid(true);
    setErrorMessage('Invalid Username');
    waitAndResetState();
  };

  // notifies user of invalid password
  const notifyPasswordInvalid = () => {
    setPasswordInvalid(true);
    setErrorMessage('Invalid Password');
    waitAndResetState();
  };

  // set visual indicators for success and redirect
  const handleSuccessAndExit = () => {
    setFormSuccess(true);
    setTimeout(() => {
      window.location.href = '/user';
    }, 1500);
  };

  // submits user credentials for authentication
  const doSubmit = async () => {
    if (!isUsernameValid(username)) {
      notifyUsernameInvalid();
      return;
    }

    if (!isPasswordValid(password)) {
      notifyPasswordInvalid();
      return;
    }

    const result = await fetchAuthLogin(username, password);
    if ('' === result) {
      handleSuccessAndExit();
    } else {
      setErrorMessage(result);
      waitAndResetState();
    }
  };

  const floating = (
    <>
      <div id="back-button-container">
        <LeftButton
          onClick={() => {
            window.location.href = '/';
          }}
        />
      </div>
      <div id="logo-container">
        <Logo doAnimateOnHover onClickLocation="/" />
      </div>
    </>
  );

  const form = (
    <div id="form">
      <Label center content={<h1>Login</h1>} />
      <TextInput
        setFunction={setUsername}
        placeholder="Username"
        invalid={usernameInvalid}
        success={formSuccess}
      />
      <TextInput
        setFunction={setPassword}
        placeholder="Password"
        type="password"
        invalid={passwordInvalid}
        success={formSuccess}
      />
      <Label center content={errorMessage} />
      <div className="center">
        <Button onClick={doSubmit} content="submit" fill />
      </div>
    </div>
  );

  const footer = (
    <>
      <span id="register-now-container">Don&apost have an account?</span>
      <a href="/auth/register">Click to Resgister</a>
    </>
  );

  return (
    <div id="login-container">
      {floating}

      <div className="login-top-spacer" />
      {form}
      <Label content={footer} center />
    </div>
  );
};

export default LoginPanel;
