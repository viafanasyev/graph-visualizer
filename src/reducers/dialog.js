import { actionName } from "../actions/dialog";
import React from "react";

const defaultState = {
    isOpen: false,
    title: "",
    text: "",
    hint: "",
    inputPlaceholder: "",
    onSubmit: null,
    onClose: null,
    pattern: ".*"
};

const dialog = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case actionName.START_DIALOG_FOR_RESULT:
            newState = {
                ...state,
                isOpen: true,
                title: action.title,
                text: action.text,
                hint: action.hint,
                inputPlaceholder: action.inputPlaceholder,
                pattern: action.pattern
            }

            newState.onSubmit = (value) => {
                const onSubmit = action.onSubmit;
                if (onSubmit)
                    onSubmit(value);
            };
            newState.onCancel = () => {
                const onCancel = action.onCancel;
                if (onCancel)
                    onCancel();
            };

            return newState;
        case actionName.CLOSE_DIALOG:
            return defaultState;
        default:
            return state;
    }
};

export default dialog;