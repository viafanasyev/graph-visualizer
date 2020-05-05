export const VertexAction = Object.freeze({
    SELECT: 0,
    UNSELECT: 1,
    ENTER: 2,
    EXIT: 3,
    COLOR_1: 4,
    COLOR_2: 5
});

export const VertexHintAction = Object.freeze({
    REMOVE: 0,
    SET: 1,
    HIGHLIGHT: 2
});

export const EdgeAction = Object.freeze({
    WALK: 0,
    HIGHLIGHT: 1,
    UNSELECT: 2,
    SHADOW: 3
});

export const AlgorithmActionType = Object.freeze({
    VERTEX_ACTION: 0,
    EDGE_ACTION: 1,
    VERTEX_HINT_ACTION: 2
});

export const PreCallAction = Object.freeze({
    NOTHING: 0,
    SELECT_VERTEX: 1,
    SELECT_EDGE: 2
});

export const Criteria = Object.freeze({
    NOTHING: 0,
    WEIGHTED: 0b1,
    CONNECTED: 0b10,
    NOT_ORIENTED: 0b100
});

export const getOperationsCount = (trace) => {
    let operationsCount = 0;
    trace.forEach((t, i) => {
        if ((i + 1 === trace.length) || !t.isChained)
            ++operationsCount;
    });
    return operationsCount;
};