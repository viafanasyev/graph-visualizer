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
    removeEdge,
    removeVertex,
    selectVertex,
    unselectVertex,
    updateVertexPosition
} from "../../actions";
import { startDialogForResult } from "../../actions/dialog";
import { call } from "../../actions/algorithm";

const cx = classnames.bind(styles);

const vertexRadius = 20;

const mapStateToProps = state => ({
    graph: state.graphReducer.graph,
    graphMode: state.graphReducer.graphMode,
    selectedVertex: state.graphReducer.selectedVertex
});

export const graphMode = Object.freeze({
    DEFAULT: 0,
    ADD_VERTEX: 1,
    ADD_EDGE: 2,
    REMOVE_VERTEX_OR_EDGE: 3,
    ALGORITHM_PRE_CALL_SELECT_VERTEX: 4,
    ALGORITHM_PRE_CALL_SELECT_EDGE: 5
});

export class Graph {
    constructor(oriented) {
        this._vertices = [];
        this._edges = [];
        this._oriented = oriented;
        this._currentName = 0;
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

    get vertices() {
        return this._vertices;
    }

    get edges() {
        return this._edges;
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
        const i = this.findIndexOfVertex(vertex);
        this.setState({ draggedVertex: (i !== -1 ? i : undefined) });
    };

    updateDraggedVertex = (x, y) => {
        const vertex = this.state.draggedVertex;
        if (vertex !== undefined)
            this.props.updateVertexPosition(vertex, x, y);
    };

    handleVertexDragMove = e => {
        this.updateDraggedVertex(e.target.x(), e.target.y());
    };

    handleVertexDragEnd = (e, vertex) => {
        this.updateDraggedVertex(e.target.x(), e.target.y());
        this.setState({ draggedVertex: undefined });
    };

    getEdgeType = edge => {
        const vertexFrom = edge.from, vertexTo = edge.to;

        if (vertexTo === vertexFrom)
            return EdgeType.LOOP;
        else if (!edge.isOriented())
            return EdgeType.NOT_ORIENTED;
        else if (this.props.graph.edges.findIndex(e => (e.from === vertexTo) && (e.to === vertexFrom)) !== -1)
            return EdgeType.TWO_SIDE_ORIENTED;
        else
            return EdgeType.ONE_SIDE_ORIENTED;
    };

    handleCanvasClick = e => {
        const x = e.evt.clientX, y = e.evt.clientY;

        if (this.props.graphMode === graphMode.ADD_VERTEX)
            this.props.addVertex(x, y, vertexRadius);
        else if (this.props.graphMode === graphMode.ADD_EDGE) {
            if (this.props.selectedVertex !== undefined) {
                this.props.unselectVertex();
            }
        }
    };

    handleVertexClick = (e, vertex) => {
        if (this.props.graphMode === graphMode.REMOVE_VERTEX_OR_EDGE) {
            e.cancelBubble = true;
            this.props.removeVertex(vertex);
        } else if (this.props.graphMode === graphMode.ADD_EDGE) {
            e.cancelBubble = true;

            if (this.props.selectedVertex === undefined) {
                this.props.selectVertex(vertex);
            }
            else {
                this.props.startDialogForResult(
                    "Введите вес ребра",
                    "",
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
        } else if (this.props.graphMode === graphMode.ALGORITHM_PRE_CALL_SELECT_VERTEX) {
            e.cancelBubble = true;

            this.props.callAlgorithm(vertex, null);
        }
    };

    handleEdgeClick = (e, edge) => {
        if (this.props.graphMode === graphMode.REMOVE_VERTEX_OR_EDGE) {
            e.cancelBubble = true;
            this.props.removeEdge(edge);
        } else if (this.props.graphMode === graphMode.ALGORITHM_PRE_CALL_SELECT_EDGE) {
            e.cancelBubble = true;
            this.props.callAlgorithm(null, edge);
        }
    };

    render() {
        return (
            <Stage onClick={this.handleCanvasClick} width={this.state.windowWidth} height={this.state.windowHeight}>
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
                        this.props.graph.vertices.map((vertex, index) =>
                            <VertexComponent
                                key={index}
                                vertex={vertex}
                                draggable={this.props.graphMode === graphMode.DEFAULT}
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
    callAlgorithm: (vertex, edge) => dispatch(call(vertex, edge))
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);