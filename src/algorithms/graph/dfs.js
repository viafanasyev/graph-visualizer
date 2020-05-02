import { AlgorithmActionType, EdgeAction, PreCallAction, VertexAction } from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";

let used = {};
let trace = [];

const dfs = (vertex, adjacencyList) => {
    used[vertex] = true;
    trace.push({ vertex, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
    adjacencyList[vertex].forEach(to => {
        if (!used[to]) {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            dfs(to, adjacencyList);
            trace.push({ from: to, to: vertex, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
        }
    });
    trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
};

export default {
    name: "Поиск в глубину",

    preCall: PreCallAction.SELECT_VERTEX,

    call: (vertices, edges, start) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        trace = [];
        dfs(start.name, adjacencyList);
        return trace;
    }
};