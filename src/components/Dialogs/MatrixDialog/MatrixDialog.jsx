import Modal from "react-modal";
import React from "react";
import classnames from "classnames/bind";
import styles from "./MatrixDialog.module.scss";
import { connect } from "react-redux";
import { ButtonComponent } from "../../Buttons/Buttons";
import { edgesListToAdjacencyMatrix } from "../../../utils/graphConverter";
import { cancelMatrixDialog, submitMatrixDialog } from "../../../actions/matrixDialog";
import AdjacencyMatrix from "./AdjacencyMatrix";
import { startDialogForResult } from "../../../actions/dialog";
import { addEdge, removeEdge } from "../../../actions";

const cx = classnames.bind(styles);

const customStyles = {
    overlay: {zIndex: 99999}
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
        if (this.props.graph.vertices.length === 0)
            return;

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

    handleCellClick = (e, from, to) => {
        const vertexFrom = this.props.graph.vertices.find(v => v.name === from);
        const vertexTo = this.props.graph.vertices.find(v => v.name === to);

        if (e.type === "click") {
            if (vertexFrom && vertexTo) {
                this.props.startDialogForResult(
                    "Введите вес ребра",
                    `(${from} ${this.props.graph.isOriented() ? '->' : '<->'} ${to})`,
                    "Оставьте поле пустым, чтобы добавить невзвешенное ребро",
                    "Вес ребра",
                    (value) => {
                        if (value === "")
                            value = undefined;
                        this.props.addEdge(vertexFrom, vertexTo, value);
                    },
                    null,
                    "[0-9]{0,2}"
                );
            }
        } else if (e.type === "contextmenu") {
            e.preventDefault();

            const edgeIndex = this.props.graph.findEdge(vertexFrom, vertexTo);
            if (edgeIndex !== -1)
                this.props.removeEdge(this.props.graph.edges[edgeIndex]);
        }
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={() => this.cancel()}
                ariaHideApp={false}
                className={cx("matrix-dialog")}
                style={customStyles}>

                {
                    this.props.graph.vertices.length > 0 ?
                        <div>
                            <AdjacencyMatrix graph={this.props.graph} onCellClick={this.handleCellClick}/>
                            <div>ЛКМ - добавить ребро, ПКМ - удалить ребро</div>
                        </div>
                    :
                        <div style={{"margin": "20px", "font-size": "1.2em"}}>Добавьте хотя бы одну вершину</div>
                }

                <ButtonComponent
                    type={"submit"}
                    className={cx("button", {[`deactivated-button`]: this.props.graph.vertices.length === 0})}
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
    cancelDialog: (onCancel) => dispatch(cancelMatrixDialog(onCancel)),
    addEdge: (vertexFrom, vertexTo, weight) => dispatch(addEdge(vertexFrom, vertexTo, weight)),
    removeEdge: (edge) => dispatch(removeEdge(edge)),
    startDialogForResult: (title, text, hint, inputPlaceholder, onSubmit, onClose, pattern) =>
        dispatch(startDialogForResult(title, text, hint, inputPlaceholder, onSubmit, onClose, pattern))
});

export default connect(mapStateToProps, mapDispatchToProps)(MatrixDialog);