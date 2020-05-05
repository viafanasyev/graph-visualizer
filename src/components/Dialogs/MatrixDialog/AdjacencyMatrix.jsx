import React from "react";
import classnames from "classnames/bind";
import styles from "./AdjacencyMatrix.module.scss";
import { edgesListToAdjacencyMatrix } from "../../../utils/graphConverter";

const cx = classnames.bind(styles);

const MatrixCell = ({ cell, topLeft, topRight, bottomLeft, bottomRight }) => {
    return (
        <div className={cx("matrix-cell", {[`empty`]: !cell},
            {[`non-weighted`]: cell && !cell.weighted},
            {[`top-left-cell`]: topLeft},
            {[`top-right-cell`]: topRight},
            {[`bottom-left-cell`]: bottomLeft},
            {[`bottom-right-cell`]: bottomRight})}>
            {cell ? (cell.weighted ? cell.weight : "+") : "X"}
        </div>
    );
};

const MatrixRow = ({ row, first, last, vertexNumber }) => {
    return (
        <div className={cx("matrix-row")}>
            <div className={cx("label-cell")}>{vertexNumber}</div>
            {row.map((cell, index) =>
                <MatrixCell
                    cell={cell}
                    topLeft={(index === 0) && first}
                    topRight={(index + 1 === row.length) && first}
                    bottomLeft={(index === 0) && last}
                    bottomRight={(index + 1 === row.length) && last}/>)
            }
        </div>
    );
};

const AdjacencyMatrix = ({ graph }) => {
    const {adjacencyMatrix, verticesNumbers} = edgesListToAdjacencyMatrix(graph.vertices, graph.edges);
    return (
        <div className={cx("matrix")}>
            <div className={cx("label-cell")}>{" "}</div>
            {verticesNumbers.map(v => <div className={cx("label-cell")}>{v}</div>)}
            {adjacencyMatrix.map((row, index) =>
                <MatrixRow
                    row={row}
                    first={index === 0}
                    last={index + 1 === graph.vertices.length}
                    vertexNumber={verticesNumbers[index]}/>)
            }
        </div>
    );
};

export default AdjacencyMatrix;