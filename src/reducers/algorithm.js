import { ActionType } from "../actions/algorithm";
import React from "react";
import { PreCallAction } from "../algorithms/graph/index";

const defaultState = {
    trace: [],
    isActive: false,
    algorithm: null,
    speed: 1000,
    isOneStep: false
};

const algorithm = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case ActionType.CALL:
            newState = {
                ...state
            };

            const preCall = state.algorithm.preCall;
            const vertices = action.graph.vertices;
            const edges = action.graph.edges;
            let trace = [];
            if (preCall === PreCallAction.SELECT_VERTEX) {
                trace = state.algorithm.call(vertices, edges, action.vertex);
            } else if (preCall === PreCallAction.SELECT_EDGE) {
                trace = state.algorithm.call(vertices, edges, action.edge);
            }
            newState.trace = trace;

            return newState;
        case ActionType.POP_TRACE_STEP:
            newState = {
                ...state,
                trace: [...state.trace]
            };

            newState.trace.shift();

            return newState;
        case ActionType.START:
            return {
                ...state,
                isActive: true
            };
        case ActionType.PAUSE:
            return {
                ...state,
                isActive: false
            };
        case ActionType.SET_ALGORITHM:
            return {
                ...state,
                algorithm: action.algorithm
            };
        case ActionType.SET_SPEED:
            return {
                ...state,
                speed: action.speed
            };
        case ActionType.SET_IS_ONE_STEP:
            return {
                ...state,
                isOneStep: action.isOneStep
            };
        case ActionType.CLEAR_TRACE:
            return {
                ...state,
                trace: []
            };
        default:
            return state;
    }
};

export default algorithm;