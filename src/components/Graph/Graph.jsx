import React from 'react';
import classnames from "classnames/bind";
import styles from "./Graph.module.scss";
import { Layer, Stage } from "react-konva";
import { GraphVertex, Vertex } from "./Vertex/GraphVertex";
import { Edge, EdgeType, GraphEdge } from "./Edge/GraphEdge";

const cx = classnames.bind(styles);

const vertexRadius = 20;

class Graph extends React.Component {
    state = {
        vertices: [],
        edgesList: [],
        draggedVertex: undefined,
        windowWidth: 700,
        windowHeight: 700,
        oriented: false
    };

    componentDidMount() {
        this.setState(oldState => {
            const newState = {...oldState};

            let vertices = JSON.parse(localStorage.getItem('vertices'));
            if ((vertices === undefined) || (vertices === null) || (vertices.length === undefined) || (vertices.length === 0))
                vertices = [
                    new Vertex(50, 50, vertexRadius, 0),
                    new Vertex(100, 50, vertexRadius, 1),
                    new Vertex(100, 100, vertexRadius, 2),
                    new Vertex(150, 150, vertexRadius, 3),
                    new Vertex(300, 150, vertexRadius, 4),
                    new Vertex(350, 175, vertexRadius, 5)
                ];
            else {
                vertices = vertices.map(vertex => {
                    return new Vertex(vertex.x, vertex.y, vertex.radius, vertex.name);
                });
            }
            newState.vertices = vertices;

            let edgesList = JSON.parse(localStorage.getItem('edgesList'));
            if ((edgesList === undefined) || (edgesList === null) || (edgesList.length  === undefined) || (edgesList.length === 0))
                edgesList = [
                    new Edge(vertices[0], vertices[1]),
                    new Edge(vertices[0], vertices[0]),
                    new Edge(vertices[0], vertices[5], 15),
                    new Edge(vertices[1], vertices[2]),
                    new Edge(vertices[1], vertices[4]),
                    new Edge(vertices[2], vertices[5], 42),
                    new Edge(vertices[2], vertices[2]),
                    new Edge(vertices[3], vertices[4]),
                    new Edge(vertices[4], vertices[5]),
                    new Edge(vertices[5], vertices[3]),
                    new Edge(vertices[5], vertices[4])
                ];
            else {
                edgesList = edgesList.map(edge => {
                    const vertexFrom = vertices.findIndex(vertex => vertex.name === edge.from);
                    const vertexTo = vertices.findIndex(vertex => vertex.name === edge.to);
                    console.log(vertexFrom + " " + vertexTo);
                    if ((vertexFrom !== -1) && (vertexTo !== -1))
                        return new Edge(vertices[vertexFrom], vertices[vertexTo], edge.weight);
                    return undefined;
                }).filter(edge => edge !== undefined);
            }
            newState.edgesList = edgesList;

            return newState;
        });

        const handleResize = () => {
            this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        window.onbeforeunload = () => {
            localStorage.setItem('vertices', JSON.stringify(this.state.vertices));
            localStorage.setItem('edgesList', JSON.stringify(this.state.edgesList.map(edge => {
                return {
                    from: edge.from.name,
                    to: edge.to.name,
                    weight: edge.weight
                };
            })));
        };
    }

    findIndexOfVertex = (vertex) => {
        return this.state.vertices.findIndex(v => v == vertex);
    };

    handleVertexDragStart = (e, vertex) => {
        const i = this.findIndexOfVertex(vertex);
        this.setState({ draggedVertex: (i !== -1 ? i : undefined) });
    };

    updateDraggedVertex(x, y) {
        const vertex = this.state.draggedVertex;
        if (vertex !== undefined) {
            this.setState(oldState => {
                const newState = {...oldState};

                newState.vertices[vertex].x = x;
                newState.vertices[vertex].y = y;

                return newState;
            });
        }
    }

    handleVertexDragMove = e => {
        this.updateDraggedVertex(e.target.x(), e.target.y());
    };

    handleVertexDragEnd = (e, vertex) => {
        this.updateDraggedVertex(e.target.x(), e.target.y());
        this.setState({ draggedVertex: undefined });
    };

    getEdgeType = edge => {
        if (edge.from === edge.to)
            return EdgeType.LOOP;
        else if (!this.state.oriented)
            return EdgeType.NOT_ORIENTED;
        else if (this.state.edgesList.findIndex(e => (e.from === edge.to) && (e.to === edge.from)) !== -1)
            return EdgeType.TWO_SIDE_ORIENTED;
        else
            return EdgeType.ONE_SIDE_ORIENTED;
    };

    render() {
        return (
            <Stage width={this.state.windowWidth} height={this.state.windowHeight}>
                <Layer>
                    {
                        this.state.edgesList.map((edge, index) =>
                            <GraphEdge
                                key={index}
                                vertexFrom={this.state.vertices[edge.from]}
                                vertexTo={this.state.vertices[edge.to]}
                                edge={edge}
                                edgeType={this.getEdgeType(edge)}/>
                        )
                    }
                    {
                        this.state.vertices.map((vertex, index) =>
                            <GraphVertex
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

export default Graph;