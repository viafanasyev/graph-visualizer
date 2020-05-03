import React from "react";
import classnames from "classnames/bind";
import styles from "./InfoBox.module.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const cx = classnames.bind(styles);

const mapStateToProps = state => ({
    lines: state.algorithmReducer.statistics
});

const InfoBox = ({ lines }) => {
    return (
        <div className={cx("info-box", {[`invisible`]: !(Array.isArray(lines) && lines.length)})}>
            {lines.map((line, index) => <div className={cx("text")} key={index}>{line}</div>)}
        </div>
    );
};

InfoBox.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.symbol,
        PropTypes.bool
    ]))
};

export default connect(mapStateToProps)(InfoBox);