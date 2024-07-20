import { useEffect, useState } from 'react';
import '../../scss/components/basic/TextInput.scss';

// A themed input for this website.
// {placeholder} is the initial text
// {setFunction} is the function to change state upon input
export default function TextInput({placeholder, setFunction, type}) {
    let [inputValue, setInputValue] = useState('');

    const onChangeFunction = (e) => {
        setInputValue(e.target.value);
        if (setFunction!=null) setFunction(e.target.value);
    }

    const inputType = type!=null?type:'text';

    return (
        <label class="theme-text-input-label">
            <input
                data-has-value={inputValue.length!=0?'1':'0'}
                class="theme-text-input"
                type={inputType}
                value={inputValue}
                onChange={onChangeFunction}/>
            <div>{placeholder}</div>
        </label>
    )
}