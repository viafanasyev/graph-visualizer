import { algorithmActionType, preCallAction, vertexAction } from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";

let used = {};
let trace = [];

const dfs = (vertex, adjacencyList) => {
    used[vertex] = true;
    trace.push({ vertex, action: vertexAction.ENTER, actionType: algorithmActionType.VERTEX_ACTION });
    adjacencyList[vertex].forEach(to => {
        if (!used[to]) {
            dfs(to, adjacencyList);
        }
    });
    trace.push({ vertex, action: vertexAction.EXIT, actionType: algorithmActionType.VERTEX_ACTION });
};

export default {
    name: "Поиск в глубину",

    preCall: preCallAction.SELECT_VERTEX,

    call: (vertices, edges, start) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        trace = [];
        dfs(start.name, adjacencyList);
        return trace;
    }
};