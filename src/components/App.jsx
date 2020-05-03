import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import PlainGraph from "./PlainGraph/PlainGraph";
import GraphComponent from "./Graph/Graph";
import MenuComponent from "./Menu/Menu";
import MessageBox from "./MessageBox/MessageBox";
import InputDialog from "./Dialogs/InputDialog/InputDialog";
import { connect } from "react-redux";
import InfoBox from "./InfoBox/InfoBox";

const cx = classnames.bind(styles);

const mapStateToProps = state => ({
    inputDialogProps: state.dialogReducer,
});

const App = ({ inputDialogProps }) => (
    <div className={cx("app")}>
        <MenuComponent/>
        <GraphComponent/>
        <MessageBox/>
        <InfoBox/>
        <InputDialog
            isOpen={inputDialogProps.isOpen}
            title={inputDialogProps.title}
            text={inputDialogProps.text}
            hint={inputDialogProps.hint}
            inputPlaceholder={inputDialogProps.inputPlaceholder}
            pattern={inputDialogProps.pattern}
            onSubmit={inputDialogProps.onSubmit}
            onCancel={inputDialogProps.onCancel}/>
    </div>
);

export default connect(mapStateToProps)(App);
