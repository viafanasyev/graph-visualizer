import {
    AlgorithmActionType,
    Criteria,
    EdgeAction,
    getOperationsCount,
    PreCallAction,
    VertexAction,
    VertexHintAction
} from "./index";
import { Queue } from "../../utils/queue";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";

let memoryUsed = 0;

const bfs = (start, vertices, adjacencyList, used, trace) => {
    const d = {}, p = {};
    vertices.forEach(vertex => {
        d[vertex.name] = Number.MAX_SAFE_INTEGER;
        p[vertex.name] = -1;
    });
    used[start] = true;
    const queue = new Queue();
    queue.push({ vertex: start, level: 0 });
    trace.push({ vertex: start, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });

    let vertex = 0, level = 0, to = 0;
    while (!queue.isEmpty()) {
        vertex = queue.peek().vertex;
        level = queue.pop().level;
        d[vertex] = level;
        adjacencyList[vertex].forEach(toVertex => {
            to = toVertex.name;
            if (!used[to]) {
                used[to] = true;
                queue.push({ vertex: to, level: level + 1 });
                p[to] = vertex;
            }
        });
    }

    while (p[vertex] !== -1) {
        trace.push({ vertex, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
        trace.push({ from: p[vertex], to: vertex, oriented: false, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
        vertex = p[vertex];
    }
    trace.push({ vertex, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
    trace.push({ vertex: start, hint: level, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });

    memoryUsed +=
        sizeof(d) +
        sizeof(p) +
        sizeof(queue) +
        sizeof(vertex) +
        sizeof(level) +
        sizeof(to);

    return level;
};

const findRadius = (vertices, edges, adjacencyList, trace) => {
    let used = {};
    vertices.forEach(vertex => used[vertex.name] = false);

    let eccentricities = {};
    let radius = Number.MAX_SAFE_INTEGER;
    for (const {name: start} of vertices) {
        vertices.forEach(vertex => used[vertex.name] = false);
        eccentricities[start] = bfs(start, vertices, adjacencyList, used, trace);
        trace.push({ vertex: start, hint: eccentricities[start], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });

        trace.push({ action: VertexAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
        trace.push({ action: EdgeAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });

        radius = Math.min(radius, eccentricities[start]);
    }

    for (const {name: v} of vertices) {
        if (eccentricities[v] === radius)
            trace.push({ vertex: v, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
    }

    memoryUsed +=
        sizeof(used) +
        sizeof(eccentricities) +
        sizeof(radius);

    return radius;
};

export default {
    name: "Радиус и центр графа",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOT_ORIENTED | Criteria.CONNECTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const trace = [];
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        memoryUsed = 0;

        const startTime = window.performance.now();

        const radius = findRadius(vertices, edges, adjacencyList, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(adjacencyList) +
            sizeof(radius);

        return {
            trace,
            statistics: [
                `Радиус графа: ${radius}`,
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ]
        };
    }
};