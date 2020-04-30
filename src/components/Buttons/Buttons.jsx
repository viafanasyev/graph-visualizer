import React from "react";
import classnames from "classnames/bind";
import styles from "./Buttons.module.scss";

const cx = classnames.bind(styles);

export const ButtonComponent = ({ text, onClick, activated, className }) => {
    return (
        <button className={cx("button", className, {[`activated`]: activated})} onClick={onClick}>
            {text}
        </button>
    );
};