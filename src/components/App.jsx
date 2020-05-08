import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import PlainGraph from "./PlainGraph/PlainGraph";
import GraphComponent from "./Graph/Graph";
import MenuComponent from "./Menu/Menu";
import MessageBox from "./MessageBox/MessageBox";
import InputDialog from "./Dialogs/InputDialog/InputDialog";
import InfoBox from "./InfoBox/InfoBox";
import MatrixDialog from "./Dialogs/MatrixDialog/MatrixDialog";
import { HotKeys } from "react-hotkeys";
import { connect } from "react-redux";
import { cleanGraphSelections, clearGraph, generateGraph } from "../actions";
import HintBox from "./HintBox/HintBox";
import { clearStatistics, clearTrace, pause } from "../actions/algorithm";

const cx = classnames.bind(styles);

const App = ({ stopVisualization, generateGraph, clearGraph }) => {
    const onKeyDown = (e) => {
        if (e.ctrlKey && (e.key === 'g')) {
            e.preventDefault();
            stopVisualization();
            generateGraph();
        }
        if (e.ctrlKey && e.altKey && (e.key === 'c')) {
            e.preventDefault();
            stopVisualization();
            clearGraph();
        }
    };

    return (
        <HotKeys onKeyDown={onKeyDown}>
            <div className={cx("app")}>
                <MenuComponent/>
                <GraphComponent/>
                <MessageBox/>
                <InfoBox/>
                <HintBox/>
                <InputDialog/>
                <MatrixDialog/>
            </div>
        </HotKeys>
    );
};


const mapDispatchToProps = dispatch => ({
    generateGraph: () => dispatch(generateGraph()),
    clearGraph: () => dispatch(clearGraph()),
    stopVisualization: () => {
        dispatch(pause());
        dispatch(cleanGraphSelections());
        dispatch(clearTrace());
        dispatch(clearStatistics());
    }
});

export default connect(null, mapDispatchToProps)(App);
