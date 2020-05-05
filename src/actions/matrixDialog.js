export const ActionType = Object.freeze({
    START_MATRIX_DIALOG_FOR_RESULT: 'START_MATRIX_DIALOG_FOR_RESULT',
    CLOSE_MATRIX_DIALOG: 'CLOSE_MATRIX_DIALOG'
});

export const startMatrixDialogForResult = () => ({
    type: ActionType.START_MATRIX_DIALOG_FOR_RESULT
});

const closeMatrixDialog = () => ({
   type: ActionType.CLOSE_MATRIX_DIALOG
});

export const cancelMatrixDialog = (onCancel) => (dispatch) => {
    if (onCancel)
        onCancel();
    dispatch(closeMatrixDialog());
};

export const submitMatrixDialog = (onSubmit, result) => (dispatch) => {
    if (onSubmit)
        onSubmit(result);
    dispatch(closeMatrixDialog());
};