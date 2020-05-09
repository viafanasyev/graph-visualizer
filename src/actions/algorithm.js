import { algorithmStep, changeGraphMode, closeMessage, showMessage } from "./index";
import { GraphMode } from "../components/Graph/Graph";
import { Criteria, PreCallAction } from "../algorithms/graph";
import { sleep } from "../utils/sleep";
import { edgesListToAdjacencyList } from "../utils/graphConverter";

export const ActionType = Object.freeze({
    PRE_CALL: 'PRE_CALL',
    CALL: 'CALL',
    START: 'START',
    PAUSE: 'PAUSE',
    POP_TRACE_STEP: 'POP_TRACE_STEP',
    SET_ALGORITHM: 'SET_ALGORITHM',
    SET_SPEED: 'SET_SPEED',
    SET_IS_ONE_STEP: 'SET_IS_ONE_STEP',
    CLEAR_TRACE: 'CLEAR_TRACE',
    SHOW_STATISTICS: 'SHOW_STATISTICS',
    CLEAR_STATISTICS: 'CLEAR_STATISTICS',
    SHOW_ALGORITHM_INFO: 'SHOW_ALGORITHM_INFO',
    CLEAR_ALGORITHM_INFO: 'CLEAR_ALGORITHM_INFO',
    INVERT_ALGORITHM_INFO_COLLAPSED: 'INVERT_ALGORITHM_INFO_COLLAPSED'
});

export const preCall = (isOneStep = false) => (dispatch, getState) => {
    dispatch(setIsOneStep(isOneStep));

    const graph = getState().graphReducer.graph;
    const vertices = graph.vertices;
    const edges = graph.edges;
    const adjacencyList = edgesListToAdjacencyList(vertices, edges);

    const criteria = getState().algorithmReducer.algorithm.criteria;
    if (criteria & Criteria.WEIGHTED) {
        for (const edge of edges) {
            if (!edge.isWeighted()) {
                dispatch(showMessage("Граф должен быть взвешенным!", true));
                return;
            }
        }
    }
    if ((criteria & Criteria.NOT_ORIENTED) && graph.isOriented()) {
        dispatch(showMessage("Граф должен быть неориентированным!", true));
        return;
    }
    if ((criteria & Criteria.ORIENTED) && !graph.isOriented()) {
        dispatch(showMessage("Граф должен быть ориентированным!", true));
        return;
    }
    if ((criteria & Criteria.CONNECTED) && (vertices.length > 0)) {
        let used = {};
        vertices.forEach(vertex => used[vertex.name] = false);
        const dfs = (v) => {
            used[v] = true;
            let to;
            adjacencyList[v].forEach(toVertex => {
                to = toVertex.name;
                if (!used[to]) {
                    dfs(to);
                }
            });
        };
        dfs(vertices[0].name);

        for (const v of vertices) {
            if (!used[v.name]) {
                dispatch(showMessage("Граф должен быть связным!", true));
                return;
            }
        }
    }
    if ((criteria & Criteria.ACYCLIC) && (vertices.length > 0)) {
        let used = {};
        vertices.forEach(vertex => used[vertex.name] = 0);
        const dfs = (v) => {
            used[v] = 1;
            let to;
            for (const toVertex of adjacencyList[v]) {
                to = toVertex.name;
                if (!used[to]) {
                    if (!dfs(to))
                        return false;
                } else if (used[to] === 1) {
                    return false;
                }
            }
            used[v] = 2;
            return true;
        };
        for (const {name: start} of vertices) {
            if (!used[start] && !dfs(start)) {
                dispatch(showMessage("Граф должен быть ацикличным!", true));
                return;
            }
        }
    }

    const preCall = getState().algorithmReducer.algorithm.preCall;
    if (preCall === PreCallAction.SELECT_VERTEX) {
        dispatch(changeGraphMode(GraphMode.ALGORITHM_PRE_CALL_SELECT_VERTEX));
        dispatch(showMessage("Выберите вершину"));
    } else if (preCall === PreCallAction.SELECT_EDGE) {
        dispatch(changeGraphMode(GraphMode.ALGORITHM_PRE_CALL_SELECT_EDGE));
        dispatch(showMessage("Выберите ребро"));
    } else if (preCall === PreCallAction.NOTHING) {
        dispatch(call());
    }
};

export const setSpeed = (speed) => ({
    type: ActionType.SET_SPEED,
    speed
});

export const setAlgorithm = (algorithm) => ({
    type: ActionType.SET_ALGORITHM,
    algorithm
});

const setIsOneStep = (isOneStep) => ({
    type: ActionType.SET_IS_ONE_STEP,
    isOneStep
});

export const call = (vertex, edge) => (dispatch, getState) => {
    dispatch(closeMessage());
    dispatch(changeGraphMode(GraphMode.DEFAULT));
    const graph = getState().graphReducer.graph;
    dispatch(callConnector(graph, vertex, edge));
    dispatch(showAlgorithmInfo());

    const isOneStep = getState().algorithmReducer.isOneStep;
    isOneStep ? dispatch(pause()) : dispatch(start());
    dispatch(callSuccess(isOneStep));
};

export const continueCall = (isOneStep = false) => (dispatch) => {
    isOneStep ? dispatch(pause()) : dispatch(start());
    dispatch(callSuccess(isOneStep));
};

const start = () => ({
    type: ActionType.START
});

export const pause = () => ({
    type: ActionType.PAUSE
});

const callConnector = (graph, vertex, edge) => ({
    type: ActionType.CALL,
    graph,
    vertex,
    edge
});

let currentVisualizationId = 0; // To prevent several visualization 'threads'

const callSuccess = (isOneStep = false) => async (dispatch, getState) => {
    if (isOneStep) {
        let traceStep = {isChained : true};
        while ((getState().algorithmReducer.trace.length > 0) && traceStep.isChained) {
            traceStep = getState().algorithmReducer.trace[0];
            dispatch(algorithmStep(traceStep));
            dispatch(popTraceStep());

            if (getState().algorithmReducer.trace.length === 0) {
                dispatch(showStatistics());
            }
        }
        return;
    }

    const visualizationId = ++currentVisualizationId;
    let traceStep;
    while ((getState().algorithmReducer.trace.length > 0) && getState().algorithmReducer.isActive) {
        traceStep = getState().algorithmReducer.trace[0];
        dispatch(algorithmStep(traceStep));
        dispatch(popTraceStep());
        if ((getState().algorithmReducer.trace.length > 0) && !traceStep.isChained) {
            await sleep(getState().algorithmReducer.speed);
            if (currentVisualizationId !== visualizationId)
                return;
        }
    }
    if (getState().algorithmReducer.isActive) {
        dispatch(pause());
        dispatch(showStatistics());
    }
};

const popTraceStep = () => ({
    type: ActionType.POP_TRACE_STEP
});

export const clearTrace = () => ({
    type: ActionType.CLEAR_TRACE
});

const showStatistics = () => ({
   type: ActionType.SHOW_STATISTICS
});

export const clearStatistics = () => ({
    type: ActionType.CLEAR_STATISTICS
});

const showAlgorithmInfo = () => ({
   type: ActionType.SHOW_ALGORITHM_INFO
});

export const clearAlgorithmInfo = () => ({
    type: ActionType.CLEAR_ALGORITHM_INFO
});

export const invertAlgorithmInfoCollapsed = () => ({
    type: ActionType.INVERT_ALGORITHM_INFO_COLLAPSED,
});