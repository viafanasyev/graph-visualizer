import React from "react";
import classnames from "classnames/bind";
import styles from "./AlgorithmInfoBox.module.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const cx = classnames.bind(styles);

const mapStateToProps = state => ({
    lines: state.algorithmReducer.algorithmInfo,
    isVisible: state.algorithmReducer.isAlgorithmInfoShown,
    isCollapsed: state.algorithmReducer.isAlgorithmInfoCollapsed
});

const AlgorithmInfoBox = ({ lines, isVisible, isCollapsed }) => {
    return (
        <div className={cx("algorithm-info-box", {[`invisible`]: isCollapsed || !(isVisible && Array.isArray(lines) && lines.length)})}>
            {Array.isArray(lines) ?
                lines.map((line, index) => <div className={cx("text")} key={index}>{line}</div>)
                :
                ""
            }

        </div>
    );
};

AlgorithmInfoBox.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.node),
    isVisible: PropTypes.bool
};

export default connect(mapStateToProps)(AlgorithmInfoBox);