import { Graph } from "../components/Graph/Graph";
import { actionNames } from "../actions";

const defaultState = {
    graph: new Graph(false),
    message: undefined
};

const clone = object => {
    return Object.assign( Object.create( Object.getPrototypeOf(object)), object);
};

const reducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case actionNames.addVertex:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.addVertex(action.x, action.y, action.radius);

            return newState;
        case actionNames.addEdge:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.addEdge(action.vertexFrom, action.vertexTo, action.weight);

            return newState;
        case actionNames.removeVertexOrEdge:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            return newState;
        case actionNames.updateVertexPosition:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            newState.graph.vertices[action.vertexIndex].x = action.x;
            newState.graph.vertices[action.vertexIndex].y = action.y;

            return newState;
        case actionNames.askForAction:
            newState = {
                ...state,
                graph: clone(state.graph)
            };

            switch (action.actionName) {
                case actionNames.addVertex:

                    // Change graph component state to 'waiting for vertex'

                    break;
                case actionNames.addEdge:

                    // Change graph component state to 'waiting for edge'

                    break;
                case actionNames.removeVertexOrEdge:

                    // Change graph component state to 'waiting for vertex/edge click'
                    break;
                default:
                    break;
            }

            return newState;
        case actionNames.showMessage:
            newState = {
                ...state
            };

            newState.message = action.message;

            return newState;
        case actionNames.closeMessage:
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