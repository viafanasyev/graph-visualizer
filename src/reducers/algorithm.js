import { ActionType } from "../actions/algorithm";
import React from "react";
import { PreCallAction } from "../algorithms/graph/index";

const defaultState = {
    trace: [],
    isActive: false,
    algorithm: null,
    speed: 1000,
    isOneStep: false,
    statistics: [],
    isStatisticsShown: false
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
            let result;
            if (preCall === PreCallAction.SELECT_VERTEX) {
                result = state.algorithm.call(vertices, edges, action.vertex);
            } else if (preCall === PreCallAction.SELECT_EDGE) {
                result = state.algorithm.call(vertices, edges, action.edge);
            } else if (preCall === PreCallAction.NOTHING) {
                result = state.algorithm.call(vertices, edges);
            }
            newState.trace = result.trace;
            newState.statistics = result.statistics;

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
        case ActionType.SHOW_STATISTICS:
            return {
                ...state,
                isStatisticsShown: true
            };
        case ActionType.CLEAR_STATISTICS:
            return {
                ...state,
                statistics: [],
                isStatisticsShown: false
            };
        default:
            return state;
    }
};

export default algorithm;