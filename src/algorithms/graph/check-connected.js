import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction, VertexAction } from "./index";
import { Queue } from "../../utils/queue";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";
import React from "react";

let memoryUsed = 0;

const bfs = (start, vertices, adjacencyList, used, trace) => {
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
                trace.push({ from: vertex, to: to, oriented: false, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
                used[to] = true;
                queue.push(to);
                trace.push({ vertex: to, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
            }
        });
        trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    }

    memoryUsed += sizeof(queue) + sizeof(vertex) + sizeof(to);
    for (const vertex of vertices) {
        if (!used[vertex.name])
            return false;
    }
    return true;
};

export default {
    name: "Проверка на связность",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        let used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        let trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        const start = vertices[Math.floor(Math.random() * vertices.length)];
        const isConnected = bfs(start.name, vertices, adjacencyList, used, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(isConnected) +
            sizeof(used) +
            sizeof(adjacencyList);

        return {
            trace,
            statistics: [
                `Граф ${isConnected ? "связный" : "несвязный"}`,
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
  function check():
      запустить обход в глубину/ширину от случайной вершины
      если хотя бы одна вершина осталась непосещённой:
          граф несвязный
      иначе:
          граф связный
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