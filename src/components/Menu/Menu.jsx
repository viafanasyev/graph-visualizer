import React from 'react';
import classnames from "classnames/bind";
import styles from "./Menu.module.scss";
import Draggable from 'react-draggable';
import { ButtonComponent } from "../Buttons/Buttons";
import { SliderComponent } from "../Sliders/Sliders";
import { DropDownList } from "../DropDownLists/DropDownLists";
import {
    actionNames,
    addEdge,
    addVertex,
    askForAction,
    closeMessage,
    showMessage,
    updateVertexPosition
} from "../../actions";
import { connect } from "react-redux";

const cx = classnames.bind(styles);

const minAlgorithmSpeed = 0;
const maxAlgorithmSpeed = 100;

const algorithms = [
    "Поиск в глубину",
    "Поиск в ширину",
    "Алгоритм Дейкстры"
];

const modes = Object.freeze({
    DEFAULT: 0,
    ADD_VERTEX: 1,
    ADD_EDGE: 2,
    REMOVE_VERTEX_OR_EDGE: 3
});

class MenuComponent extends React.Component {
    state = {
        selectedAlgorithm: algorithms[0],
        visualizationSpeed: (minAlgorithmSpeed + maxAlgorithmSpeed) / 2,
        mode: modes.DEFAULT
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

    askForAction = (message, actionName) => {
        this.setState(oldState => {
            const newState = {...oldState};

            switch (actionName) {
                case actionNames.addVertex:
                    newState.mode = modes.ADD_VERTEX;
                    return newState;
                case actionNames.addEdge:
                    newState.mode = modes.ADD_EDGE;
                    return newState;
                case actionNames.removeVertexOrEdge:
                    newState.mode = modes.REMOVE_VERTEX_OR_EDGE;
                    return newState;
                default:
                    return newState;
            }
        });

        this.props.showMessage(message);
        this.props.askForAction(actionName);
    };

    closeMessage = () => {
        this.setState({ mode: modes.DEFAULT });
        this.props.closeMessage();
    };

    render() {
        return (
            <Draggable grid={[4, 4]} bounds={"body"} cancel={["button", "input", "select"]}>
                <div className={cx("menu")}>
                    <div className={cx("menu-sub")}>
                        <div className={cx("header")}>Редактировать</div>
                        <div className={cx("graph-control-buttons")}>
                            <ButtonComponent
                                text={"Режим просмотра"} // TODO: Find proper name
                                onClick={() => this.closeMessage()}
                                activated={this.state.mode === modes.DEFAULT}/>
                            <ButtonComponent
                                text={"Добавить вершину"}
                                onClick={() => this.askForAction("Выберите точку для добавления вершины", actionNames.addVertex)}
                                activated={this.state.mode === modes.ADD_VERTEX}/>
                            <ButtonComponent
                                text={"Добавить ребро"}
                                onClick={() => this.askForAction("Выберите вершины, которые нужно соединить ребром", actionNames.addEdge)}
                                activated={this.state.mode === modes.ADD_EDGE}/>
                            <ButtonComponent
                                text={"Удалить вершину/ребро"}
                                onClick={() => this.askForAction("Выберите объект для удаления", actionNames.removeVertexOrEdge)}
                                activated={this.state.mode === modes.REMOVE_VERTEX_OR_EDGE}/>
                        </div>
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
    askForAction: (actionName) => dispatch(askForAction(actionName)),
    showMessage: (message) => dispatch(showMessage(message)),
    closeMessage: () => dispatch(closeMessage()),
});

export default connect(null, mapDispatchToProps)(MenuComponent);