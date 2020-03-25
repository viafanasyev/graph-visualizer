import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import PlainGraph from "./PlainGraph/PlainGraph";

const cx = classnames.bind(styles);

const App = () => (
    <div className={cx("app")}>
        <PlainGraph/>
    </div>
);
export default App;
