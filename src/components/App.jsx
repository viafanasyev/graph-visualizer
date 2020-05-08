import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import PlainGraph from "./PlainGraph/PlainGraph";
import GraphComponent from "./Graph/Graph";
import MenuComponent from "./Menu/Menu";
import MessageBox from "./MessageBox/MessageBox";
import InputDialog from "./Dialogs/InputDialog/InputDialog";
import InfoBox from "./InfoBox/InfoBox";
import MatrixDialog from "./Dialogs/MatrixDialog/MatrixDialog";
import { HotKeys } from "react-hotkeys";
import { connect } from "react-redux";
import { generateGraph } from "../actions";

const cx = classnames.bind(styles);

const App = ({ generateGraph }) => {
    const keyMap = {
        generateGraph: "g"
    };

    const handlers = {
        generateGraph: () => generateGraph()
    };

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
            <div className={cx("app")}>
                <MenuComponent/>
                <GraphComponent/>
                <MessageBox/>
                <InfoBox/>
                <InputDialog/>
                <MatrixDialog/>
            </div>
        </HotKeys>
    );
};


const mapDispatchToProps = dispatch => ({
    generateGraph: () => dispatch(generateGraph())
});

export default connect(null, mapDispatchToProps)(App);
