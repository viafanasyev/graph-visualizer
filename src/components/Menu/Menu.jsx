import React from 'react';
import classnames from "classnames/bind";
import styles from "./Menu.module.scss";
import Draggable from 'react-draggable';
import { ButtonComponent } from "../Buttons/Buttons";
import { SliderComponent } from "../Sliders/Sliders";
import { DropDownList } from "../DropDownLists/DropDownLists";
import { changeGraphMode, closeMessage, invertOrientation, showMessage } from "../../actions";
import { connect } from "react-redux";
import { graphMode } from "../Graph/Graph";
import { RoundedToggleSwitch } from "../ToggleSwitches/ToggleSwitches";

const cx = classnames.bind(styles);

const minAlgorithmSpeed = 0;
const maxAlgorithmSpeed = 100;

const algorithms = [
    "Поиск в глубину",
    "Поиск в ширину",
    "Алгоритм Дейкстры"
];

const mapStateToProps = state => ({
    graphMode: state.graphReducer.graphMode,
    isOriented: state.graphReducer.graph.isOriented()
});

class MenuComponent extends React.Component {
    state = {
        selectedAlgorithm: algorithms[0],
        visualizationSpeed: (minAlgorithmSpeed + maxAlgorithmSpeed) / 2,
    };

    handleAlgorithmChange = e => {
        this.setState({ selectedAlgorithm: algorithms[e.target.value] });
    };

    startVisualization = () => {
        // TODO: Add visualization
        console.log(this.state.selectedAlgorithm);
    };

    stepVisualization = () => {
        // TODO: Add visualization
        console.log(this.state.selectedAlgorithm);
    };

    stopVisualization = () => {
        // TODO: Add visualization
        console.log(this.state.selectedAlgorithm);
    };

    handleAlgorithmSpeedChange = e => {
        this.setState({ visualizationSpeed: e.target.value });
    };

    askForAction = (message, graphMode) => {
        this.props.showMessage(message);
        this.props.changeGraphMode(graphMode);
    };

    closeMessage = () => {
        this.props.changeGraphMode(graphMode.DEFAULT);
        this.props.closeMessage();
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
                            onChange={() => this.props.invertOrientation()}
                            isChecked={this.props.isOriented}/>
                    </div>
                    <div className={cx("menu-sub")}>
                        <div className={cx("header")}>Визуализировать</div>
                        <div className={cx("algorithms-list")}>
                            <DropDownList items={algorithms} onChange={this.handleAlgorithmChange}/>
                        </div>
                        <div className={cx("slider")}>
                            <SliderComponent
                                label={"Скорость анимации"}
                                value={this.state.visualizationSpeed}
                                min={minAlgorithmSpeed}
                                max={maxAlgorithmSpeed}
                                onChange={this.handleAlgorithmSpeedChange}/>
                        </div>
                        <div className={cx("visualization-control-buttons")}>
                            <ButtonComponent text={"Старт"} onClick={this.startVisualization}/>
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
    invertOrientation: () => dispatch(invertOrientation())
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuComponent);