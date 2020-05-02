import { AlgorithmActionType, PreCallAction, VertexAction } from "./index";
import { Queue } from "../../utils/queue";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";

const bfs = (start, adjacencyList, used, trace) => {
    used[start] = true;
    const queue = new Queue();
    queue.push(start);
    trace.push({ vertex: start, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
    let vertex;
    while (!queue.isEmpty()) {
        vertex = queue.pop();
        trace.push({ vertex, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION });
        adjacencyList[vertex].forEach(to => {
            if (!used[to]) {
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

    call: (vertices, edges, start) => {
        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        let used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        let trace = [];
        bfs(start.name, adjacencyList, used, trace);
        return trace;
    }
};