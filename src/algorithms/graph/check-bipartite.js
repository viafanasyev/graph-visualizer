import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction, VertexAction } from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";

let used = {};
let trace = [];
let memoryUsed = 0;

const dfs = (vertex, adjacencyList, parent = -1, color = 1) => {
    used[vertex] = color;
    trace.push({ vertex, action: color === 1 ? VertexAction.COLOR_1 : VertexAction.COLOR_2, actionType: AlgorithmActionType.VERTEX_ACTION });
    let to;
    for (const toVertex of adjacencyList[vertex]) {
        to = toVertex.name;
        if (!used[to]) {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            if (!dfs(to, adjacencyList, vertex, 3 - color))
                return false;
            trace.push({ from: to, to: vertex, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
        } else if ((parent !== to) && (used[to] === color)) {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
            return false;
        }
    }
    return true;
};

export default {
    name: "Проверка на двудольность",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        used = {};
        vertices.forEach(vertex => used[vertex.name] = 0);
        trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        let isBipartite = true;
        for (const {name: vertex} of vertices) {
            if (!used[vertex]) {
                isBipartite &= dfs(vertex, adjacencyList);
                if (!isBipartite)
                    break;
            }
        }

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(isBipartite) +
            sizeof(used) +
            sizeof(adjacencyList);

        return {
            trace,
            statistics: [
                `Граф ${isBipartite ? "двудольный" : "недвудольный"}`,
                `Время исполнения алгоритма: ${duration.toFixed(4)}мс`,
                `Кол-во шагов визуализации: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ]
        };
    }
};