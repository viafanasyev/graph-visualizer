import React from 'react';
import classnames from "classnames/bind";
import styles from "./Menu.module.scss";
import Draggable from 'react-draggable';
import { ButtonComponent } from "../Buttons/Buttons";
import { SliderComponent } from "../Sliders/Sliders";
import { DropDownList } from "../DropDownLists/DropDownLists";

const cx = classnames.bind(styles);

const minAlgorithmSpeed = 0;
const maxAlgorithmSpeed = 100;

const algorithms = [
    "Поиск в глубину",
    "Поиск в ширину",
    "Алгоритм Дейкстры"
];

class MenuComponent extends React.Component {
    state = {
        selectedAlgorithm: algorithms[0],
        visualizationSpeed: (minAlgorithmSpeed + maxAlgorithmSpeed) / 2
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

    render() {
        return (
            <Draggable grid={[4, 4]} bounds={"body"} cancel={["button", "input", "select"]}>
                <div className={cx("menu")}>
                    <div className={cx("menu-sub")}>
                        <div className={cx("header")}>Редактировать</div>
                        <div className={cx("graph-control-buttons")}>
                            <ButtonComponent text={"Добавить вершину"}/>
                            <ButtonComponent text={"Добавить ребро"}/>
                            <ButtonComponent text={"Удалить вершину/ребро"}/>
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

export default MenuComponent;