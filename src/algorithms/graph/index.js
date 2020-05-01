export const vertexAction = Object.freeze({
    SELECT: 0,
    UNSELECT: 1,
    ENTER: 2,
    EXIT: 3,
});

export const algorithmActionType = Object.freeze({
    VERTEX_ACTION: 0,
    EDGE_ACTION: 1
});

export const preCallAction = Object.freeze({
    NOTHING: 0,
    SELECT_VERTEX: 1,
    SELECT_EDGE: 2
});