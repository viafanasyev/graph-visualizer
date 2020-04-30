export const actionName = Object.freeze({
    START_DIALOG_FOR_RESULT: 'START_DIALOG_FOR_RESULT',
    CLOSE_DIALOG: 'CLOSE_DIALOG'
});

export const startDialogForResult = (title, text, hint, inputPlaceholder, onSubmit, onCancel, pattern = ".*") => ({
    type: actionName.START_DIALOG_FOR_RESULT,
    title: title,
    text: text,
    hint: hint,
    inputPlaceholder: inputPlaceholder,
    onSubmit: onSubmit,
    onCancel: onCancel,
    pattern: pattern
});

const closeDialog = () => ({
   type: actionName.CLOSE_DIALOG
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