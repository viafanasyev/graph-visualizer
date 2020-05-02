import { changeGraphMode, showMessage, algorithmStep, closeMessage } from "./index";
import { GraphMode } from "../components/Graph/Graph";
import { PreCallAction } from "../algorithms/graph";
import { sleep } from "../utils/sleep";

export const ActionType = Object.freeze({
    PRE_CALL: 'PRE_CALL',
    CALL: 'CALL',
    START: 'START',
    PAUSE: 'PAUSE',
    POP_TRACE_STEP: 'POP_TRACE_STEP',
    SET_ALGORITHM: 'SET_ALGORITHM',
    SET_SPEED: 'SET_SPEED'
});

export const preCall = () => (dispatch, getState) => {
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

export const call = (vertex, edge) => (dispatch, getState) => {
    dispatch(closeMessage());
    dispatch(changeGraphMode(GraphMode.DEFAULT));
    const graph = getState().graphReducer.graph;
    dispatch(callConnector(graph, vertex, edge));
    dispatch(start());
    dispatch(callSuccess());
};

export const continueCall = () => (dispatch) => {
    dispatch(start());
    dispatch(callSuccess());
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

const callSuccess = () => async (dispatch, getState) => {
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
    }
};

const popTraceStep = () => ({
    type: ActionType.POP_TRACE_STEP
});