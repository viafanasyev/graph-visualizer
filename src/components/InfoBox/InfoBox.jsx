import React from "react";
import classnames from "classnames/bind";
import styles from "./InfoBox.module.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const cx = classnames.bind(styles);

const mapStateToProps = state => ({
    lines: state.algorithmReducer.statistics,
    isVisible: state.algorithmReducer.isStatisticsShown
});

const InfoBox = ({ lines, isVisible }) => {
    const writeToFile = (lines) => {
        const exportData = "data:text/plain;charset=UTF-8," + lines.map(line => line + "\n").reduce((acc, cur) => acc + cur, "");
        const anchorElement = document.getElementById("fileSave");
        anchorElement.setAttribute("href", exportData);
        anchorElement.setAttribute("download", "result.txt");
        anchorElement.click();
    };

    return (
        <div className={cx("info-box", {[`invisible`]: !(isVisible && Array.isArray(lines) && lines.length)})}>
            {lines.map((line, index) => <div className={cx("text")} key={index}>{line}</div>)}
            <div className={cx("save-button")} onClick={() => writeToFile(lines)}>Сохранить</div>
            <a id="fileSave" style={{"display": "none"}} aria-hidden={true} href="/#">Save result</a>
        </div>
    );
};

InfoBox.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.symbol,
        PropTypes.bool
    ])),
    isVisible: PropTypes.bool
};

export default connect(mapStateToProps)(InfoBox);