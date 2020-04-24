import { Graph } from "../components/Graph/Graph";
import { actionName } from "../actions";

export const graphMode = Object.freeze({
    DEFAULT: 0,
    ADD_VERTEX: 1,
    ADD_EDGE: 2,
    REMOVE_VERTEX_OR_EDGE: 3
});

const defaultState = {
    graph: new Graph(false),
    message: undefined,
    graphMode: graphMode.DEFAULT
};

const clone = object => {
    return Object.assign( Object.create( Object.getPrototypeOf(object)), object);
};

const reducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case actionName.ADD_VERTEX:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.addVertex(action.x, action.y, action.radius);

            return newState;
        case actionName.ADD_EDGE:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.addEdge(action.vertexFrom, action.vertexTo, action.weight);

            return newState;
        case actionName.REMOVE_VERTEX_OR_EDGE:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            return newState;
        case actionName.UPDATE_VERTEX_POSITION:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.vertices[action.vertexIndex].x = action.x;
            newState.graph.vertices[action.vertexIndex].y = action.y;

            return newState;
        case actionName.CHANGE_GRAPH_MODE:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graphMode = action.graphMode;

            return newState;
        case actionName.SHOW_MESSAGE:
            newState = {
                ...state
            };

            newState.message = action.message;

            return newState;
        case actionName.CLOSE_MESSAGE:
            newState = {
                ...state
            };

            newState.message = undefined;

            return newState;
        default:
            return state;
    }
};

export default reducer;