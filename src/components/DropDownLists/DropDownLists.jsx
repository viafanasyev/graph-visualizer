import React from "react";
import classnames from "classnames/bind";
import styles from "./DropDownLists.module.scss";

const cx = classnames.bind(styles);

export const DropDownList = ({ items, onChange }) => {
    return (
        <select className={cx("drop-down-list")} onChange={onChange}>
            {items.map((item, index) => <option key={index} value={index}>{item}</option>)}
        </select>
    );
};