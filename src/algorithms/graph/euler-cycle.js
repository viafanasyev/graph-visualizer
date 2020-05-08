import {
    AlgorithmActionType,
    Criteria,
    EdgeAction,
    getOperationsCount,
    PreCallAction,
    VertexAction,
    VertexHintAction
} from "./index";
import { edgesListToAdjacencyList, edgesListToReversedAdjacencyList } from "../../utils/graphConverter";

let trace = [];

const checkForEuler = (vertices, edges, adjacencyList, trace) => {
    let oriented = edges[0].isOriented();
    const reversedAdjacencyList = edgesListToReversedAdjacencyList(vertices, edges);

    if (!oriented) {

        // Delete loops to prevent odd degrees
        for (const {name: v} of vertices) {
            adjacencyList[v] = adjacencyList[v].filter(toVertex => toVertex.name !== v);
        }

        for (const {name: v} of vertices) {
            if (adjacencyList[v].length % 2 === 1) {
                trace.push({ vertex: v, hint: 1, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
                return false;
            } else {
                trace.push({ vertex: v, hint: 0, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            }
        }
    } else {
        let degree;
        for (const {name: v} of vertices) {
            degree = reversedAdjacencyList[v].length - adjacencyList[v].length;
            if (degree !== 0) {
                trace.push({ vertex: v, hint: degree, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
                return false;
            } else {
                trace.push({ vertex: v, hint: 0, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            }
        }
    }

    const used = {};
    vertices.forEach(vertex => used[vertex.name] = false);
    const dfs = (v) => {
        used[v] = true;
        trace.push({ vertex: v, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
        for (const {name: to} of adjacencyList[v]) {
            if (!used[to]) {
                trace.push({ from: v, to, oriented, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                dfs(to);
            }
        }
        if (oriented) {
            for (const {name: from} of reversedAdjacencyList[v]) {
                if (!used[from]) {
                    trace.push({ from, to: v, oriented, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                    dfs(from);
                }
            }
        }
        trace.push({ vertex: v, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    };

    dfs(vertices[0].name);

    for (const {name: v} of vertices) {
        if (!used[v]) {
            if (adjacencyList[v].length > 0) {
                trace.push({ vertex: v, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
                trace.push({ from: v, to: adjacencyList[v][0].name, oriented, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
                return false;
            } else {
                trace.push({ vertex: v, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
            }
        }
    }

    return true;
};

const findEulerCycle = (vertices, edges, adjacencyList, trace) => {
    const oriented = edges[0].isOriented();
    const reversedAdjacencyList = edgesListToReversedAdjacencyList(vertices, edges);

    let start = vertices[0].name;
    trace.push({ vertex: start, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION });

    if (oriented)
        adjacencyList = reversedAdjacencyList;

    const currentVertices = [];
    let pathLen = 0;
    currentVertices.push(start);
    let cur;
    while (currentVertices.length > 0) {
        cur = currentVertices[currentVertices.length - 1];
        if (adjacencyList[cur].length > 0) {
            currentVertices.push(adjacencyList[cur][0].name);
            const to = adjacencyList[cur].shift().name;
            if (!oriented) {
                adjacencyList[to] = adjacencyList[to].filter(e => e.name !== cur);
            }
            trace.push({ from: cur, to, oriented: true, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
        } else {
            currentVertices.pop();
            if (currentVertices.length > 0) {
                if (pathLen === 0)
                    trace.push({ vertex: cur, action: VertexAction.COLOR_1, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
                trace.push({ from: cur, to: currentVertices[currentVertices.length - 1], oriented: true, weight: ++pathLen, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            }
        }
    }
};

export default {
    name: "Эйлеров цикл",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOTHING,

    call: (vertices, edges) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);

        trace = [];

        const startTime = window.performance.now();

        let isEuler = checkForEuler(vertices, edges, Object.assign({}, adjacencyList), trace);
        if (isEuler) {
            trace.push({ action: VertexAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
            trace.push({ action: EdgeAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
            findEulerCycle(vertices, edges, adjacencyList, trace);
        }

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        return {
            trace,
            statistics: [
                `Эйлеров цикл ${isEuler ? '' : 'не'} существует`,
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`
            ]
        };
    }
};