import Modal from "react-modal";
import React from "react";
import classnames from "classnames/bind";
import styles from "./MatrixDialog.module.scss";
import { connect } from "react-redux";
import { ButtonComponent } from "../../Buttons/Buttons";
import { edgesListToAdjacencyMatrix } from "../../../utils/graphConverter";
import { cancelMatrixDialog, submitMatrixDialog } from "../../../actions/matrixDialog";
import AdjacencyMatrix from "./AdjacencyMatrix";

const cx = classnames.bind(styles);

const customStyles = {
    overlay: {zIndex: 100000}
};

const mapStateToProps = state => ({
    isOpen: state.matrixDialogReducer.isOpen,
    graph: state.graphReducer.graph
});

class MatrixDialog extends React.Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (!this.props.isOpen && !nextProps.isOpen)
            return false;
        return true;
    }

    writeToFile = () => {
        let {adjacencyMatrix} = edgesListToAdjacencyMatrix(this.props.graph.vertices, this.props.graph.edges);

        adjacencyMatrix = adjacencyMatrix.map(row => row.map(cell => cell ? (cell.weighted ? cell.weight : "+") : "X"));
        adjacencyMatrix = adjacencyMatrix.reduce((prev, arr) => prev + arr.reduce((line, cell) => line + cell + " ", "") + "\n", "");

        const exportData = "data:text/plain;charset=utf-8," + escape(adjacencyMatrix);
        const anchorElement = document.getElementById("fileSave");
        anchorElement.setAttribute("href", exportData);
        anchorElement.setAttribute("download", "adjacencyMatrix.txt");
        anchorElement.click();
    };

    cancel = () => {
        this.props.cancelDialog(null);
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={() => this.cancel()}
                ariaHideApp={false}
                className={cx("matrix-dialog")}
                style={customStyles}>

                <AdjacencyMatrix graph={this.props.graph}/>

                <ButtonComponent
                    type={"submit"}
                    className={cx("button")}
                    text={"Сохранить в файл"}
                    onClick={() => this.writeToFile()}/>
                <a id="fileSave" style={{"display": "none"}} aria-hidden={true} href="/#">Save matrix</a>

                <ButtonComponent
                    className={cx("button")}
                    text={"Закрыть"}
                    onClick={() => this.cancel()}/>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    submitDialog: (onSubmit, result) => dispatch(submitMatrixDialog(onSubmit, result)),
    cancelDialog: (onCancel) => dispatch(cancelMatrixDialog(onCancel))
});

export default connect(mapStateToProps, mapDispatchToProps)(MatrixDialog);