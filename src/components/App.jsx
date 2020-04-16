import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import PlainGraph from "./PlainGraph/PlainGraph";
import Graph from "./Graph/Graph";

const cx = classnames.bind(styles);

const App = () => (
    <div className={cx("app")}>
        <Graph/>
    </div>
);
export default App;
