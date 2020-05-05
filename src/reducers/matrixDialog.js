import { ActionType } from "../actions/matrixDialog";
import React from "react";

const defaultState = {
    isOpen: false
};

const matrixDialog = (state = defaultState, action) => {
    switch (action.type) {
        case ActionType.START_MATRIX_DIALOG_FOR_RESULT:
            return {
                ...state,
                isOpen: true
            };
        case ActionType.CLOSE_MATRIX_DIALOG:
            return defaultState;
        default:
            return state;
    }
};

export default matrixDialog;