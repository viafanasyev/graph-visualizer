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
        sizeof(queue) +
        sizeof(d) +
        sizeof(p) +
        sizeof(vertex) +
        sizeof(level) +
        sizeof(to);

    return level;
};

const findDiameter = (vertices, edges, adjacencyList, trace) => {
    let used = {};
    vertices.forEach(vertex => used[vertex.name] = false);

    let eccentricities = {};
    let diameter = 0;
    for (const {name: start} of vertices) {
        vertices.forEach(vertex => used[vertex.name] = false);
        eccentricities[start] = bfs(start, vertices, adjacencyList, used, trace);
        trace.push({ vertex: start, hint: eccentricities[start], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });

        trace.push({ action: VertexAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
        trace.push({ action: EdgeAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });

        diameter = Math.max(diameter, eccentricities[start]);
    }

    for (const {name: v} of vertices) {
        if (eccentricities[v] === diameter)
            trace.push({ vertex: v, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
    }

    memoryUsed +=
        sizeof(used) +
        sizeof(eccentricities) +
        sizeof(diameter);

    return diameter;
};

export default {
    name: "Диаметр и переферийные вершины графа",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOT_ORIENTED | Criteria.CONNECTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const trace = [];
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        memoryUsed = 0;

        const startTime = window.performance.now();

        const diameter = findDiameter(vertices, edges, adjacencyList, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(adjacencyList) +
            sizeof(diameter);

        return {
            trace,
            statistics: [
                `Диаметр графа: ${diameter}`,
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ]
        };
    }
};