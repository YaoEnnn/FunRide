import style from './style.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(style);

function CustomInput({
    variant = '',
    animation = true,
    custom_ref,
    onChange,
    onKeyDown,
    placeholder,
    type = 'password',
    onClick,
    default_value,
    pattern = '',
}) {
    const [slashInput, setslashInput] = useState(false);

    return (
        <div className={cx('i', animation ? 'anime' : '', variant)} onClick={onClick}>
            <input
                defaultValue={default_value === null ? '' : default_value}
                onKeyDown={onKeyDown}
                onChange={onChange}
                ref={custom_ref}
                type={type === 'password' ? (slashInput ? 'text' : 'password') : type}
                placeholder={placeholder}
                pattern={pattern}
            ></input>
            {type === 'password' && (
                <FontAwesomeIcon
                    onClick={() => {
                        setslashInput(!slashInput);
                    }}
                    icon={slashInput ? faEyeSlash : faEye}
                />
            )}
        </div>
    );
}

export default CustomInput;
