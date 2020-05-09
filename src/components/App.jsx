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
import { GlobalHotKeys } from "react-hotkeys";
import { connect } from "react-redux";
import { cleanGraphSelections, clearGraph, generateGraph } from "../actions";
import HintBox from "./HintBox/HintBox";
import {
    clearAlgorithmInfo,
    clearStatistics,
    clearTrace,
    invertAlgorithmInfoCollapsed,
    pause
} from "../actions/algorithm";
import AlgorithmInfoBox from "./AlgorithmInfoBox/AlgorithmInfoBox";

const cx = classnames.bind(styles);

const App = ({ stopVisualization, generateGraph, clearGraph, invertAlgorithmInfoCollapsed }) => {
    const keyMap = {
        GENERATE: ["ctrl+g", "ctrl+п"],
        CLEAR: ["ctrl+alt+c", "ctrl+alt+с"],
        COLLAPSE_ALGORITHM_INFO: ["i", "ш"]
    };

    const handlers = {
        GENERATE: (e) => {
            e.preventDefault();
            stopVisualization();
            generateGraph();
        },
        CLEAR: (e) => {
            e.preventDefault();
            stopVisualization();
            clearGraph();
        },
        COLLAPSE_ALGORITHM_INFO: (e) => {
            e.preventDefault();
            invertAlgorithmInfoCollapsed();
        }
    };

    return (
        <div className={cx("app")}>
            <GlobalHotKeys keyMap={keyMap} handlers={handlers}/>
            <MenuComponent/>
            <GraphComponent/>
            <MessageBox/>
            <InfoBox/>
            <HintBox/>
            <AlgorithmInfoBox/>
            <InputDialog/>
            <MatrixDialog/>
        </div>
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
        dispatch(clearAlgorithmInfo());
    },
    invertAlgorithmInfoCollapsed: () => dispatch(invertAlgorithmInfoCollapsed())
});

export default connect(null, mapDispatchToProps)(App);
