export const actionName = Object.freeze({
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
    INVERT_ORIENTATION: 'INVERT_ORIENTATION'
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

export const removeVertex = (vertex) => ({
    type: actionName.REMOVE_VERTEX,
    vertex: vertex
});

export const removeEdge = (edge) => ({
    type: actionName.REMOVE_EDGE,
    edge: edge
});

export const changeGraphMode = (graphMode) => ({
    type: actionName.CHANGE_GRAPH_MODE,
    graphMode: graphMode
});

export const selectVertex = (vertex) => ({
   type: actionName.SELECT_VERTEX,
   vertex: vertex
});

export const unselectVertex = (vertex) => ({
   type: actionName.UNSELECT_VERTEX,
   vertex: vertex
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

export const invertOrientation = () => ({
   type: actionName.INVERT_ORIENTATION
});

// TODO: Add 'CHANGE_GRAPH_ORIENTATION' action