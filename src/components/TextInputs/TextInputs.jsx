import React from "react";
import classnames from "classnames/bind";
import styles from "./TextInputs.module.scss";

const cx = classnames.bind(styles);

export const TextInputComponent = ({ value, placeholder, onChange, pattern, className }) => {
    return (
        <input
            className={cx("text-input", className)}
            type="text"
            pattern={pattern}
            value={value}
            onChange={onChange}
            placeholder={placeholder}/>
    );
};