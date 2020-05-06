import {
    AlgorithmActionType,
    Criteria,
    EdgeAction,
    getOperationsCount,
    PreCallAction,
    VertexAction,
    VertexHintAction
} from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";

let used = {};
let trace = [];
let timer = 0;
let tin = {}, tout = {};
let countArticulationPoints = 0;
let isArticulationPoint = {};

const dfs = (vertex, adjacencyList, parent = -1) => {
    used[vertex] = true;
    tin[vertex] = tout[vertex] = timer++;
    trace.push({ vertex, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
    trace.push({ vertex, hint: tin[vertex] + " " + tout[vertex], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
    let children = 0;

    for (const {name: to} of adjacencyList[vertex]) {
        if (to === parent)
            continue;
        if (!used[to]) {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            dfs(to, adjacencyList, vertex);
            tout[vertex] = Math.min(tout[vertex], tout[to]);
            trace.push({ vertex, hint: tin[vertex] + " " + tout[vertex], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION });
            if ((tout[to] >= tin[vertex]) && (parent !== -1) && !isArticulationPoint[vertex]) {
                ++countArticulationPoints;
                isArticulationPoint[vertex] = true;
                trace.push({ vertex, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION });
            }
            ++children;
        } else {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            tout[vertex] = Math.min(tout[vertex], tin[to]);
            trace.push({ vertex, hint: tin[vertex] + " " + tout[vertex], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION });
        }
    }

    if (!isArticulationPoint[vertex]) {
        trace.push({vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION});

        if ((parent === -1) && (children > 1)) {
            trace.push({vertex, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION});
        }
    }
};

const findArticulationPoints = (vertices, edges, adjacencyList) => {
    used = {};
    vertices.forEach(vertex => {
        used[vertex.name] = false;
        isArticulationPoint[vertex.name] = false;
    });
    timer = 0;
    tin = {};
    tout = {};
    countArticulationPoints = 0;

    for (const {name: start} of vertices) {
        if (!used[start])
            dfs(start, adjacencyList);
    }
};

export default {
    name: "Поиск точек сочленения",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        trace = [];

        const startTime = window.performance.now();

        findArticulationPoints(vertices, edges, adjacencyList);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        return {
            trace,
            statistics: [
                `Количество точек сочленения: ${countArticulationPoints}`,
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`
            ]
        };
    }
};