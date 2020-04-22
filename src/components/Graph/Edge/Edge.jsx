import { vertexBorderWidth } from "../Vertex/Vertex";
import { Arrow, Line, Rect, Text, Group } from "react-konva";
import React from "react";

export class Edge {
    constructor(vertexFrom, vertexTo, oriented, weight) {
        this._from = vertexFrom;
        this._to = vertexTo;
        this.weight = weight;
        this.state = EdgeState.NORMAL;
        this._oriented = oriented;
    }

    get from() {
        return this._from;
    }

    get to() {
        return this._to;
    }

    get color() {
        switch (this.state) {
            case EdgeState.NORMAL:
                return 'black';
            case EdgeState.HIGHLIGHTED:
                return '#f7ff00';
            case EdgeState.ERASED:
                return '#ffffff00';
            default:
                return 'black';
        }
    }

    isWeighted() {
        return (this.weight !== undefined) && (this.weight !== null);
    }

    isOriented() {
        return this._oriented;
    }
}

export const EdgeComponent = ({ edge, edgeType }) => {
    const points = getEdgePointsForType(edge, edgeType);
    const color = edge.color;

    let edgeComponent;
    if (edgeType === EdgeType.NOT_ORIENTED)
        edgeComponent = (
        <Line
            points={points.linePoints}
            stroke={color}
            fill={color}
            strokeWidth={2}/>
        );
    else
        edgeComponent = (
            <Arrow
                points={points.linePoints}
                stroke={color}
                fill={color}
                strokeWidth={2}
                tension={edgeType === EdgeType.LOOP ? 0.5 : 0.5}/>
        );

    if (edge.isWeighted())
        return (
            <Group>
                {edgeComponent}
                <EdgeLabel
                    x={points.labelPoints[0]}
                    y={points.labelPoints[1]}
                    text={edge.weight}/>
            </Group>
        );
    else
        return (edgeComponent);
};

const EdgeLabel = ({ x, y, text }) => {
    const labelWidth = 40, labelHeight = 20;
    const labelHorizontalPadding = 1, labelVerticalPadding = 5;
    const labelBorderWidth = 0;
    return (
        <Group
            x={x - labelWidth / 2. - labelHorizontalPadding - labelBorderWidth}
            y={y - labelHeight / 2. - labelVerticalPadding - labelBorderWidth}
            width={labelWidth + 2 * (labelHorizontalPadding + labelBorderWidth)}
            height={labelHeight + 2 * (labelVerticalPadding + labelBorderWidth)}>
            <Rect
                x={0}
                y={0}
                fill={'white'}
                stroke={'black'}
                strokeWidth={labelBorderWidth}
                width={labelWidth + 2 * (labelHorizontalPadding + labelBorderWidth)}
                height={labelHeight + 2 * (labelVerticalPadding + labelBorderWidth)}/>
            <Text
                x={labelBorderWidth + labelHorizontalPadding}
                y={labelBorderWidth + labelVerticalPadding}
                text={text}
                fontSize={20}
                width={labelWidth}
                height={labelHeight}
                align={'center'}
                verticalAlign={'middle'}/>
        </Group>
    );
};

export const EdgeType = Object.freeze({ ONE_SIDE_ORIENTED: 0, TWO_SIDE_ORIENTED: 1, NOT_ORIENTED: 2, LOOP: 3 });
export const EdgeState = Object.freeze({ NORMAL: 0, HIGHLIGHTED: 1, ERASED: 2 });

export const getEdgePointsForType = (edge, edgeType) => {
    const vertexFrom = edge.from;
    const vertexTo = edge.to;
    const dx = vertexTo.x - vertexFrom.x;
    const dy = vertexFrom.y - vertexTo.y;
    const angle = Math.atan2(dy, dx);
    const vertexFromOffset = vertexFrom.radius + vertexBorderWidth / 2.;
    const vertexToOffset = vertexTo.radius + vertexBorderWidth / 2.;

    if ((edgeType === EdgeType.ONE_SIDE_ORIENTED) || (edgeType === EdgeType.NOT_ORIENTED)) {
        const xFrom = vertexFrom.x + vertexFromOffset * Math.cos(angle);
        const yFrom = vertexFrom.y - vertexFromOffset * Math.sin(angle);
        const xTo = vertexTo.x - vertexToOffset * Math.cos(angle);
        const yTo = vertexTo.y + vertexToOffset * Math.sin(angle);

        return {
            linePoints: [
                xFrom, yFrom,
                xTo, yTo
            ],
            labelPoints: [
                (xFrom + xTo) / 2.,
                (yFrom + yTo) / 2.
            ]
        };
    } else if (edgeType === EdgeType.TWO_SIDE_ORIENTED) {
        const angleOffset = 0.25;
        const xFrom = vertexFrom.x + vertexFromOffset * Math.cos(angle + angleOffset);
        const yFrom = vertexFrom.y - vertexFromOffset * Math.sin(angle + angleOffset);
        const xTo = vertexTo.x - vertexToOffset * Math.cos(angle - angleOffset);
        const yTo = vertexTo.y + vertexToOffset * Math.sin(angle - angleOffset);

        const middlePointHeightCoefficient = 1. / 15.;
        const xMiddle = (xFrom + xTo) / 2. - (yFrom - yTo) * middlePointHeightCoefficient;
        const yMiddle = (yFrom + yTo) / 2. + (xFrom - xTo) * middlePointHeightCoefficient;

        return {
            linePoints: [
                xFrom, yFrom,
                xMiddle, yMiddle,
                xTo, yTo
            ],
            labelPoints: [
                xMiddle,
                yMiddle
            ]
        };
    } else if (edgeType === EdgeType.LOOP) {
        const xFrom = vertexFrom.x - vertexFromOffset;
        const yFrom = vertexFrom.y;
        const xTo = vertexFrom.x - vertexFromOffset;
        const yTo = vertexFrom.y;

        const anchorDx = 3. * vertexFromOffset / Math.sqrt(2.);
        const anchorDy = 1.5 * vertexFromOffset / Math.sqrt(2.);
        const xMiddleFirst = xFrom - anchorDx;
        const yMiddleFirst = yFrom - anchorDy;
        const xMiddle = xMiddleFirst - vertexFromOffset;
        const yMiddle = yFrom;
        const xMiddleSecond = xTo - anchorDx;
        const yMiddleSecond = yTo + anchorDy;

        return {
            linePoints: [
                xFrom, yFrom,
                xMiddleFirst, yMiddleFirst,
                xMiddle, yMiddle,
                xMiddleSecond, yMiddleSecond,
                xTo, yTo
            ],
            labelPoints: [
                xMiddle, yMiddle
            ]
        };
    }
};