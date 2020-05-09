import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction, VertexAction } from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";
import React from "react";

let used = {};
let trace = [];
let memoryUsed = 0;

const dfs = (vertex, adjacencyList, parent = -1, color = 1) => {
    used[vertex] = color;
    trace.push({ vertex, action: color === 1 ? VertexAction.COLOR_1 : VertexAction.COLOR_2, actionType: AlgorithmActionType.VERTEX_ACTION });
    let to;
    for (const toVertex of adjacencyList[vertex]) {
        to = toVertex.name;
        if (!used[to]) {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            if (!dfs(to, adjacencyList, vertex, 3 - color))
                return false;
            trace.push({ from: to, to: vertex, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
        } else if ((parent !== to) && (used[to] === color)) {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
            return false;
        }
    }
    return true;
};

export default {
    name: "Проверка на двудольность",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        used = {};
        vertices.forEach(vertex => used[vertex.name] = 0);
        trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        let isBipartite = true;
        for (const {name: vertex} of vertices) {
            if (!used[vertex]) {
                isBipartite &= dfs(vertex, adjacencyList);
                if (!isBipartite)
                    break;
            }
        }

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(isBipartite) +
            sizeof(used) +
            sizeof(adjacencyList);

        return {
            trace,
            statistics: [
                `Граф ${isBipartite ? "двудольный" : "недвудольный"}`,
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
  function dfs(v, color):
      покрасить v в цвет color

      для всех рёбер (v, u):
          если u не посещена:
              dfs(u, цвет обратный color)
          иначе:
              если цвет u равен color:
                  граф недвудольный

  для всех непокрашенных вершин v:
      dfs(v, случайный цвет)

  если удалось покрасить все вершины:
      граф двудольный
                    `}</code>
                </pre>,
                "Легенда:",
                <ul>
                    <li>Белые вершины - не посещённые</li>
                    <li>Красные и синие вершины - обработанные</li>
                    <li>Красные рёбра - рёбра дерева обхода</li>
                </ul>
            ]
        };
    }
};