import React from 'react';
import classnames from "classnames/bind";
import styles from "./Menu.module.scss";
import Draggable from 'react-draggable';
import { ButtonComponent } from "../Buttons/Buttons";
import { SliderComponent } from "../Sliders/Sliders";
import { DropDownList } from "../DropDownLists/DropDownLists";
import {
    changeGraphMode,
    cleanGraphSelections,
    closeMessage,
    invertOrientation,
    setGraph,
    showMessage
} from "../../actions";
import { connect } from "react-redux";
import { Graph, GraphMode, vertexRadius } from "../Graph/Graph";
import { RoundedToggleSwitch } from "../ToggleSwitches/ToggleSwitches";
import {
    call,
    clearStatistics,
    clearTrace,
    continueCall,
    pause,
    preCall,
    setAlgorithm,
    setSpeed
} from "../../actions/algorithm";
import DFS from "../../algorithms/graph/dfs"
import BFS from "../../algorithms/graph/bfs"
import Dijkstra from "../../algorithms/graph/dijkstra"
import PrimMST from "../../algorithms/graph/prim-mst"
import KruskalMST from "../../algorithms/graph/kruskal-mst"
import CheckConnected from "../../algorithms/graph/check-connected"
import CheckBipartite from "../../algorithms/graph/check-bipartite"
import FindRadius from "../../algorithms/graph/radius"
import FindDiameter from "../../algorithms/graph/diameter"
import TopologicalSort from "../../algorithms/graph/topological-sort"
import { Vertex } from "../Graph/Vertex/Vertex";
import { Edge } from "../Graph/Edge/Edge";
import { startMatrixDialogForResult } from "../../actions/matrixDialog";

const cx = classnames.bind(styles);

const minAlgorithmSpeed = 0;
const maxAlgorithmSpeed = 1000;

const mapStateToProps = state => ({
    graphMode: state.graphReducer.graphMode,
    isOriented: state.graphReducer.graph.isOriented(),
    isVisualizationActive: state.algorithmReducer.isActive,
    visualizationSpeed: state.algorithmReducer.speed,
    selectedAlgorithm: state.algorithmReducer.algorithm,
    remainingAlgorithmSteps: state.algorithmReducer.trace.length,
    graph: state.graphReducer.graph
});

class MenuComponent extends React.Component {
    state = {
        algorithms: [
            DFS,
            BFS,
            Dijkstra,
            PrimMST,
            KruskalMST,
            CheckConnected,
            CheckBipartite,
            FindRadius,
            FindDiameter,
            TopologicalSort
        ],
        algorithmPaused: false
    };

    componentDidMount() {
        this.props.setAlgorithm(this.state.algorithms[0]);
        this.props.setSpeed((minAlgorithmSpeed + maxAlgorithmSpeed) / 2);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.graphMode !== this.props.graphMode)
            return true;
        if (nextProps.isOriented !== this.props.isOriented)
            return true;
        if (nextProps.isVisualizationActive !== this.props.isVisualizationActive)
            return true;
        if (nextProps.visualizationSpeed !== this.props.visualizationSpeed)
            return true;
        if (nextProps.selectedAlgorithm !== this.props.selectedAlgorithm)
            return true;
        if (nextProps.remainingAlgorithmSteps !== this.props.remainingAlgorithmSteps)
            return true;
        return false;
    }

    handleAlgorithmChange = e => {
        this.clearVisualization();
        this.props.changeGraphMode(GraphMode.DEFAULT);
        this.props.closeMessage();

        this.props.setAlgorithm(this.state.algorithms[e.target.value]);
    };

    startVisualization = () => {
        if (this.props.remainingAlgorithmSteps === 0) {
            this.props.clearTrace();
            this.props.clearStatistics();
            this.props.cleanGraphSelections();
            this.props.preCall();
        } else if (this.props.isVisualizationActive) {
            this.props.pause();
            this.setState({ algorithmPaused: true });
        } else {
            this.setState({ algorithmPaused: false });
            this.props.continue();
        }
    };

    stepVisualization = () => {
        if (this.props.remainingAlgorithmSteps === 0) {
            this.props.clearTrace();
            this.props.clearStatistics();
            this.props.cleanGraphSelections();
            this.props.preCall(true);
        } else {
            this.setState({ algorithmPaused: false });
            this.props.continue(true);
        }
    };

    stopVisualization = () => {
        this.clearVisualization();
        this.props.closeMessage();
        this.props.changeGraphMode(GraphMode.DEFAULT);
    };

    handleAlgorithmSpeedChange = e => {
        this.props.setSpeed(maxAlgorithmSpeed - e.target.value);
    };

    askForAction = (message, graphMode) => {
        this.clearVisualization();

        this.props.showMessage(message);
        this.props.changeGraphMode(graphMode);
    };

    closeMessage = () => {
        this.props.changeGraphMode(GraphMode.DEFAULT);
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
        this.props.clearTrace();
        this.props.clearStatistics();
    };

    writeToFile = () => {
        this.clearVisualization();
        this.props.changeGraphMode(GraphMode.DEFAULT);

        const json = JSON.stringify({
            vertices: this.props.graph.vertices.map(v => ({
                x: v.x,
                y: v.y,
                name: v.name
            })),
            edges: this.props.graph.edges.map(e => ({
                from: e.from.name,
                to: e.to.name,
                weight: e.weight
            })),
            oriented: this.props.isOriented
        });

        const exportData = "data:text/json;charset=utf-8," + escape(json);
        const anchorElement = document.getElementById("fileSave");
        anchorElement.setAttribute("href", exportData);
        anchorElement.setAttribute("download", "graph.json");
        anchorElement.click();
    };

    askReadFromFile = () => {
        this.clearVisualization();
        this.props.changeGraphMode(GraphMode.DEFAULT);

        document.getElementById("fileLoad").click();
    };

    readFromFile = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);

                const oriented = json.oriented;
                const vertices = json.vertices.map(v => new Vertex(v.x, v.y, vertexRadius, v.name));
                const edges = json.edges.map(e =>
                    new Edge(
                        vertices.find(v => v.name === e.from),
                        vertices.find(v => v.name === e.to),
                        oriented,
                        e.weight
                    )
                );

                const graph = new Graph(oriented, vertices, edges);

                if (oriented !== this.props.isOriented)
                    this.invertOrientation();
                this.props.setGraph(graph);
            } catch (e) {
                this.props.showMessage("Некорректный формат файла");
            }
        };

        reader.readAsText(file);
        document.getElementById("fileLoad").value = null;
    };

    showAdjacencyMatrix = () => {
        this.props.startMatrixDialog();
    };

    render() {
        return (
            <Draggable grid={[4, 4]} bounds={"body"} cancel={["button", "input", "select"]}>
                <div className={cx("menu")}>
                    <div className={cx("menu-sub")}>
                        <div className={cx("graph-control-buttons")}>
                            <ButtonComponent
                                text={"Режим просмотра"} // TODO: Find proper name
                                onClick={() => this.closeMessage()}
                                activated={this.props.graphMode === GraphMode.DEFAULT}/>
                            <ButtonComponent
                                text={"Добавить вершину"}
                                onClick={() => this.askForAction("Выберите точку для добавления вершины", GraphMode.ADD_VERTEX)}
                                activated={this.props.graphMode === GraphMode.ADD_VERTEX}/>
                            <ButtonComponent
                                text={"Добавить ребро"}
                                onClick={() => this.askForAction("Выберите вершины, которые нужно соединить ребром", GraphMode.ADD_EDGE)}
                                activated={this.props.graphMode === GraphMode.ADD_EDGE}/>
                            <ButtonComponent
                                text={"Удалить вершину/ребро"}
                                onClick={() => this.askForAction("Выберите объект для удаления", GraphMode.REMOVE_VERTEX_OR_EDGE)}
                                activated={this.props.graphMode === GraphMode.REMOVE_VERTEX_OR_EDGE}/>
                        </div>
                        <RoundedToggleSwitch
                            className={cx("switch")}
                            text={"Ориентированный?"}
                            onChange={() => this.invertOrientation()}
                            isChecked={this.props.isOriented}/>
                    </div>
                    <div className={cx("menu-sub")}>
                        <div className={cx("algorithms-list")}>
                            <DropDownList
                                items={this.state.algorithms.map(a => a.name)}
                                onChange={this.handleAlgorithmChange}/>
                        </div>
                        <div className={cx("slider")}>
                            <SliderComponent
                                label={"Скорость анимации"}
                                value={maxAlgorithmSpeed - this.props.visualizationSpeed}
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
                    <div className={cx("menu-sub")}>
                        <div className={cx("file-control-buttons")}>
                            <ButtonComponent
                                text={"Сохранить"}
                                onClick={() => this.writeToFile()}
                                activated={false}/>
                            <a id="fileSave" style={{"display": "none"}} aria-hidden={true} href="/#">Save graph</a>

                            <ButtonComponent
                                text={"Загрузить"}
                                onClick={() => this.askReadFromFile()}
                                activated={false}/>
                            <input id="fileLoad" type="file" accept=".json" style={{"display": "none"}} onChange={(e) => this.readFromFile(e)}/>
                        </div>
                    </div>
                    <div className={cx("menu-sub")}>
                        <div className={cx("matrix-control-buttons")}>
                            <ButtonComponent
                                text={"Матрица смежности"}
                                onClick={() => this.showAdjacencyMatrix()}
                                activated={false}/>
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
    preCall: (isOneStep) => dispatch(preCall(isOneStep)),
    call: () => dispatch(call()),
    pause: () => dispatch(pause()),
    continue: (isOneStep) => dispatch(continueCall(isOneStep)),
    cleanGraphSelections: () => dispatch(cleanGraphSelections()),
    clearTrace: () => dispatch(clearTrace()),
    clearStatistics: () => dispatch(clearStatistics()),
    setGraph: (graph) => dispatch(setGraph(graph)),
    startMatrixDialog: () => dispatch(startMatrixDialogForResult())
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuComponent);