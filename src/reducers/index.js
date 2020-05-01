import { Graph, graphMode } from "../components/Graph/Graph";
import { actionName } from "../actions";
import { VertexState } from "../components/Graph/Vertex/Vertex";
import { combineReducers } from "redux";
import dialog from "./dialog";
import algorithm from "./algorithm";
import { algorithmActionType, vertexAction } from "../algorithms/graph";
import { EdgeState } from "../components/Graph/Edge/Edge";

const defaultState = {
    graph: new Graph(false),
    message: undefined,
    graphMode: graphMode.DEFAULT,
    selectedVertex: undefined // For 'ADD_EDGE' // TODO: Do 'ADD_EDGE' in a cleaner way
};

const clone = object => {
    return Object.assign( Object.create( Object.getPrototypeOf(object)), object);
};

const unselectSelectedVertex = (state) => {
    if (state.selectedVertex !== undefined) {
        const i = state.graph.vertices.findIndex(v => v === state.selectedVertex);
        if (i !== -1)
            state.graph.vertices[i].state = VertexState.EMPTY;
        state.selectedVertex = undefined;
    }
};

const updateVertexByAction = (vertex, action) => {
    switch (action) {
        case vertexAction.SELECT:
            vertex.state = VertexState.HIGHLIGHTED;
            break;
        case vertexAction.ENTER:
            vertex.state = VertexState.PRE_COMPLETED;
            break;
        case vertexAction.EXIT:
            vertex.state = VertexState.COMPLETED;
            break;
        default:
    }
};

const cleanGraphSelections = (state) => {
    state.graph.vertices.forEach(v => v.state = VertexState.EMPTY);
    state.graph.edges.forEach(e => e.state = EdgeState.NORMAL);
    state.selectedVertex = undefined;
};

const reducer = (state = defaultState, action) => {
    let newState;
    let i;
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
        case actionName.REMOVE_VERTEX:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.removeVertex(action.vertex);

            return newState;
        case actionName.REMOVE_EDGE:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.removeEdge(action.edge);

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

            if (action.graphMode !== newState.graphMode) {
                newState.graphMode = action.graphMode;

                unselectSelectedVertex(newState);
            }

            return newState;
        case actionName.SELECT_VERTEX:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            unselectSelectedVertex(newState);

            i = newState.graph.vertices.findIndex(v => v === action.vertex);
            if (i !== -1) {
                newState.graph.vertices[i].state = VertexState.HIGHLIGHTED;
                newState.selectedVertex = action.vertex;
            }

            return newState;
        case actionName.UNSELECT_VERTEX:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            unselectSelectedVertex(newState);

            return newState;
        case actionName.SHOW_MESSAGE:
            return {
                ...state,
                message: action.message
            };
        case actionName.CLOSE_MESSAGE:
            return {
                ...state,
                message: undefined
            };
        case actionName.INVERT_ORIENTATION:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.invertOrientation();

            return newState;
        case actionName.ALGORITHM_STEP:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            const step = action.step;
            if (step.actionType === algorithmActionType.VERTEX_ACTION) {
                const vertex = newState.graph.vertices[step.vertex];
                updateVertexByAction(vertex, step.action);
            } else if (step.actionType === algorithmActionType.EDGE_ACTION) {
                // TODO: Implement edge action
            }

            return newState;
        case actionName.CLEAN_GRAPH_SELECTIONS:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            cleanGraphSelections(newState);

            return newState;
        default:
            return state;
    }
};

export default combineReducers({
    graphReducer: reducer,
    dialogReducer: dialog,
    algorithmReducer: algorithm
});