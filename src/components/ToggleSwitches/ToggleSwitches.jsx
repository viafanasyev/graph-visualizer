import React from "react";
import classnames from "classnames/bind";
import styles from "./ToggleSwitches.module.scss";

const cx = classnames.bind(styles);

export const RoundedToggleSwitch = ({ text, onChange, className, isChecked }) => {
    return (
        <div className={cx("switch-round-wrapper", className)}>
            <label className={cx("switch-round")}>
                <input type={"checkbox"} onChange={onChange} checked={isChecked}/>
                <span className={cx("slider")}/>
            </label>
            <span className={cx("text")}>{text}</span>
        </div>
    );
};