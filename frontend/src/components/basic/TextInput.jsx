import { useEffect, useState } from 'react';
import '../../scss/components/basic/TextInput.scss';

// A themed input for this website.
// {placeholder} is the initial text or prompt displayed to user
// {setFunction} is the function to change state upon input
// {type} is the input type: 
//          - 'text' [default]
//          - 'password'
//          - 'email'
// {invalid} is boolean state which notifies the user that input is incorrect
//           make sure to set it back to false, contains shake
//           intended to be used for short period. for example setting true for
//           2 seconds to get user attention
// {success} is boolean state which notifies the user that input is correct
//           make sure to set it back to false
export default function TextInput({ placeholder, setFunction, type, invalid, success }) {
    let [inputValue, setInputValue] = useState('');

    const onChangeFunction = (e) => {
        setInputValue(e.target.value);
        if (setFunction != null) setFunction(e.target.value);
    }

    const inputType = type != null ? type : 'text';

    return (
        <label class="theme-text-input-label">
            <input
                data-invalid={invalid ? '1' : '0'}
                data-success={success ? '1' : '0'}
                data-has-value={inputValue.length != 0 ? '1' : '0'}
                class="theme-text-input"
                type={inputType}
                value={inputValue}
                onChange={onChangeFunction} />
            <div>{placeholder}</div>
        </label>
    )
}