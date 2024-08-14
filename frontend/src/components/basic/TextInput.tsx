import React, { useState } from 'react';
import '../../scss/components/basic/TextInput.scss';

// placeholder: is the initial text or prompt displayed to user
// setFunction: is the function to change state upon input
// invalid :    is boolean state which notifies the user that input is incorrect
//                  make sure to set it back to false, contains shake
//                  intended to be used for short period. for example setting true for
//                  2 seconds to get user attention
// success:     is boolean state which notifies the user that input is correct
//                  make sure to set it back to false
interface Props {
  placeholder: string;
  setFunction: React.Dispatch<React.SetStateAction<string>>;
  type?: 'text' | 'password' | 'email';
  invalid?: boolean;
  success?: boolean;
}

// a themed input for this website.
const TextInput: React.FC<Props> = function _({
  placeholder,
  setFunction,
  type = 'text',
  invalid = false,
  success = false,
}) {
  const [inputValue, setInputValue] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const onChangeFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (setFunction !== null) {
      setFunction(e.target.value);
    }
  };

  return (
    <div className="theme-text-input-label">
      <input
        data-invalid={invalid ? '1' : '0'}
        data-success={success ? '1' : '0'}
        data-has-value={inputValue.length !== 0 ? '1' : '0'}
        className="theme-text-input"
        type={'password' === type && passwordVisible ? 'text' : type}
        value={inputValue}
        onChange={onChangeFunction}
      />
      <div className="placeholder">{placeholder}</div>
      {'password' !== type ? (
        ''
      ) : (
        <button
          aria-label="view password"
          type="button"
          onClick={() => {
            setPasswordVisible(!passwordVisible);
          }}
          data-visible={passwordVisible ? '1' : '0'}
          className="view-password"
        />
      )}
    </div>
  );
};

export default TextInput;
