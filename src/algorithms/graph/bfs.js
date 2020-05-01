import { algorithmActionType, preCallAction, vertexAction } from "./index";
import { Queue } from "../../utils/queue";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";

let used = {};
let trace = [];

const bfs = (start, adjacencyList) => {
    used[start] = true;
    const queue = new Queue();
    queue.push(start);
    trace.push({ vertex: start, action: vertexAction.ENTER, actionType: algorithmActionType.VERTEX_ACTION });
    let vertex;
    while (!queue.isEmpty()) {
        vertex = queue.pop();
        trace.push({ vertex, action: vertexAction.SELECT, actionType: algorithmActionType.VERTEX_ACTION });
        adjacencyList[vertex].forEach(to => {
            if (!used[to]) {
                used[to] = true;
                queue.push(to);
                trace.push({ vertex: to, action: vertexAction.ENTER, actionType: algorithmActionType.VERTEX_ACTION });
            }
        });
        trace.push({ vertex, action: vertexAction.EXIT, actionType: algorithmActionType.VERTEX_ACTION });
    }
};

export default {
    name: "Поиск в ширину",

    preCall: preCallAction.SELECT_VERTEX,

    call: (vertices, edges, start) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        trace = [];
        bfs(start.name, adjacencyList);
        return trace;
    }
};