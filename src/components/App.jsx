import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import PlainGraph from "./PlainGraph/PlainGraph";
import GraphComponent from "./Graph/Graph";

const cx = classnames.bind(styles);

const App = () => (
    <div className={cx("app")}>
        <GraphComponent/>
    </div>
);
export default App;
