import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction, VertexAction } from "./index";
import { Queue } from "../../utils/queue";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";
import React from "react";

let memoryUsed = 0;

const bfs = (start, adjacencyList, used, trace) => {
    used[start] = true;
    const queue = new Queue();
    queue.push(start);
    trace.push({ vertex: start, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
    let vertex = 0, to = 0;
    while (!queue.isEmpty()) {
        vertex = queue.pop();
        trace.push({ vertex, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION });
        adjacencyList[vertex].forEach(toVertex => {
            to = toVertex.name;
            if (!used[to]) {
                trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                used[to] = true;
                queue.push(to);
                trace.push({ vertex: to, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
            }
        });
        trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    }

    memoryUsed += sizeof(queue) + sizeof(vertex) + sizeof(to);
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
        memoryUsed = 0;

        const startTime = window.performance.now();

        bfs(start.name, adjacencyList, used, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(used) +
            sizeof(adjacencyList);

        return {
            trace,
            statistics: [
                `Время исполнения алгоритма: ${duration.toFixed(4)}мс`,
                `Кол-во шагов визуализации: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ],
            algorithmInfo: [
                "Временная сложность алгоритма:",
                <ul>
                    <li>
                        Список смежности: O(|V| + |E|)
                    </li>
                    <li>
                        Матрица смежности: O(|V|^2)
                    </li>
                </ul>,
                "Псевдокод:",
                <pre>
                    <code>{`
  function bfs(start):
      добавить вершину start в очередь

      пока очередь не пуста:
          достать вершину v из очереди
          для всех рёбер (v, u):
              если вершина u не обработана и не в очереди:
                  добавить u в очередь
          отметить v как обработанную
                    `}</code>
                </pre>,
                "Легенда:",
                <ul>
                    <li>Белые вершины - не посещённые</li>
                    <li>Серые вершины - добавленные в очередь</li>
                    <li>Чёрные вершины - обрабатанные</li>
                    <li>Жёлтая вершина - обрабатываемая</li>
                    <li>Красные рёбра - рёбра дерева обхода</li>
                </ul>
            ]
        };
    }
};