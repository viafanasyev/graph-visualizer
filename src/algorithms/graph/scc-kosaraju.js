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

let used = {};
let trace = [];
let topSortList = [];
let addedVertices = 0;
let sortedVertices = 0;

const dfs = (vertex, adjacencyList) => {
    used[vertex] = true;
    trace.push({ vertex, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
    let to;
    adjacencyList[vertex].forEach(toVertex => {
        to = toVertex.name;
        if (!used[to]) {
            trace.push({ from: vertex, to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
            dfs(to, adjacencyList);
            trace.push({ from: vertex, to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
        }
    });
    trace.push({ vertex, hint: addedVertices++, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
    trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    topSortList.push(vertex);
};

const topSort = (vertices, edges, adjacencyList, trace) => {
    used = {};
    topSortList = [];
    vertices.forEach(vertex => used[vertex.name] = false);
    addedVertices = 0;
    sortedVertices = 0;

    for (const {name: start} of vertices) {
        if (!used[start]) {
            dfs(start, adjacencyList);
        }
    }

    for (const v of topSortList.reverse()) {
        trace.push({ vertex: v, hint: sortedVertices++, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
        trace.push({ vertex: v, action: VertexAction.UNSELECT, actionType: AlgorithmActionType.VERTEX_ACTION });
    }
};

const findComponents = (vertices, edges, adjacencyList, trace) => {
    for (const {from, to} of edges) {
        trace.push({ from: from.name, to: to.name, oriented: true, action: EdgeAction.FLIP, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
    }
    trace[trace.length - 1].isChained = false;

    vertices.forEach(vertex => used[vertex.name] = false);

    let componentsNumber = 0;

    const dfsComponents = (vertex) => {
        used[vertex] = true;
        trace.push({ vertex, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
        trace.push({ vertex, hint: componentsNumber, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION});

        let to;
        adjacencyList[vertex].forEach(toVertex => {
            to = toVertex.name;
            if (!used[to]) {
                trace.push({ from: vertex, to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                dfsComponents(to);
                trace.push({ from: vertex, to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
            }
        });

        trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    };

    for (const v of topSortList) {
        if (!used[v]) {
            dfsComponents(v);
            ++componentsNumber;
        }
    }

    for (const {from, to} of edges) {
        trace.push({ from: from.name, to: to.name, oriented: true, action: EdgeAction.FLIP, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
    }

    return componentsNumber;
};

export default {
    name: "Конденсация графа (алгоритм Косарайю)",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.ORIENTED,

    call: (vertices, edges) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        const reversedAdjacencyList = edgesListToReversedAdjacencyList(vertices, edges);

        trace = [];

        const startTime = window.performance.now();

        topSort(vertices, edges, adjacencyList, trace);
        const componentsNumber = findComponents(vertices, edges, reversedAdjacencyList, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        return {
            trace,
            statistics: [
                `Количество компонент сильной связности: ${componentsNumber}`,
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`
            ]
        };
    }
};