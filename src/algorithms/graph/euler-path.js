import {
    AlgorithmActionType,
    Criteria,
    EdgeAction,
    getOperationsCount,
    PreCallAction,
    VertexAction,
    VertexHintAction
} from "./index";
import { edgesListToAdjacencyList, edgesListToReversedAdjacencyList } from "../../utils/graphConverter";
import { sizeof } from "../../utils/sizeof";
import React from "react";

let trace = [];
let memoryUsed = 0;

const checkForEuler = (vertices, edges, adjacencyList, trace) => {
    let oriented = edges[0].isOriented();
    const reversedAdjacencyList = edgesListToReversedAdjacencyList(vertices, edges);

    memoryUsed += sizeof(oriented) + sizeof(reversedAdjacencyList);

    if (!oriented) {

        // Delete loops to prevent odd degrees
        for (const {name: v} of vertices) {
            adjacencyList[v] = adjacencyList[v].filter(toVertex => toVertex.name !== v);
        }

        let oddVertices = 0;
        memoryUsed += sizeof(oddVertices);

        for (const {name: v} of vertices) {
            if (adjacencyList[v].length % 2 === 1) {
                ++oddVertices;
                if (oddVertices > 2) {
                    trace.push({ vertex: v, hint: 1, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
                    return false;
                } else
                    trace.push({ vertex: v, hint: 1, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            } else {
                trace.push({ vertex: v, hint: 0, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            }
        }
    } else {
        let outOddVertices = 0;
        let inOddVertices = 0;
        let degree = 0;
        memoryUsed += sizeof(outOddVertices) + sizeof(inOddVertices) + sizeof(degree);

        for (const {name: v} of vertices) {
            degree = reversedAdjacencyList[v].length - adjacencyList[v].length;
            if (degree === 1) {
                ++outOddVertices;
                if (outOddVertices > 1) {
                    trace.push({ vertex: v, hint: degree, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
                    return false;
                } else
                    trace.push({ vertex: v, hint: degree, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            } else if (degree === -1) {
                ++inOddVertices;
                if (outOddVertices > 1) {
                    trace.push({ vertex: v, hint: degree, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
                    return false;
                } else
                    trace.push({ vertex: v, hint: degree, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            } else if (degree !== 0) {
                trace.push({ vertex: v, hint: degree, action: VertexHintAction.SET, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
                return false;
            } else {
                trace.push({ vertex: v, hint: 0, action: VertexHintAction.HIGHLIGHT, actionType: AlgorithmActionType.VERTEX_HINT_ACTION });
            }
        }
    }

    const used = {};
    vertices.forEach(vertex => used[vertex.name] = false);
    const dfs = (v) => {
        used[v] = true;
        trace.push({ vertex: v, action: VertexAction.ENTER, actionType: AlgorithmActionType.VERTEX_ACTION });
        for (const {name: to} of adjacencyList[v]) {
            if (!used[to]) {
                trace.push({ from: v, to, oriented, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                dfs(to);
            }
        }
        if (oriented) {
            for (const {name: from} of reversedAdjacencyList[v]) {
                if (!used[from]) {
                    trace.push({ from, to: v, oriented, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
                    dfs(from);
                }
            }
        }
        trace.push({ vertex: v, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
    };

    dfs(vertices[0].name);
    memoryUsed += sizeof(used);

    for (const {name: v} of vertices) {
        if (!used[v]) {
            if (adjacencyList[v].length > 0) {
                trace.push({ vertex: v, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
                trace.push({ from: v, to: adjacencyList[v][0].name, oriented, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
                return false;
            } else {
                trace.push({ vertex: v, action: VertexAction.EXIT, actionType: AlgorithmActionType.VERTEX_ACTION });
            }
        }
    }

    return true;
};

const findEulerPath = (vertices, edges, adjacencyList, trace) => {
    const oriented = edges[0].isOriented();
    const reversedAdjacencyList = edgesListToReversedAdjacencyList(vertices, edges);

    let start = vertices[0].name;
    for (const {name: v} of vertices) {
        if (!oriented) {
            if (adjacencyList[v].length % 2 === 1) {
                start = v;
                break;
            }
        } else {
            if (reversedAdjacencyList[v].length - adjacencyList[v].length === 1) {
                start = v;
                break;
            }
        }
    }
    trace.push({ vertex: start, action: VertexAction.SELECT, actionType: AlgorithmActionType.VERTEX_ACTION });

    if (oriented)
        adjacencyList = reversedAdjacencyList;

    const currentVertices = [];
    let pathLen = 0;
    currentVertices.push(start);
    let cur;
    while (currentVertices.length > 0) {
        cur = currentVertices[currentVertices.length - 1];
        if (adjacencyList[cur].length > 0) {
            currentVertices.push(adjacencyList[cur][0].name);
            const to = adjacencyList[cur].shift().name;
            if (!oriented) {
                adjacencyList[to] = adjacencyList[to].filter(e => e.name !== cur);
            }
            trace.push({ from: cur, to, oriented: true, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });

            memoryUsed += sizeof(to);
        } else {
            currentVertices.pop();
            if (currentVertices.length > 0) {
                if (pathLen === 0)
                    trace.push({ vertex: cur, action: VertexAction.COLOR_1, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
                trace.push({ from: cur, to: currentVertices[currentVertices.length - 1], oriented: true, weight: ++pathLen, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
            }
        }
    }

    memoryUsed +=
        sizeof(oriented) +
        sizeof(reversedAdjacencyList) +
        sizeof(start) +
        sizeof(currentVertices) +
        sizeof(pathLen) +
        sizeof(cur);
};

export default {
    name: "Эйлеров путь",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.NOTHING,

    call: (vertices, edges) => {
        if (edges.length === 0)
            return {trace: [], statistics: []};

        const adjacencyList = edgesListToAdjacencyList(vertices, edges);

        trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        let isEuler = checkForEuler(vertices, edges, Object.assign({}, adjacencyList), trace);
        if (isEuler) {
            trace.push({ action: VertexAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.VERTEX_ACTION, isChained: true });
            trace.push({ action: EdgeAction.CLEAR_ALL_SELECTIONS, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
            findEulerPath(vertices, edges, adjacencyList, trace);
        }

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        memoryUsed +=
            sizeof(adjacencyList) +
            sizeof(isEuler);

        return {
            trace,
            statistics: [
                `Эйлеров путь ${isEuler ? '' : 'не'} существует`,
                `Время исполнения алгоритма: ${duration.toFixed(4)}мс`,
                `Кол-во шагов визуализации: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ],
            algorithmInfo: [
                "Временная сложность алгоритма:",
                <ul>
                    <li>
                        Список смежности: O(|V| + |E|) + проверка: O(|V|)
                    </li>
                </ul>,
                "Псевдокод:",
                <pre>
                    <code>{`
  function find_euler_path():
      эйлеров путь существует, если:
          для неориентированного графа:
              степени всех вершин чётны, кроме, может быть, двух
              из всех компонент связности только в одной есть рёбра
          для ориентированного графа: 
              степень входа каждой вершины равна степени выхода, кроме,
                может быть, двух, для одной из которых:
                  степень_входа - степень_выхода = 1,
                а для другой:
                  степень_входа - степень_выхода = -1
              из всех компонент слабой связности только в одной есть рёбра

      если граф неориентированный:
          выбрать вершину v с нечётной степенью,
          либо любую, если таких нет
      иначе:
          выбрать вершину v, для которой
            степень_входа - степень_выхода = 1,
          либо любую, если таких нет

      v - конечная вершина пути

      добавить v в стек S
      пока стек не пуст:
          w = S.top()
          если существует ребро (u, w) входящее в w:
              S.push(u)
              удалить ребро (u, w) из рассмотрения
          иначе:
              S.pop()
              w - следующая вершина в эйлеровом цикле
              добавить ребро (w, S.top()) в эйлеров цикл, если стек не пуст
                    `}</code>
                </pre>,
                "Легенда:",
                <ul>
                    <li>Белые вершины - не посещённые</li>
                    <li>Серые вершины - обрабатываемые</li>
                    <li>Чёрные вершины - обрабатанные</li>
                    <li>Красные рёбра (при обходе) - рёбра обхода</li>
                    <li>Синие числа (для неор.графа) - 0 - вершина с чётной степенью, 1 - с нечётной</li>
                    <li>Синие числа (для ор.графа) - степень_входа - степень_выхода</li>
                    <li>&nbsp;</li>
                    <li>Жёлтая вершина - начальная (для обхода)</li>
                    <li>Красная вершина - начальная (для эйлерова пути)</li>
                    <li>Жёлтые ребра - рёбра обхода (при поиске пути)</li>
                    <li>Красные ребра - рёбра эйлерова пути</li>
                </ul>
            ]
        };
    }
};