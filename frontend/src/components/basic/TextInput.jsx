import { useState } from 'react';
import '../../scss/components/basic/TextInput.scss';

// A themed input for this website.
// {placeholder} is the initial text
// {setFunction} is the function to change state upon input
export default function TextInput({placeholder, setFunction}) {
    let [inputValue, setInputValue] = useState('');

    const onChangeFunction = (e) => {
        setInputValue(e.target.value);
        if (setFunction!=null) setFunction(e.target.value);
    }

    return (
        <label class="theme-text-input-label">
            <input
                class="theme-text-input"
                type="text"
                required='true'
                value={inputValue}
                onChange={onChangeFunction}/>
            <div>{placeholder}</div>
        </label>
    )
}