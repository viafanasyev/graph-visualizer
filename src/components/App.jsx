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
import { clearAlgorithmInfo, clearStatistics, clearTrace, pause } from "../actions/algorithm";

const cx = classnames.bind(styles);

const App = ({ stopVisualization, generateGraph, clearGraph }) => {
    const keyMap = {
        GENERATE: "ctrl+g",
        CLEAR: "ctrl+alt+c"
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
    }
});

export default connect(null, mapDispatchToProps)(App);
