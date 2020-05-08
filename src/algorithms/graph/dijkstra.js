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

let memoryUsed = 0;

const dijkstra = (start, vertices, adjacencyList, used, trace) => {
    const d = {};
    vertices.forEach(v => {
        if (v === start)
            return;
        d[v] = Number.MAX_SAFE_INTEGER;
        trace.push({ vertex: v, hint: "∞", action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
    });
    d[start] = 0;
    trace.push({ vertex: start, hint: "0", action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });

    for (let i in vertices) {
        let v = -1;

        memoryUsed += sizeof(v);

        vertices.forEach(j => {
            if (!used[j] && ((v === -1) || (d[j] < d[v])))
                v = j;
        });
        if (d[v] === Number.MAX_SAFE_INTEGER)
            break;

        used[v] = true;
        trace.push({ vertex: v, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION });

        for (let {name: to, weight} of adjacencyList[v]) {
            if (used[to])
                continue;
            weight = Number(weight);

            trace.push({ from: v, to, oriented: true, weight, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
            if (d[v] + weight < d[to]) {
                d[to] = d[v] + weight;
                trace.push({ from: v, to, oriented: true, weight, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                trace.push({ vertex: to, hint: d[to], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            } else {
                trace.push({ from: v, to, oriented: true, weight, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION });
            }
        }
        trace.push({ vertex: v, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    }

    memoryUsed += sizeof(d);
};

export default {
    name: "Алгоритм Дейкстры",

    preCall: PreCallAction.SELECT_VERTEX,

    criteria: Criteria.WEIGHTED,

    call: (vertices, edges, start) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        let used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        let trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        dijkstra(start.name, vertices.map(v => v.name), adjacencyList, used, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(used) +
            sizeof(adjacencyList);

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