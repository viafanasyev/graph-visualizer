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
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
            dfs(to, adjacencyList);
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
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
    const isStartVertex = {};
    vertices.forEach(vertex => {
        used[vertex.name] = false;
        isStartVertex[vertex.name] = true;
    });
    for (const {name: from} of vertices) {
        adjacencyList[from].forEach(to => {
            isStartVertex[to.name] = false;
        });
    }
    addedVertices = 0;
    sortedVertices = 0;

    for (const {name: start} of vertices) {
        if (isStartVertex[start]) {
            dfs(start, adjacencyList);
        }
    }

    for (const v of topSortList.reverse()) {
        trace.push({ vertex: v, hint: sortedVertices++, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
        trace.push({ vertex: v, action: VertexAction.UNSELECT, actionType: AlgorithmActionType.VERTEX_ACTION });
    }

    memoryUsed += sizeof(isStartVertex);
};

export default {
    name: "Топологическая сортировка",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.ORIENTED | Criteria.ACYCLIC,

    call: (vertices, edges) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        topSort(vertices, edges, adjacencyList, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(adjacencyList) +
            sizeof(used) +
            sizeof(topSortList) +
            sizeof(addedVertices) +
            sizeof(sortedVertices);

        return {
            trace,
            statistics: [
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ]
        };
    }
};