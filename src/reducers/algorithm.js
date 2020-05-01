import { actionName } from "../actions/algorithm";
import React from "react";
import { preCallAction } from "../algorithms/graph/index";

const defaultState = {
    trace: [],
    isActive: false,
    algorithm: null,
    speed: 1000
};

const algorithm = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case actionName.CALL:
            newState = {
                ...state
            };

            const preCall = state.algorithm.preCall;
            const vertices = action.graph.vertices;
            const edges = action.graph.edges;
            let trace = [];
            if (preCall === preCallAction.SELECT_VERTEX) {
                trace = state.algorithm.call(vertices, edges, action.vertex);
            } else if (preCall === preCallAction.SELECT_EDGE) {
                trace = state.algorithm.call(vertices, edges, action.edge);
            }
            newState.trace = trace;

            return newState;
        case actionName.POP_TRACE_STEP:
            newState = {
                ...state,
                trace: [...state.trace]
            };

            newState.trace.shift();

            return newState;
        case actionName.START:
            return {
                ...state,
                isActive: true
            };
        case actionName.PAUSE:
            return {
                ...state,
                isActive: false
            };
        case actionName.SET_ALGORITHM:
            return {
                ...state,
                algorithm: action.algorithm
            };
        case actionName.SET_SPEED:
            return {
                ...state,
                speed: action.speed
            };
        default:
            return state;
    }
};

export default algorithm;