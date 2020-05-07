import React from 'react';
import classnames from "classnames/bind";
import styles from "./Graph.module.scss";
import { Layer, Rect, Stage } from "react-konva";
import { Vertex, VertexComponent } from "./Vertex/Vertex";
import { Edge, EdgeComponent, EdgeType } from "./Edge/Edge";
import { connect } from "react-redux";
import {
    addEdge,
    addVertex,
    moveCanvas,
    removeEdge,
    removeVertex,
    selectVertex,
    unselectVertex,
    updateVertexPosition
} from "../../actions";
import { startDialogForResult } from "../../actions/dialog";
import { call } from "../../actions/algorithm";
import { VisualizationEdgeComponent } from "./VisualizationEdge/VisualizationEdge";

const cx = classnames.bind(styles);

export const vertexRadius = 20;

const mapStateToProps = state => ({
    graph: state.graphReducer.graph,
    graphMode: state.graphReducer.graphMode,
    selectedVertex: state.graphReducer.selectedVertex,
    canvasX: state.graphReducer.canvasX,
    canvasY: state.graphReducer.canvasY
});

export const GraphMode = Object.freeze({
    DEFAULT: 0,
    ADD_VERTEX: 1,
    ADD_EDGE: 2,
    REMOVE_VERTEX_OR_EDGE: 3,
    ALGORITHM_PRE_CALL_SELECT_VERTEX: 4,
    ALGORITHM_PRE_CALL_SELECT_EDGE: 5
});

export class Graph {
    constructor(oriented, vertices = null, edges = null) {
        if (!vertices || !Array.isArray(vertices) || !edges || !Array.isArray(edges)) {
            this._vertices = [];
            this._edges = [];
            this._visualizationEdges = [];
            this._oriented = oriented;
            this._currentName = 0;
        } else {
            for (let i = 0; i < vertices.length; ++i) {
                if ((vertices[i].name < 0) || (vertices[i].name > 999))
                    throw new Error("Invalid vertex name");

                for (let j = 0; j < vertices.length; ++j) {
                    if ((i !== j) && (vertices[i].name === vertices[j].name))
                        throw new Error("Two vertices with equal names");
                }
            }

            for (let i = 0; i < edges.length; ++i) {
                if (edges[i].weight && ((edges[i].weight < 0) || (edges[i].weight > 99)))
                    throw new Error("Invalid edge weight");
                if (vertices.findIndex(v => v.name === edges[i].from.name) === -1)
                    throw new Error("Invalid vertex 'from'");
                if (vertices.findIndex(v => v.name === edges[i].to.name) === -1)
                    throw new Error("Invalid vertex 'to'");

                for (let j = 0; j < edges.length; ++j) {
                    if (i !== j) {
                        if (oriented) {
                            if ((edges[i].from.name === edges[j].from.name) && (edges[i].to.name === edges[j].to.name))
                                throw new Error("Multiedges aren't supported");
                        } else {
                            if ((edges[i].from.name === edges[j].from.name) && (edges[i].to.name === edges[j].to.name)
                                || (edges[i].to.name === edges[j].from.name) && (edges[i].from.name === edges[j].to.name)) {
                                throw new Error("Multiedges aren't supported");
                            }
                        }
                    }
                }
            }

            this._vertices = [...vertices];
            this._edges = [...edges];
            this._visualizationEdges = [];
            this._oriented = oriented;
            this._currentName = Math.max(...vertices.map(v => v.name)) + 1;
        }
    }

    addVertex(x, y, radius) {
        const vertex = new Vertex(x, y, radius, this._currentName++);
        this._vertices.push(vertex);
        return vertex;
    }

    removeVertex(vertex) {
        const index = this._vertices.findIndex(v => v === vertex);
        if (index !== -1) {
            this._vertices.splice(index, 1);
            this._edges = this._edges.filter(edge => (edge.from.name !== vertex.name) && (edge.to.name !== vertex.name));
        }
    }

    findEdge(vertexFrom, vertexTo) {
        if (this._oriented)
            return this._edges.findIndex(e => (e.from === vertexFrom) && (e.to === vertexTo));
        else
            return this._edges.findIndex(e => (e.from === vertexFrom) && (e.to === vertexTo)
                || (e.to === vertexFrom) && (e.from === vertexTo));
    }

    addEdge(vertexFrom, vertexTo, weight) {
        const i = this.findEdge(vertexFrom, vertexTo);
        if (i === -1) {
            const edge = new Edge(vertexFrom, vertexTo, this._oriented, weight);
            this._edges.push(edge);
            return edge;
        }
        else {
            this._edges[i].weight = weight;
        }
    }

    removeEdge(edge) {
        this._edges = this._edges.filter(e => e !== edge);
    }

    invertOrientation() {
        this._oriented = !this._oriented;
        if (this._oriented)
            this._edges.forEach(edge => edge.invertOrientation());
        else {
            const newEdges = [];
            this._edges.forEach(edge => {
                if (newEdges.findIndex(e => (e.from === edge.from) && (e.to === edge.to)
                    || (e.to === edge.from) && (e.from === edge.to)) === -1) {

                    edge.invertOrientation();
                    newEdges.push(edge);
                }
            });
            this._edges = newEdges;
        }
    }

    findVisualizationEdge(vertexFrom, vertexTo, oriented) {
        if (oriented)
            return this._visualizationEdges.findIndex(e => (e.from === vertexFrom) && (e.to === vertexTo));
        else
            return this._visualizationEdges.findIndex(e => (e.from === vertexFrom) && (e.to === vertexTo)
                || (e.to === vertexFrom) && (e.from === vertexTo));
    }

    addVisualizationEdge(vertexFrom, vertexTo, oriented, weight) {
        this.removeVisualizationEdgeByVertices(vertexFrom, vertexTo, oriented);
        const edge = new Edge(vertexFrom, vertexTo, oriented, weight);
        this._visualizationEdges.push(edge);
        return edge;
    }

    removeVisualizationEdge(edge) {
        this._visualizationEdges = this._visualizationEdges.filter(e => e !== edge);
    }

    removeVisualizationEdgeByVertices(vertexFrom, vertexTo, oriented) {
        if (oriented)
            this._visualizationEdges = this._visualizationEdges.filter(e =>
                (e.from.name !== vertexFrom.name) || (e.to.name !== vertexTo.name)
            );
        else
            this._visualizationEdges = this._visualizationEdges.filter(e =>
                ((e.from.name !== vertexFrom.name) || (e.to.name !== vertexTo.name)) &&
                ((e.to.name !== vertexFrom.name) || (e.from.name !== vertexTo.name))
            );
    }

    get vertices() {
        return this._vertices;
    }

    get edges() {
        return this._edges;
    }

    get visualizationEdges() {
        return this._visualizationEdges;
    }

    set visualizationEdges(edges) {
        this._visualizationEdges = edges;
    }

    isOriented() {
        return this._oriented;
    }
}

class GraphComponent extends React.Component {
    state = {
        draggedVertex: undefined,
        windowWidth: 700,
        windowHeight: 700
    };

    componentDidMount() {
        const handleResize = () => {
            this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
        };
        window.onresize = handleResize;
        handleResize();
    }

    findIndexOfVertex = (vertex) => {
        return this.props.graph.vertices.findIndex(v => v === vertex);
    };

    handleVertexDragStart = (e, vertex) => {
        e.cancelBubble = true;

        const i = this.findIndexOfVertex(vertex);
        this.setState({ draggedVertex: (i !== -1 ? i : undefined) });
    };

    updateDraggedVertex = (x, y) => {
        const vertex = this.state.draggedVertex;
        if (vertex !== undefined)
            this.props.updateVertexPosition(vertex, x, y);
    };

    handleVertexDragMove = e => {
        e.cancelBubble = true;

        this.updateDraggedVertex(e.target.x(), e.target.y());
    };

    handleVertexDragEnd = (e, vertex) => {
        e.cancelBubble = true;

        this.updateDraggedVertex(e.target.x(), e.target.y());
        this.setState({ draggedVertex: undefined });
    };

    getEdgeType = edge => {
        const vertexFrom = edge.from, vertexTo = edge.to;

        if (vertexTo === vertexFrom)
            return EdgeType.LOOP;
        else if (!edge.isOriented())
            return EdgeType.NOT_ORIENTED;
        else if ((this.props.graph.edges.findIndex(e => (e.from === vertexTo) && (e.to === vertexFrom)) !== -1)
                && (this.props.graph.edges.findIndex(e => (e.to === vertexTo) && (e.from === vertexFrom)) !== -1))
            return EdgeType.TWO_SIDE_ORIENTED;
        else
            return EdgeType.ONE_SIDE_ORIENTED;
    };

    handleCanvasClick = e => {
        const x = e.evt.clientX - this.props.canvasX, y = e.evt.clientY - this.props.canvasY;

        if (this.props.graphMode === GraphMode.ADD_VERTEX)
            this.props.addVertex(x, y, vertexRadius);
        else if (this.props.graphMode === GraphMode.ADD_EDGE) {
            if (this.props.selectedVertex !== undefined) {
                this.props.unselectVertex();
            }
        }
    };

    handleVertexClick = (e, vertex) => {
        if (this.props.graphMode === GraphMode.REMOVE_VERTEX_OR_EDGE) {
            e.cancelBubble = true;
            this.props.removeVertex(vertex);
        } else if (this.props.graphMode === GraphMode.ADD_EDGE) {
            e.cancelBubble = true;

            if (this.props.selectedVertex === undefined) {
                this.props.selectVertex(vertex);
            }
            else {
                this.props.startDialogForResult(
                    "Введите вес ребра",
                    `(${this.props.selectedVertex.name} ${this.props.graph.isOriented() ? '->' : '<->'} ${vertex.name})`,
                    "Оставьте поле пустым, чтобы добавить невзвешенное ребро",
                    "Вес ребра",
                    (value) => {
                        if (value === "")
                            value = undefined;
                        this.props.addEdge(this.props.selectedVertex, vertex, value);
                        this.props.unselectVertex();
                    },
                    null,
                    "[0-9]{0,2}"
                );
            }
        } else if (this.props.graphMode === GraphMode.ALGORITHM_PRE_CALL_SELECT_VERTEX) {
            e.cancelBubble = true;

            this.props.callAlgorithm(vertex, null);
        }
    };

    handleEdgeClick = (e, edge) => {
        if (this.props.graphMode === GraphMode.REMOVE_VERTEX_OR_EDGE) {
            e.cancelBubble = true;
            this.props.removeEdge(edge);
        } else if (this.props.graphMode === GraphMode.ALGORITHM_PRE_CALL_SELECT_EDGE) {
            e.cancelBubble = true;
            this.props.callAlgorithm(null, edge);
        }
    };

    handleCanvasDragEnd = (e) => {
        this.props.moveCanvas(e.target.x(), e.target.y());
    };

    render() {
        return (
            <Stage
                x={this.props.canvasX}
                y={this.props.canvasY}
                draggable={this.props.graphMode === GraphMode.DEFAULT}
                onDragEnd={this.handleCanvasDragEnd}
                onClick={this.handleCanvasClick}
                width={this.state.windowWidth}
                height={this.state.windowHeight}>
                <Layer>
                    <Rect fill={'white'} x={0} y={0} width={this.state.windowWidth} height={this.state.windowHeight}/>
                    {
                        this.props.graph.edges.map((edge, index) =>
                            <EdgeComponent
                                key={index}
                                vertexFrom={edge.from}
                                vertexTo={edge.to}
                                edge={edge}
                                edgeType={this.getEdgeType(edge)}
                                onClick={(e) => this.handleEdgeClick(e, edge)}/>
                        )
                    }
                    {
                        this.props.graph.visualizationEdges.map((edge, index) =>
                            <VisualizationEdgeComponent
                                key={index}
                                vertexFrom={edge.from}
                                vertexTo={edge.to}
                                edge={edge}
                                edgeType={this.getEdgeType(edge)}/>
                        )
                    }
                    {
                        this.props.graph.vertices.map((vertex, index) =>
                            <VertexComponent
                                key={index}
                                vertex={vertex}
                                draggable={this.props.graphMode === GraphMode.DEFAULT}
                                onClick={(e) => this.handleVertexClick(e, vertex)}
                                onDragStart={e => this.handleVertexDragStart(e, vertex)}
                                onDragEnd={e => this.handleVertexDragEnd(e, vertex)}
                                onDragMove={e => this.handleVertexDragMove(e, vertex)}/>
                        )
                    }
                </Layer>
            </Stage>
        );
    }
}


const mapDispatchToProps = dispatch => ({
    addVertex: (x, y, radius) => dispatch(addVertex(x, y, radius)),
    addEdge: (vertexFrom, vertexTo, radius) => dispatch(addEdge(vertexFrom, vertexTo, radius)),
    removeVertex: (vertex) => dispatch(removeVertex(vertex)),
    removeEdge: (edge) => dispatch(removeEdge(edge)),
    updateVertexPosition: (vertexIndex, x, y) => dispatch(updateVertexPosition(vertexIndex, x, y)),
    selectVertex: (vertex) => dispatch(selectVertex(vertex)),
    unselectVertex: (vertex) => dispatch(unselectVertex(vertex)),
    startDialogForResult: (title, text, hint, inputPlaceholder, onSubmit, onClose, pattern) =>
        dispatch(startDialogForResult(title, text, hint, inputPlaceholder, onSubmit, onClose, pattern)),
    callAlgorithm: (vertex, edge) => dispatch(call(vertex, edge)),
    moveCanvas: (x, y) => dispatch(moveCanvas(x, y))
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);