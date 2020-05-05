import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction, VertexAction } from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";

let used = {};
let trace = [];

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

    criteria: Criteria.CONNECTED | Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        used = {};
        vertices.forEach(vertex => used[vertex.name] = 0);
        trace = [];

        const startTime = window.performance.now();

        const start = vertices[Math.floor(Math.random() * vertices.length)];
        const isBipartite = dfs(start.name, adjacencyList);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        return {
            trace,
            statistics: [
                `Граф ${isBipartite ? "двудольный" : "недвудольный"}`,
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`
            ]
        };
    }
};