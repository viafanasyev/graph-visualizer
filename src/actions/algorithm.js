import { changeGraphMode, showMessage, algorithmStep, closeMessage } from "./index";
import { graphMode } from "../components/Graph/Graph";
import { preCallAction } from "../algorithms/graph";
import { sleep } from "../utils/sleep";

export const actionName = Object.freeze({
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

    if (preCall === preCallAction.SELECT_VERTEX) {
        dispatch(changeGraphMode(graphMode.ALGORITHM_PRE_CALL_SELECT_VERTEX));
        dispatch(showMessage("Выберите вершину"));
    } else if (preCall === preCallAction.SELECT_EDGE) {
        dispatch(changeGraphMode(graphMode.ALGORITHM_PRE_CALL_SELECT_EDGE));
        dispatch(showMessage("Выберите ребро"));
    } else if (preCall === preCallAction.NOTHING) {
        dispatch(call());
    }
};

export const setSpeed = (speed) => ({
    type: actionName.SET_SPEED,
    speed
});

export const setAlgorithm = (algorithm) => ({
    type: actionName.SET_ALGORITHM,
    algorithm
});

export const call = (vertex, edge) => (dispatch, getState) => {
    dispatch(closeMessage());
    dispatch(changeGraphMode(graphMode.DEFAULT));
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
    type: actionName.START
});

export const pause = () => ({
    type: actionName.PAUSE
});

const callConnector = (graph, vertex, edge) => ({
    type: actionName.CALL,
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
    type: actionName.POP_TRACE_STEP
});