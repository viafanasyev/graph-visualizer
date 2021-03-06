import { Circle, Group, Text } from "react-konva";
import React from "react";

export class Vertex {
    constructor(x, y, radius, name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.state = VertexState.DEFAULT;
        this.name = name;
        this.hint = "";
        this.hintState = VertexHintState.CLEAR;
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
            case VertexState.COLOR_1:
                return '#ff0000';
            case VertexState.COLOR_2:
                return '#0000ff';
            default:
                return 'white';
        }
    }

    get textColor() {
        switch (this.state) {
            case VertexState.DEFAULT:
                return 'black';
            case VertexState.HIGHLIGHTED:
                return 'black';
            case VertexState.PRE_COMPLETED:
                return 'black';
            case VertexState.COMPLETED:
                return 'white';
            case VertexState.COLOR_1:
                return 'white';
            case VertexState.COLOR_2:
                return 'white';
            default:
                return 'black';
        }
    }

    get hintColor() {
        switch (this.hintState) {
            case VertexHintState.CLEAR:
                return '#00000000';
            case VertexHintState.DEFAULT:
                return '#ff5f3c';
            case VertexHintState.HIGHLIGHTED:
                return '#2c99c3';
            default:
                return '#00000000';
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
                fill={vertex.textColor}
                width={labelWidth}
                height={labelHeight}
                align={'center'}
                verticalAlign={'middle'}/>

            <Text
                text={vertex.hint}
                x={-2 * vertex.radius}
                y={-2 * vertex.radius}
                fontSize={25}
                fill={vertex.hintColor}
                stroke={vertex.hintColor}
                width={labelWidth * 2}
                height={labelHeight}
                align={'center'}
                verticalAlign={'middle'}/>
        </Group>);
};

export const vertexBorderWidth = 2;

export const VertexState = Object.freeze({ DEFAULT: 0, HIGHLIGHTED: 1, PRE_COMPLETED: 2, COMPLETED: 3, COLOR_1: 4, COLOR_2: 5 });
export const VertexHintState = Object.freeze({ CLEAR: 0, DEFAULT: 1, HIGHLIGHTED: 2 });