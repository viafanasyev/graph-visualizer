import {
    AlgorithmActionType,
    Criteria,
    EdgeAction,
    getOperationsCount,
    PreCallAction,
    VertexAction,
    VertexHintAction
} from "./index";
import { edgesListToAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";
import React from "react";

let used = {};
let trace = [];
let timer = 0;
let tin = {}, tout = {};
let countBridges = 0;
let memoryUsed = 0;

const dfs = (vertex, adjacencyList, parent = -1) => {
    used[vertex] = true;
    tin[vertex] = tout[vertex] = timer++;
    trace.push({ vertex, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
    trace.push({ vertex, hint: tin[vertex] + " " + tout[vertex], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });

    for (const {name: to} of adjacencyList[vertex]) {
        if (to === parent)
            continue;
        if (!used[to]) {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            dfs(to, adjacencyList, vertex);
            tout[vertex] = Math.min(tout[vertex], tout[to]);
            trace.push({ vertex, hint: tin[vertex] + " " + tout[vertex], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION });
            if (tout[to] > tin[vertex]) {
                ++countBridges;
                trace.push({ from: vertex, to, oriented: false, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
            }
        } else {
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            tout[vertex] = Math.min(tout[vertex], tin[to]);
            trace.push({ vertex, hint: tin[vertex] + " " + tout[vertex], action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION, isChained: true });
            trace.push({ from: vertex, to: to, oriented: true, action: EdgeAction.UNSELECT, actionType: AlgorithmActionType.EDGE_ACTION });
        }
    }

    trace.push({ vertex, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
};

const findBridges = (vertices, edges, adjacencyList) => {
    used = {};
    vertices.forEach(vertex => used[vertex.name] = false);
    timer = 0;
    tin = {};
    tout = {};
    countBridges = 0;

    for (const {name: start} of vertices) {
        if (!used[start])
            dfs(start, adjacencyList);
    }
};

export default {
    name: "Поиск мостов",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);
        trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        findBridges(vertices, edges, adjacencyList);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(used) +
            sizeof(adjacencyList) +
            sizeof(timer) +
            sizeof(tin) +
            sizeof(tout) +
            sizeof(countBridges);

        return {
            trace,
            statistics: [
                `Количество мостов: ${countBridges}`,
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
  function dfs(v):
      отметить v как посещённую
      tin[v] = fup[v] = timer
      timer++

      для всех рёбер (v, u):
          если u не посещена:
              dfs(u)
              fup[v] = min(fup[v], fup[u])
              если fup[u] > tin[v]:
                  ребро (v, u) - мост
          иначе:
              fup[v] = min(fup[v], tin[u])

  timer - счётчик времени
  tin[] - время входа в вершину
  fup[v] - min(tin[v], fup[u], tin[p]), 
           где ребро (v, u) - прямое, (v, p) - обратное

  для всех непосещённых вершин v:
      dfs(v)
                    `}</code>
                </pre>,
                "Легенда:",
                <ul>
                    <li>Белые вершины - не посещённые</li>
                    <li>Серые вершины - обрабатываемые</li>
                    <li>Чёрные вершины - обрабатанные</li>
                    <li>Красные рёбра - рёбра обхода</li>
                    <li>Жёлтые ребра - мосты</li>
                    <li>Красные числа - пары tin и fup (см. псевдокод)</li>
                </ul>
            ]
        };
    }
};