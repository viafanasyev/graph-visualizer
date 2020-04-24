export const actionNames = Object.freeze({
    addVertex: 'ADD_VERTEX',
    addEdge: 'ADD_EDGE',
    removeVertexOrEdge: 'REMOVE_VERTEX_OR_EDGE',
    askForAction: 'ASK_FOR_ACTION',
    showMessage: 'SHOW_MESSAGE',
    closeMessage: 'CLOSE_MESSAGE',
    updateVertexPosition: 'UPDATE_VERTEX_POSITION'
});

export const addVertex = (x, y, radius) => ({
    type: actionNames.addVertex,
    x: x,
    y: y,
    radius: radius
});

export const addEdge = (vertexFrom, vertexTo, weight) => ({
    type: actionNames.addEdge,
    vertexFrom: vertexFrom,
    vertexTo: vertexTo,
    weight: weight
});

export const removeVertexOrEdge = () => ({
    type: actionNames.removeVertexOrEdge
});

export const askForAction = (actionName) => ({
    type: actionNames.askForAction,
    actionName: actionName
});

export const showMessage = (message) => ({
    type: actionNames.showMessage,
    message: message
});

export const closeMessage = () => ({
    type: actionNames.closeMessage
});

export const updateVertexPosition = (vertexIndex, x, y) => ({
    type: actionNames.updateVertexPosition,
    vertexIndex: vertexIndex,
    x: x,
    y: y
});

// TODO: Add 'CHANGE_GRAPH_ORIENTATION' action