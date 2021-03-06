import React from "react";
import classnames from "classnames/bind";
import styles from "./Buttons.module.scss";

const cx = classnames.bind(styles);

export const ButtonComponent = ({ text, type = "button", onClick, activated, className, hotKeyHint }) => {
    return (
        <button type={type} className={cx("button", className, {[`activated`]: activated})} onClick={onClick}>
            {text}{hotKeyHint ? <span className={cx("hint")}> ({hotKeyHint})</span> : ""}
        </button>
    );
};