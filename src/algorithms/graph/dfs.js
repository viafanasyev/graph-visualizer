import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction, VertexAction } from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";

let used = {};
let trace = [];
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
            trace.push({ from: to, to: vertex, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
        }
    });
    trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });

    memoryUsed += sizeof(to);
};

export default {
    name: "Поиск в глубину",

    preCall: PreCallAction.SELECT_VERTEX,

    criteria: Criteria.NOTHING,

    call: (vertices, edges, start) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        dfs(start.name, adjacencyList);

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