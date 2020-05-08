import { sleep } from "../utils/sleep";

export const ActionType = Object.freeze({
    ADD_VERTEX: 'ADD_VERTEX',
    ADD_EDGE: 'ADD_EDGE',
    REMOVE_VERTEX: 'REMOVE_VERTEX',
    REMOVE_EDGE: 'REMOVE_EDGE',
    CHANGE_GRAPH_MODE: 'CHANGE_GRAPH_MODE',
    SELECT_VERTEX: 'SELECT_VERTEX',
    UNSELECT_VERTEX: 'UNSELECT_VERTEX',
    SHOW_MESSAGE: 'SHOW_MESSAGE',
    CLOSE_MESSAGE: 'CLOSE_MESSAGE',
    UPDATE_VERTEX_POSITION: 'UPDATE_VERTEX_POSITION',
    INVERT_ORIENTATION: 'INVERT_ORIENTATION',
    ALGORITHM_STEP: 'ALGORITHM_STEP',
    CLEAN_GRAPH_SELECTIONS: 'CLEAN_GRAPH_SELECTIONS',
    SET_GRAPH: 'SET_GRAPH',
    MOVE_CANVAS: 'MOVE_CANVAS',
    GENERATE_GRAPH: 'GENERATE_GRAPH'
});

export const addVertex = (x, y, radius) => ({
    type: ActionType.ADD_VERTEX,
    x,
    y,
    radius
});

export const addEdge = (vertexFrom, vertexTo, weight) => ({
    type: ActionType.ADD_EDGE,
    vertexFrom,
    vertexTo,
    weight
});

export const removeVertex = (vertex) => ({
    type: ActionType.REMOVE_VERTEX,
    vertex
});

export const removeEdge = (edge) => ({
    type: ActionType.REMOVE_EDGE,
    edge
});

export const changeGraphMode = (graphMode) => ({
    type: ActionType.CHANGE_GRAPH_MODE,
    graphMode
});

export const selectVertex = (vertex) => ({
    type: ActionType.SELECT_VERTEX,
    vertex
});

export const unselectVertex = (vertex) => ({
    type: ActionType.UNSELECT_VERTEX,
    vertex
});

let currentMessageId = 0;

export const showMessage = (message, isAlert = false) => async (dispatch) => {
    const messageId = ++currentMessageId;
    dispatch(showMessageConnector(message, isAlert));
    await sleep(2000);
    if (messageId === currentMessageId)
        dispatch(closeMessage());
};

const showMessageConnector = (message, isAlert = false) => ({
    type: ActionType.SHOW_MESSAGE,
    message,
    isAlert
});

export const closeMessage = () => ({
    type: ActionType.CLOSE_MESSAGE
});

export const updateVertexPosition = (vertexIndex, x, y) => ({
    type: ActionType.UPDATE_VERTEX_POSITION,
    vertexIndex,
    x,
    y
});

export const invertOrientation = () => ({
    type: ActionType.INVERT_ORIENTATION
});

export const algorithmStep = (step) => ({
    type: ActionType.ALGORITHM_STEP,
    step
});

export const cleanGraphSelections = () => ({
    type: ActionType.CLEAN_GRAPH_SELECTIONS
});

export const setGraph = (graph) => ({
    type: ActionType.SET_GRAPH,
    graph
});

export const moveCanvas = (x, y) => ({
    type: ActionType.MOVE_CANVAS,
    x,
    y
});

export const generateGraph = () => ({
    type: ActionType.GENERATE_GRAPH
});