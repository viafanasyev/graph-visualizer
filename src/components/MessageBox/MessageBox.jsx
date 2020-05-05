import React from "react";
import classnames from "classnames/bind";
import styles from "./MessageBox.module.scss";
import { connect } from "react-redux";

const cx = classnames.bind(styles);

const mapStateToProps = state => ({
    message: state.graphReducer.message,
    isAlert: state.graphReducer.isAlert
});

const MessageBox = ({ message, isAlert }) => {
    return (
        <div className={cx("message-box", {[`invisible`]: message === undefined}, {[`alert`]: isAlert})}>
            {message}
        </div>
    );
};

export default connect(mapStateToProps)(MessageBox);