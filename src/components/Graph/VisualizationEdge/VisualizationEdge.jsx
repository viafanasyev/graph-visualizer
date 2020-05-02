import { Arrow, Group, Line } from "react-konva";
import React from "react";
import { EdgeLabel, getEdgePointsForType } from "../Edge/Edge";

export const VisualizationEdgeComponent = ({ edge, edgeType }) => {
    const points = getEdgePointsForType(edge, edgeType);
    const color = edge.color;
    let edgeComponent;
    if (edgeType === EdgeType.NOT_ORIENTED)
        edgeComponent = (
            <Line
                points={points.linePoints}
                stroke={color}
                fill={color}
                strokeWidth={3}
                hitStrokeWidth={16}/>
        );
    else
        edgeComponent = (
            <Arrow
                points={points.linePoints}
                stroke={color}
                fill={color}
                strokeWidth={3}
                hitStrokeWidth={16}
                tension={0.5}/>
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

export const EdgeType = Object.freeze({ ONE_SIDE_ORIENTED: 0, TWO_SIDE_ORIENTED: 1, NOT_ORIENTED: 2, LOOP: 3 });