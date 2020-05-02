import { Circle, Group, Text } from "react-konva";
import React from "react";
import Konva from "konva";

export class Vertex {
    constructor(x, y, radius, name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.state = VertexState.DEFAULT;
        this.name = name;
    }

    get color() {
        switch (this.state) {
            case VertexState.DEFAULT:
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

const handleDragStart = (e, call) => {
    e.target.getChildren()[0].setAttrs({
        scaleX: 1.1,
        scaleY: 1.1,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: { x: 10, y: 10 },
        shadowOpacity: 0.5
    });
    e.target.moveToTop();

    call(e);
};

const handleDragEnd = (e, call) => {
    e.target.getChildren()[0].to({
        duration: 0.25,
        easing: Konva.Easings.EaseOut,
        scaleX: 1,
        scaleY: 1,
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0
    });

    call(e);
};

export const VertexComponent = ({ vertex, draggable, onDragStart, onDragEnd, onDragMove, onClick }) => {
    const labelWidth = 40, labelHeight = 20;
    return (
        <Group
            draggable={draggable}
            onDragStart={e => handleDragStart(e, onDragStart)}
            onDragEnd={e => handleDragEnd(e, onDragEnd)}
            onDragMove={onDragMove}
            onClick={onClick}
            x={vertex.x}
            y={vertex.y}>
            <Circle
                x={0}
                y={0}
                radius={vertex.radius}
                fill={vertex.color}
                stroke={'black'}
                shadowBlur={0}
                strokeWidth={vertexBorderWidth}
                shadowOpacity={0.5}/>
            <Text
                text={vertex.name}
                x={-labelWidth / 2.}
                y={-labelHeight / 2.}
                fontSize={20}
                width={labelWidth}
                height={labelHeight}
                align={'center'}
                verticalAlign={'middle'}/>
        </Group>);
};

export const vertexBorderWidth = 2;

export const VertexState = Object.freeze({ DEFAULT: 0, HIGHLIGHTED: 1, PRE_COMPLETED: 2, COMPLETED: 3 });