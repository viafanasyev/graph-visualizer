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

const prim = (start, vertices, edges, adjacencyList, used, trace) => {
    edges.forEach(e => {
        trace.push({ from: e.from.name, to: e.to.name, oriented: false, weight: e.weight, action: EdgeAction.SHADOW, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
    });

    const d = {};
    const mst = {};
    vertices.forEach(v => {
        if (v === start)
            return;
        d[v] = Number.MAX_SAFE_INTEGER;
        trace.push({ vertex: v, hint: "∞", action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
        mst[v] = null;
    });
    d[start] = 0;
    trace.push({ vertex: start, hint: "0", action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });

    for (let i in vertices) {
        let v = -1;
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

            trace.push({ from: v, to, oriented: false, weight, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
            if (weight < d[to]) {
                d[to] = weight;
                if (mst[to] !== null) {
                    trace.push({ from: mst[to], to, oriented: false, weight, action: EdgeAction.SHADOW, actionType: AlgorithmActionType.EDGE_ACTION, isChained: false });
                }
                mst[to] = v;
                trace.push({ from: v, to, oriented: false, weight, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                trace.push({ vertex: to, hint: d[to], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            } else {
                trace.push({ from: v, to, oriented: false, weight, action: EdgeAction.SHADOW, actionType: AlgorithmActionType.EDGE_ACTION });
            }
        }
        trace.push({ vertex: v, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    }

    let mstWeight = 0;
    for (const v in d)
        mstWeight += d[v];
    return mstWeight;
};

export default {
    name: "Алгоритм Прима",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.CONNECTED | Criteria.WEIGHTED | Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        let used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        let trace = [];

        const startTime = window.performance.now();

        const start = vertices[Math.floor(Math.random() * vertices.length)];
        const mstWeight = prim(start.name, vertices.map(v => v.name), edges, adjacencyList, used, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        return {
            trace,
            statistics: [
                `Вес минимального каркаса: ${mstWeight}`,
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`
            ]
        };
    }
};