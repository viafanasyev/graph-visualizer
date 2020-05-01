import React from 'react';
import classnames from "classnames/bind";
import styles from "./Menu.module.scss";
import Draggable from 'react-draggable';
import { ButtonComponent } from "../Buttons/Buttons";
import { SliderComponent } from "../Sliders/Sliders";
import { DropDownList } from "../DropDownLists/DropDownLists";
import { changeGraphMode, cleanGraphSelections, closeMessage, invertOrientation, showMessage } from "../../actions";
import { connect } from "react-redux";
import { graphMode } from "../Graph/Graph";
import { RoundedToggleSwitch } from "../ToggleSwitches/ToggleSwitches";
import { call, continueCall, pause, preCall, setAlgorithm, setSpeed } from "../../actions/algorithm";
import DFS from "../../algorithms/graph/dfs"
import BFS from "../../algorithms/graph/bfs"

const cx = classnames.bind(styles);

const minAlgorithmSpeed = 0;
const maxAlgorithmSpeed = 1000;

const mapStateToProps = state => ({
    graphMode: state.graphReducer.graphMode,
    isOriented: state.graphReducer.graph.isOriented(),
    isVisualizationActive: state.algorithmReducer.isActive,
    visualizationSpeed: state.algorithmReducer.speed,
    selectedAlgorithm: state.algorithmReducer.algorithm
});

class MenuComponent extends React.Component {
    state = {
        algorithms: [DFS, BFS],
        algorithmPaused: false
    };

    componentDidMount() {
        this.props.setAlgorithm(this.state.algorithms[0]);
        this.props.setSpeed((minAlgorithmSpeed + maxAlgorithmSpeed) / 2);
    }

    handleAlgorithmChange = e => {
        this.clearVisualization();
        this.props.changeGraphMode(graphMode.DEFAULT);
        this.props.closeMessage();

        this.props.setAlgorithm(this.state.algorithms[e.target.value]);
    };

    startVisualization = () => {
        if (this.state.algorithmPaused) {
            this.props.continue();
            this.setState({ algorithmPaused: false });
        } else if (this.props.isVisualizationActive) {
            this.props.pause();
            this.setState({ algorithmPaused: true })
        } else {
            this.props.cleanGraphSelections();
            this.props.preCall();
        }
    };

    stepVisualization = () => {
        // TODO: Add step-by-step visualization
    };

    stopVisualization = () => {
        this.clearVisualization();
    };

    handleAlgorithmSpeedChange = e => {
        this.props.setSpeed(e.target.value);
    };

    askForAction = (message, graphMode) => {
        this.clearVisualization();

        this.props.showMessage(message);
        this.props.changeGraphMode(graphMode);
    };

    closeMessage = () => {
        this.props.changeGraphMode(graphMode.DEFAULT);
        this.props.closeMessage();
    };

    invertOrientation = () => {
        this.clearVisualization();

        this.props.invertOrientation();
    };

    clearVisualization = () => {
        this.props.pause();
        this.setState({ algorithmPaused: false });
        this.props.cleanGraphSelections();
    };

    render() {
        return (
            <Draggable grid={[4, 4]} bounds={"body"} cancel={["button", "input", "select", "." + cx("switch")]}>
                <div className={cx("menu")}>
                    <div className={cx("menu-sub")}>
                        <div className={cx("header")}>Редактировать</div>
                        <div className={cx("graph-control-buttons")}>
                            <ButtonComponent
                                text={"Режим просмотра"} // TODO: Find proper name
                                onClick={() => this.closeMessage()}
                                activated={this.props.graphMode === graphMode.DEFAULT}/>
                            <ButtonComponent
                                text={"Добавить вершину"}
                                onClick={() => this.askForAction("Выберите точку для добавления вершины", graphMode.ADD_VERTEX)}
                                activated={this.props.graphMode === graphMode.ADD_VERTEX}/>
                            <ButtonComponent
                                text={"Добавить ребро"}
                                onClick={() => this.askForAction("Выберите вершины, которые нужно соединить ребром", graphMode.ADD_EDGE)}
                                activated={this.props.graphMode === graphMode.ADD_EDGE}/>
                            <ButtonComponent
                                text={"Удалить вершину/ребро"}
                                onClick={() => this.askForAction("Выберите объект для удаления", graphMode.REMOVE_VERTEX_OR_EDGE)}
                                activated={this.props.graphMode === graphMode.REMOVE_VERTEX_OR_EDGE}/>
                        </div>
                        <RoundedToggleSwitch
                            className={cx("switch")}
                            text={"Ориентированный?"}
                            onChange={() => this.invertOrientation()}
                            isChecked={this.props.isOriented}/>
                    </div>
                    <div className={cx("menu-sub")}>
                        <div className={cx("header")}>Визуализировать</div>
                        <div className={cx("algorithms-list")}>
                            <DropDownList
                                items={this.state.algorithms.map(a => a.name)}
                                onChange={this.handleAlgorithmChange}/>
                        </div>
                        <div className={cx("slider")}>
                            <SliderComponent
                                label={"Скорость анимации"}
                                value={this.props.visualizationSpeed}
                                min={minAlgorithmSpeed}
                                max={maxAlgorithmSpeed}
                                onChange={this.handleAlgorithmSpeedChange}/>
                        </div>
                        <div className={cx("visualization-control-buttons")}>
                            <ButtonComponent
                                text={this.state.algorithmPaused ? "Далее" : (this.props.isVisualizationActive ? "Пауза" : "Старт")}
                                onClick={this.startVisualization}/>
                            <ButtonComponent text={"Шаг"} onClick={this.stepVisualization}/>
                            <ButtonComponent text={"Стоп"} onClick={this.stopVisualization}/>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    changeGraphMode: (graphMode) => dispatch(changeGraphMode(graphMode)),
    showMessage: (message) => dispatch(showMessage(message)),
    closeMessage: () => dispatch(closeMessage()),
    invertOrientation: () => dispatch(invertOrientation()),
    setAlgorithm: (algorithm) => dispatch(setAlgorithm(algorithm)),
    setSpeed: (speed) => dispatch(setSpeed(speed)),
    preCall: () => dispatch(preCall()),
    call: () => dispatch(call()),
    pause: () => dispatch(pause()),
    continue: () => dispatch(continueCall()),
    cleanGraphSelections: () => dispatch(cleanGraphSelections())
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuComponent);