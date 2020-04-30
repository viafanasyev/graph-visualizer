import Modal from "react-modal";
import React from "react";
import classnames from "classnames/bind";
import styles from "./InputDialog.module.scss";
import { cancelDialog, submitDialog } from "../../../actions/dialog";
import { connect } from "react-redux";
import { ButtonComponent } from "../../Buttons/Buttons";
import { TextInputComponent } from "../../TextInputs/TextInputs";

const cx = classnames.bind(styles);

const customStyles = {
    overlay: {zIndex: 100000}
};

class InputDialog extends React.Component {
    state = {
        value: ""
    };

    handleChange = (e) => {
        if (e.target.validity.valid)
            this.setState({ value: e.target.value });
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={() => {
                    this.setState({ value: "" });
                    this.props.cancelDialog(this.props.onCancel);
                }}
                ariaHideApp={false}
                className={cx("input-dialog")}
                style={customStyles}>

                <h2>{this.props.title}</h2>
                <div>{this.props.text}</div>
                <TextInputComponent
                    className={cx("text-input")}
                    placeholder={this.props.inputPlaceholder}
                    pattern={this.props.pattern}
                    onChange={this.handleChange}
                    value={this.state.value}/>

                <ButtonComponent
                    className={cx("button")}
                    text={"Ок"}
                    onClick={() => {
                        this.setState({ value: "" });
                        this.props.submitDialog(this.props.onSubmit, this.state.value);
                    }}/>
                <ButtonComponent
                    className={cx("button")}
                    text={"Отмена"}
                    onClick={() => {
                        this.setState({ value: "" });
                        this.props.cancelDialog(this.props.onCancel);
                    }}/>

                <div className={cx("hint")}>{this.props.hint}</div>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    submitDialog: (onSubmit, result) => dispatch(submitDialog(onSubmit, result)),
    cancelDialog: (onCancel) => dispatch(cancelDialog(onCancel))
});

export default connect(null, mapDispatchToProps)(InputDialog);