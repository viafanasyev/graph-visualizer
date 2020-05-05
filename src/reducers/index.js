import { Graph, GraphMode } from "../components/Graph/Graph";
import { ActionType } from "../actions";
import { VertexHintState, VertexState } from "../components/Graph/Vertex/Vertex";
import { combineReducers } from "redux";
import dialog from "./dialog";
import algorithm from "./algorithm";
import matrixDialog from "./matrixDialog";
import { AlgorithmActionType, EdgeAction, VertexAction, VertexHintAction } from "../algorithms/graph";
import { EdgeState } from "../components/Graph/Edge/Edge";

const defaultState = {
    graph: new Graph(false),
    message: undefined,
    isAlert: false,
    graphMode: GraphMode.DEFAULT,
    selectedVertex: undefined // For 'ADD_EDGE' // TODO: Do 'ADD_EDGE' in a cleaner way
};

const clone = object => {
    return Object.assign( Object.create( Object.getPrototypeOf(object)), object);
};

const unselectSelectedVertex = (state) => {
    if (state.selectedVertex !== undefined) {
        const i = state.graph.vertices.findIndex(v => v === state.selectedVertex);
        if (i !== -1)
            state.graph.vertices[i].state = VertexState.DEFAULT;
        state.selectedVertex = undefined;
    }
};

const updateVertexByAction = (vertex, action) => {
    switch (action) {
        case VertexAction.SELECT:
            vertex.state = VertexState.HIGHLIGHTED;
            break;
        case VertexAction.ENTER:
            vertex.state = VertexState.PRE_COMPLETED;
            break;
        case VertexAction.EXIT:
            vertex.state = VertexState.COMPLETED;
            break;
        case VertexAction.UNSELECT:
            vertex.state = VertexState.DEFAULT;
            break;
        default:
    }
};

const updateEdgeByAction = (edge, action) => {
    switch (action) {
        case EdgeAction.WALK:
            edge.state = EdgeState.WALKED;
            break;
        case EdgeAction.HIGHLIGHT:
            edge.state = EdgeState.HIGHLIGHTED;
            break;
        default:
    }
};

const updateVertexHintByAction = (vertex, action) => {
    switch (action) {
        case VertexHintAction.REMOVE:
            vertex.hintState = VertexHintState.CLEAR;
            break;
        case VertexHintAction.SET:
            vertex.hintState = VertexHintState.DEFAULT;
            break;
        case VertexHintAction.HIGHLIGHT:
            vertex.hintState = VertexHintState.HIGHLIGHTED;
            break;
        default:
    }
};

const cleanGraphSelections = (state) => {
    state.graph.vertices.forEach(v => {
        v.state = VertexState.DEFAULT;
        v.hintState = VertexHintState.CLEAR;
        v.hint = "";
    });
    state.graph.edges.forEach(e => e.state = EdgeState.DEFAULT);
    state.graph.visualizationEdges = [];
    state.selectedVertex = undefined;
};

const reducer = (state = defaultState, action) => {
    let newState;
    let i;
    switch (action.type) {
        case ActionType.ADD_VERTEX:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.addVertex(action.x, action.y, action.radius);

            return newState;
        case ActionType.ADD_EDGE:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.addEdge(action.vertexFrom, action.vertexTo, action.weight);

            return newState;
        case ActionType.REMOVE_VERTEX:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.removeVertex(action.vertex);

            return newState;
        case ActionType.REMOVE_EDGE:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.removeEdge(action.edge);

            return newState;
        case ActionType.UPDATE_VERTEX_POSITION:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.vertices[action.vertexIndex].x = action.x;
            newState.graph.vertices[action.vertexIndex].y = action.y;

            return newState;
        case ActionType.CHANGE_GRAPH_MODE:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            if (action.graphMode !== newState.graphMode) {
                newState.graphMode = action.graphMode;

                unselectSelectedVertex(newState);
            }

            return newState;
        case ActionType.SELECT_VERTEX:
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
        case ActionType.UNSELECT_VERTEX:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            unselectSelectedVertex(newState);

            return newState;
        case ActionType.SHOW_MESSAGE:
            return {
                ...state,
                message: action.message,
                isAlert: action.isAlert
            };
        case ActionType.CLOSE_MESSAGE:
            return {
                ...state,
                message: undefined,
                isAlert: false
            };
        case ActionType.INVERT_ORIENTATION:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.invertOrientation();

            return newState;
        case ActionType.ALGORITHM_STEP:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            const step = action.step;
            if (step.actionType === AlgorithmActionType.VERTEX_ACTION) {
                const vertex = newState.graph.vertices.find(v => v.name === step.vertex);
                if (vertex)
                    updateVertexByAction(vertex, step.action);
            } else if (step.actionType === AlgorithmActionType.EDGE_ACTION) {
                const vertexFrom = newState.graph.vertices.find(v => v.name === step.from);
                const vertexTo = newState.graph.vertices.find(v => v.name === step.to);
                if (step.action === EdgeAction.UNSELECT) {
                    newState.graph.removeVisualizationEdgeByVertices(vertexFrom, vertexTo, step.oriented);
                } else {
                    const edge = newState.graph.addVisualizationEdge(vertexFrom, vertexTo, step.oriented, step.weight);
                    updateEdgeByAction(edge, step.action);
                }
            } else if (step.actionType === AlgorithmActionType.VERTEX_HINT_ACTION) {
                const vertex = newState.graph.vertices.find(v => v.name === step.vertex);
                if (vertex) {
                    if (step.action === VertexHintAction.REMOVE)
                        vertex.hint = "";
                    else
                        vertex.hint = step.hint;
                    updateVertexHintByAction(vertex, step.action);
                }
            }

            return newState;
        case ActionType.CLEAN_GRAPH_SELECTIONS:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            cleanGraphSelections(newState);

            return newState;
        case ActionType.SET_GRAPH:
            return {
                ...state,
                graph: action.graph
            };
        default:
            return state;
    }
};

export default combineReducers({
    graphReducer: reducer,
    dialogReducer: dialog,
    algorithmReducer: algorithm,
    matrixDialogReducer: matrixDialog
});