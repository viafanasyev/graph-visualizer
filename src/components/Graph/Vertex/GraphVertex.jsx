import { Circle } from "react-konva";
import React from "react";

export class Vertex {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.state = VertexState.EMPTY;
    }

    get color() {
        switch (this.state) {
            case VertexState.EMPTY:
                return 'white';
            case VertexState.HIGHLIGHTED:
                return 'yellow';
            case VertexState.PRE_COMPLETED:
                return '#CCCCCC';
            case VertexState.COMPLETED:
                return '#444444';
            default:
                return 'white';
        }
    }
}

export const GraphVertex = ({ vertex, onDragStart, onDragEnd, onDragMove }) => (
    <Circle
        x={vertex.x}
        y={vertex.y}
        radius={vertex.radius}
        fill={vertex.color}
        stroke={'black'}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
        shadowBlur={0}
        strokeWidth={vertexBorderWidth}
        shadowOpacity={0.5}/>
);

export const vertexBorderWidth = 2;

export const VertexState = Object.freeze({ EMPTY: 0, HIGHLIGHTED: 1, PRE_COMPLETED: 2, COMPLETED: 3 });