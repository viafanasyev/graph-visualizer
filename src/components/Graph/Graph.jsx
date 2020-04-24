import React from 'react';
import classnames from "classnames/bind";
import styles from "./Graph.module.scss";
import { Layer, Stage } from "react-konva";
import { VertexComponent, Vertex } from "./Vertex/Vertex";
import { Edge, EdgeType, EdgeComponent } from "./Edge/Edge";
import { connect } from "react-redux";
import { addEdge, addVertex, updateVertexPosition } from "../../actions";

const cx = classnames.bind(styles);

const vertexRadius = 20;

const mapStateToProps = state => ({
    graph: state.graph,
    graphMode: state.graphMode
});

export class Graph {
    constructor(oriented) {
        this._vertices = [];
        this._edges = [];
        this._oriented = oriented;
    }

    addVertex(x, y, radius) {
        const vertex = new Vertex(x, y, radius, this._vertices.length);
        this._vertices.push(vertex);
        return vertex;
    }

    addEdge(vertexFrom, vertexTo, weight) {
        const edge = new Edge(vertexFrom, vertexTo, this._oriented, weight);
        this._edges.push(edge);
        return edge;
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
        this.setState(oldState => {
            const newState = {...oldState};

            // let oriented = JSON.parse(localStorage.getItem('oriented'));
            // if ((oriented === undefined) || (oriented === null))
            //     oriented = false;
            //
            // this.props.graph = new Graph(oriented);

            let vertices = JSON.parse(localStorage.getItem('vertices'));
            if ((vertices === undefined) || (vertices === null) || (vertices.length === undefined) || (vertices.length === 0)) {
                this.props.addVertex(50, 50, vertexRadius);
                this.props.addVertex(100, 50, vertexRadius);
                this.props.addVertex(100, 100, vertexRadius);
                this.props.addVertex(150, 150, vertexRadius);
                this.props.addVertex(300, 150, vertexRadius);
                this.props.addVertex(350, 175, vertexRadius);
            } else {
                vertices.sort((v1, v2) => v1.name - v2.name)
                        .forEach(vertex => {
                            this.props.addVertex(vertex.x, vertex.y, vertex.radius);
                });
            }
            vertices = this.props.graph.vertices;

            let edgesList = JSON.parse(localStorage.getItem('edges'));
            if ((edgesList === undefined) || (edgesList === null) || (edgesList.length  === undefined) || (edgesList.length === 0)) {
                this.props.addEdge(vertices[0], vertices[1]);
                this.props.addEdge(vertices[0], vertices[0], 82);
                this.props.addEdge(vertices[0], vertices[5], 15);
                this.props.addEdge(vertices[1], vertices[2]);
                this.props.addEdge(vertices[1], vertices[4]);
                this.props.addEdge(vertices[2], vertices[5], 42);
                this.props.addEdge(vertices[2], vertices[2]);
                this.props.addEdge(vertices[3], vertices[4]);
                this.props.addEdge(vertices[4], vertices[5]);
                this.props.addEdge(vertices[5], vertices[3]);
                this.props.addEdge(vertices[5], vertices[4]);
            } else {
                edgesList.forEach(edge => {
                    const vertexFrom = vertices.findIndex(vertex => vertex.name === edge.from);
                    const vertexTo = vertices.findIndex(vertex => vertex.name === edge.to);
                    if ((vertexFrom !== -1) && (vertexTo !== -1))
                        this.props.addEdge(vertices[vertexFrom], vertices[vertexTo], edge.weight);
                });
            }

            newState.graph = this.props.graph;

            return newState;
        });

        const handleResize = () => {
            this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
        };
        window.onresize = handleResize;
        handleResize();

        window.onbeforeunload = () => {
            localStorage.setItem('oriented', JSON.stringify(this.props.graph.isOriented()));
            localStorage.setItem('vertices', JSON.stringify(this.props.graph.vertices));
            localStorage.setItem('edges', JSON.stringify(this.props.graph.edges.map(edge => {
                return {
                    from: edge.from.name,
                    to: edge.to.name,
                    weight: edge.weight
                };
            })));
        };
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

    render() {
        return (
            <Stage width={this.state.windowWidth} height={this.state.windowHeight}>
                <Layer>
                    {
                        this.props.graph.edges.map((edge, index) =>
                            <EdgeComponent
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
    updateVertexPosition: (vertexIndex, x, y) => dispatch(updateVertexPosition(vertexIndex, x, y))
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphComponent);