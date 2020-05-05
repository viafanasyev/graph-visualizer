import { algorithmStep, changeGraphMode, closeMessage, showMessage } from "./index";
import { GraphMode } from "../components/Graph/Graph";
import { Criteria, PreCallAction } from "../algorithms/graph";
import { sleep } from "../utils/sleep";

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
    CLEAR_STATISTICS: 'CLEAR_STATISTICS'
});

export const preCall = (isOneStep = false) => (dispatch, getState) => {
    dispatch(setIsOneStep(isOneStep));

    const criteria = getState().algorithmReducer.algorithm.criteria;
    if (criteria === Criteria.WEIGHTED) {
        for (const edge of getState().graphReducer.graph.edges) {
            if (!edge.isWeighted()) {
                dispatch(showMessage("Граф должен быть взвешенным!", true));
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
        if (getState().algorithmReducer.trace.length > 0) {
            dispatch(algorithmStep(getState().algorithmReducer.trace[0]));
            dispatch(popTraceStep());

            if (getState().algorithmReducer.trace.length === 0) {
                dispatch(showStatistics());
            }
        }
        return;
    }

    const visualizationId = ++currentVisualizationId;
    while ((getState().algorithmReducer.trace.length > 0) && getState().algorithmReducer.isActive) {
        dispatch(algorithmStep(getState().algorithmReducer.trace[0]));
        dispatch(popTraceStep());
        if (getState().algorithmReducer.trace.length > 0) {
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