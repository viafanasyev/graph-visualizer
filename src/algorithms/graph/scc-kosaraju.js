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
import { sizeof } from "../../utils/sizeof";

let used = {};
let trace = [];
let topSortList = [];
let addedVertices = 0;
let sortedVertices = 0;
let memoryUsed = 0;

const dfs = (vertex, adjacencyList) => {
    used[vertex] = true;
    trace.push({ vertex, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
    let to = 0;
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

    memoryUsed += sizeof(to);
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
    if (edges.length > 0)
        trace[trace.length - 1].isChained = false;

    vertices.forEach(vertex => used[vertex.name] = false);

    let componentsNumber = 0;

    const dfsComponents = (vertex) => {
        used[vertex] = true;
        trace.push({ vertex, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
        trace.push({ vertex, hint: componentsNumber, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION});

        let to = 0;
        adjacencyList[vertex].forEach(toVertex => {
            to = toVertex.name;
            if (!used[to]) {
                trace.push({ from: vertex, to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                dfsComponents(to);
                trace.push({ from: vertex, to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
            }
        });

        trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });

        memoryUsed += sizeof(to);
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

    memoryUsed += sizeof(componentsNumber);

    return componentsNumber;
};

export default {
    name: "Поиск компонент сильной связности (Алгоритм Косарайю)",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        const reversedAdjacencyList = edgesListToReversedAdjacencyList(vertices, edges);

        trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        topSort(vertices, edges, adjacencyList, trace);
        const componentsNumber = findComponents(vertices, edges, reversedAdjacencyList, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(adjacencyList) +
            sizeof(reversedAdjacencyList) +
            sizeof(componentsNumber) +
            sizeof(used) +
            sizeof(topSortList) +
            sizeof(addedVertices) +
            sizeof(sortedVertices);

        return {
            trace,
            statistics: [
                `Количество компонент сильной связности: ${componentsNumber}`,
                `Время исполнения алгоритма: ${duration.toFixed(4)}мс`,
                `Кол-во шагов визуализации: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ]
        };
    }
};