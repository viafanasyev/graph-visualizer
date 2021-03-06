import { AlgorithmActionType, Criteria, EdgeAction, getOperationsCount, PreCallAction } from "./index";
import { DSU } from "../../utils/dsu";
import { sizeof } from "../../utils/sizeof";
import React from "react";

let memoryUsed = 0;

const kruskal = (vertices, edges, trace) => {
    const dsu = new DSU();
    vertices.forEach(v => dsu.makeSet(v.name));
    edges.sort((a, b) => a.weight - b.weight);

    edges.forEach(e => {
        trace.push({ from: e.from.name, to: e.to.name, oriented: false, weight: e.weight, action: EdgeAction.SHADOW, actionType: AlgorithmActionType.EDGE_ACTION, isChained: true });
    });

    let mstWeight = 0;
    let from = 0, to = 0, weight = 0;
    edges.forEach(e => {
        from = e.from.name;
        to = e.to.name;
        weight = Number(e.weight);
        trace.push({ from, to, oriented: false, weight, action: EdgeAction.HIGHLIGHT, actionType: AlgorithmActionType.EDGE_ACTION });
        if (dsu.find(from) !== dsu.find(to)) {
            mstWeight += weight;
            dsu.union(from, to);
            trace.push({ from, to, oriented: false, weight, action: EdgeAction.WALK, actionType: AlgorithmActionType.EDGE_ACTION });
        } else {
            trace.push({ from, to, oriented: false, weight, action: EdgeAction.SHADOW, actionType: AlgorithmActionType.EDGE_ACTION });
        }
    });

    memoryUsed +=
        sizeof(dsu) +
        sizeof(mstWeight) +
        sizeof(from) +
        sizeof(to) +
        sizeof(weight);

    return mstWeight;
};

export default {
    name: "Поиск минимального каркаса (Алгоритм Краскала)",

    preCall: PreCallAction.NOTHING,

    criteria: Criteria.CONNECTED | Criteria.WEIGHTED | Criteria.NOT_ORIENTED,

    call: (vertices, edges) => {
        if (vertices.length === 0)
            return {trace: [], statistics: []};

        let trace = [];
        memoryUsed = 0;

        const startTime = window.performance.now();

        const mstWeight = kruskal(vertices, edges, trace);

        const endTime = window.performance.now();
        const duration = endTime - startTime;

        return {
            trace,
            statistics: [
                `Вес минимального каркаса: ${mstWeight}`,
                `Время исполнения алгоритма: ${duration.toFixed(4)}мс`,
                `Кол-во шагов визуализации: ${getOperationsCount(trace)}`,
                `Память: ${memoryUsed} байт(а)`
            ],
            algorithmInfo: [
                "Временная сложность алгоритма:",
                <ul>
                    <li>
                        Список рёбер + СНМ: O(|E| * log|E|)
                    </li>
                </ul>,
                "Псевдокод:",
                <pre>
                    <code>{`
  function mst():
      отсортировать рёбра по возрастанию их веса

      для каждого ребра E из списка:
          если добавление ребра E в MST не образует цикл:
              добавить E в MST
                    `}</code>
                </pre>,
                "Легенда:",
                <ul>
                    <li>Жёлтые рёбра - просматриваемые</li>
                    <li>Красные рёбра - рёбра каркаса</li>
                </ul>
            ]
        };
    }
};