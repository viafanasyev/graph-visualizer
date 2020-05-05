import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction } from "./index";
import { DSU } from "../../utils/dsu";

const kruskal = (vertices, edges, trace) => {
    const dsu = new DSU();
    vertices.forEach(v => dsu.makeSet(v.name));
    edges.sort((a, b) => a.weight - b.weight);

    edges.forEach(e => {
        trace.push({ from: e.from.name, to: e.to.name, oriented: false, weight: e.weight, action: EdgeAction.SHADOW, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
    });

    let mstWeight = 0;
    let from, to, weight;
    edges.forEach(e => {
        from = e.from.name;
        to = e.to.name;
        weight = Number(e.weight);
        trace.push({ from, to, oriented: false, weight, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
        if (dsu.find(from) !== dsu.find(to)) {
            mstWeight += weight;
            dsu.union(from, to);
            trace.push({ from, to, oriented: false, weight, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
        } else {
            trace.push({ from, to, oriented: false, weight, action: EdgeAction.SHADOW, actionType: AlgorithmActionType.EDGE_ACTION });
        }
    });

    return mstWeight;
};

export default {
    name: "Алгоритм Краскала",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.CONNECTED | Criteria.WEIGHTED | Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        let trace = [];

        const startTime = window.performance.now();

        const mstWeight = kruskal(vertices, edges, trace);

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