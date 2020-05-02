export const ActionType = Object.freeze({
    START_DIALOG_FOR_RESULT: 'START_DIALOG_FOR_RESULT',
    CLOSE_DIALOG: 'CLOSE_DIALOG'
});

export const startDialogForResult = (title, text, hint, inputPlaceholder, onSubmit, onCancel, pattern = ".*") => ({
    type: ActionType.START_DIALOG_FOR_RESULT,
    title,
    text,
    hint,
    inputPlaceholder,
    onSubmit,
    onCancel,
    pattern
});

const closeDialog = () => ({
   type: ActionType.CLOSE_DIALOG
});

export const cancelDialog = (onCancel) => (dispatch) => {
    if (onCancel)
        onCancel();
    dispatch(closeDialog());
};

export const submitDialog = (onSubmit, result) => (dispatch) => {
    if (onSubmit)
        onSubmit(result);
    dispatch(closeDialog());
};