import React from "react";
import classnames from "classnames/bind";
import styles from "./Sliders.module.scss";

const cx = classnames.bind(styles);

export const SliderComponent = ({ label, value, min, max, onChange }) => {
    return (
        <div className={cx("slider-wrapper")}>
            <div className={cx("slider-label")}>{label}</div>
            <input
                type={"range"}
                className={cx("slider")}
                value={value}
                min={min}
                max={max}
                onChange={onChange}/>
        </div>
    );
};