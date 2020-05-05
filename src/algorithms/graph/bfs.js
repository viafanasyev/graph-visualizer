import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction, VertexAction } from "./index";
import { Queue } from "../../utils/queue";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";

const bfs = (start, adjacencyList, used, trace) => {
    used[start] = true;
    const queue = new Queue();
    queue.push(start);
    trace.push({ vertex: start, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
    let vertex, to;
    while (!queue.isEmpty()) {
        vertex = queue.pop();
        trace.push({ vertex, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION });
        adjacencyList[vertex].forEach(toVertex => {
            to = toVertex.name;
            if (!used[to]) {
                trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
                used[to] = true;
                queue.push(to);
                trace.push({ vertex: to, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
            }
        });
        trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    }
};

export default {
    name: "Поиск в ширину",

    preCall: PreCallAction.SELECT_VERTEX,

    criteria: Criteria.NOTHING,

    call: (vertices, edges, start) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        let used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        let trace = [];

        const startTime = window.performance.now();

        bfs(start.name, adjacencyList, used, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        return {
            trace,
            statistics: [
                `Время: ${duration.toFixed(4)}мс`,
                `Кол-во операций: ${getOperationsCount(trace)}`
            ]
        };
    }
};