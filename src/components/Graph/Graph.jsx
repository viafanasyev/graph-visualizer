import React from 'react';
import classnames from "classnames/bind";
import styles from "./Graph.module.scss";
import Konva from "konva";
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
                    new Vertex(50, 50, vertexRadius),
                    new Vertex(100, 50, vertexRadius),
                    new Vertex(100, 100, vertexRadius),
                    new Vertex(150, 150, vertexRadius),
                    new Vertex(300, 150, vertexRadius),
                    new Vertex(350, 175, vertexRadius)
                ];
            else {
                vertices = vertices.map(vertex => {
                    return new Vertex(vertex.x, vertex.y, vertex.radius);
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
                    const vertexFrom = vertices.findIndex(vertex => (vertex.x === edge._from.x) && (vertex.y === edge._from.y));
                    const vertexTo = vertices.findIndex(vertex => (vertex.x === edge._to.x) && (vertex.y === edge._to.y));
                    if ((vertexFrom !== -1) && (vertexTo !== -1))
                        return new Edge(vertices[vertexFrom], vertices[vertexTo], edge.weight);
                    return null;
                }).filter(edge => edge !== null);
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
            localStorage.setItem('edgesList', JSON.stringify(this.state.edgesList));
        };
    }

    findIndexOfVertex = (x, y) => {
        return this.state.vertices.findIndex(vertex => (vertex.x === x) && (vertex.y === y));
    };

    handleVertexDragStart = e => {
        e.target.setAttrs({
            scaleX: 1.1,
            scaleY: 1.1,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 10, y: 10 },
            shadowOpacity: 0.5
        });
        e.target.moveToTop();
        const i = this.findIndexOfVertex(e.target.x(), e.target.y());
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

    handleVertexDragEnd = e => {
        e.target.to({
            duration: 0.25,
            easing: Konva.Easings.EaseOut,
            scaleX: 1,
            scaleY: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0
        });
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
                                onDragStart={this.handleVertexDragStart}
                                onDragEnd={this.handleVertexDragEnd}
                                onDragMove={this.handleVertexDragMove}/>
                        )
                    }
                </Layer>
            </Stage>
        );
    }
}

export default Graph;