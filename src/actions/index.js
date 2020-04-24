export const actionName = Object.freeze({
    ADD_VERTEX: 'ADD_VERTEX',
    ADD_EDGE: 'ADD_EDGE',
    REMOVE_VERTEX_OR_EDGE: 'REMOVE_VERTEX_OR_EDGE',
    CHANGE_GRAPH_MODE: 'CHANGE_GRAPH_MODE',
    SHOW_MESSAGE: 'SHOW_MESSAGE',
    CLOSE_MESSAGE: 'CLOSE_MESSAGE',
    UPDATE_VERTEX_POSITION: 'UPDATE_VERTEX_POSITION'
});

export const addVertex = (x, y, radius) => ({
    type: actionName.ADD_VERTEX,
    x: x,
    y: y,
    radius: radius
});

export const addEdge = (vertexFrom, vertexTo, weight) => ({
    type: actionName.ADD_EDGE,
    vertexFrom: vertexFrom,
    vertexTo: vertexTo,
    weight: weight
});

export const removeVertexOrEdge = () => ({
    type: actionName.REMOVE_VERTEX_OR_EDGE
});

export const changeGraphMode = (graphMode) => ({
    type: actionName.CHANGE_GRAPH_MODE,
    graphMode: graphMode
});

export const showMessage = (message) => ({
    type: actionName.SHOW_MESSAGE,
    message: message
});

export const closeMessage = () => ({
    type: actionName.CLOSE_MESSAGE
});

export const updateVertexPosition = (vertexIndex, x, y) => ({
    type: actionName.UPDATE_VERTEX_POSITION,
    vertexIndex: vertexIndex,
    x: x,
    y: y
});

// TODO: Add 'CHANGE_GRAPH_ORIENTATION' action