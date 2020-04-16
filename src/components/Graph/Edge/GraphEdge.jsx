import { vertexBorderWidth } from "../Vertex/GraphVertex";
import { Arrow, Line } from "react-konva";
import React from "react";

export class Edge {
    constructor(vertexFrom, vertexTo) {
        this._from = vertexFrom;
        this._to = vertexTo;
        this.state = EdgeState.NORMAL;
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
}

export const GraphEdge = ({edge, edgeType}) => {
    const points = getEdgePointsForType(edge, edgeType);
    const color = edge.color;
    if (edgeType === EdgeType.NOT_ORIENTED)
        return (
            <Line
                points={points}
                stroke={color}
                fill={color}
                strokeWidth={2}/>
        );
    else
        return (
            <Arrow
                points={points}
                stroke={color}
                fill={color}
                strokeWidth={2}
                tension={edgeType === EdgeType.LOOP ? 0.75 : 0.5}/>
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

        return [
            xFrom, yFrom,
            xTo, yTo
        ];
    } else if (edgeType === EdgeType.TWO_SIDE_ORIENTED) {
        const angleOffset = 0.25;
        const xFrom = vertexFrom.x + vertexFromOffset * Math.cos(angle + angleOffset);
        const yFrom = vertexFrom.y - vertexFromOffset * Math.sin(angle + angleOffset);
        const xTo = vertexTo.x - vertexToOffset * Math.cos(angle - angleOffset);
        const yTo = vertexTo.y + vertexToOffset * Math.sin(angle - angleOffset);

        const middlePointHeightCoefficient = 1. / 15.;
        const xMiddle = (xFrom + xTo) / 2. - (yFrom - yTo) * middlePointHeightCoefficient;
        const yMiddle = (yFrom + yTo) / 2. + (xFrom - xTo) * middlePointHeightCoefficient;

        return [
            xFrom, yFrom,
            xMiddle, yMiddle,
            xTo, yTo
        ];
    } else if (edgeType === EdgeType.LOOP) {
        const xFrom = vertexFrom.x - vertexFromOffset;
        const yFrom = vertexFrom.y;
        const xTo = vertexFrom.x - vertexFromOffset;
        const yTo = vertexFrom.y;

        const anchorDx = 3. * vertexFromOffset / Math.sqrt(2.);
        const anchorDy = 1.5 * vertexFromOffset / Math.sqrt(2.);
        const xMiddleFirst = xFrom - anchorDx;
        const yMiddleFirst = yFrom - anchorDy;
        const xMiddleSecond = xTo - anchorDx;
        const yMiddleSecond = yTo + anchorDy;

        return [
            xFrom, yFrom,
            xMiddleFirst, yMiddleFirst,
            xMiddleSecond, yMiddleSecond,
            xTo, yTo
        ];
    }
};