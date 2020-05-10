import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import GraphComponent, { GraphMode } from "./Graph/Graph";
import MenuComponent from "./Menu/Menu";
import MessageBox from "./MessageBox/MessageBox";
import InputDialog from "./Dialogs/InputDialog/InputDialog";
import InfoBox from "./InfoBox/InfoBox";
import MatrixDialog from "./Dialogs/MatrixDialog/MatrixDialog";
import { GlobalHotKeys } from "react-hotkeys";
import { connect } from "react-redux";
import {
    changeGraphMode,
    cleanGraphSelections,
    clearGraph,
    closeMessage,
    generateGraph,
    showMessage
} from "../actions";
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

const App = ({
    stopVisualization,
    generateGraph,
    clearGraph,
    invertAlgorithmInfoCollapsed,
    showMessage,
    closeMessage,
    changeGraphMode
}) => {
    const keyMap = {
        GENERATE: ["ctrl+g", "ctrl+п"],
        CLEAR: ["ctrl+alt+c", "ctrl+alt+с"],
        COLLAPSE_ALGORITHM_INFO: ["i", "ш"],
        CHANGE_GRAPH_MODE: ["1", "2", "3", "4"]
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
        },
        CHANGE_GRAPH_MODE: (e) => {
            e.preventDefault();
            switch (e.key) {
                case "1":
                    closeMessage();
                    changeGraphMode(GraphMode.DEFAULT);
                    break;
                case "2":
                    stopVisualization();
                    showMessage("Выберите точку для добавления вершины");
                    changeGraphMode(GraphMode.ADD_VERTEX);
                    break;
                case "3":
                    stopVisualization();
                    showMessage("Выберите вершины, которые нужно соединить ребром");
                    changeGraphMode(GraphMode.ADD_EDGE);
                    break;
                case "4":
                    stopVisualization();
                    showMessage("Выберите объект для удаления");
                    changeGraphMode(GraphMode.REMOVE_VERTEX_OR_EDGE);
                    break;
                default:
            }
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
    invertAlgorithmInfoCollapsed: () => dispatch(invertAlgorithmInfoCollapsed()),
    changeGraphMode: (graphMode) => dispatch(changeGraphMode(graphMode)),
    showMessage: (message) => dispatch(showMessage(message)),
    closeMessage: () => dispatch(closeMessage())
});

export default connect(null, mapDispatchToProps)(App);
