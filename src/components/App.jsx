import React from 'react';
import classnames from "classnames/bind";
import styles from "./App.module.scss";
import PlainGraph from "./PlainGraph/PlainGraph";
import GraphComponent from "./Graph/Graph";
import MenuComponent from "./Menu/Menu";
import MessageBox from "./MessageBox/MessageBox";

const cx = classnames.bind(styles);

const App = () => (
    <div className={cx("app")}>
        <MenuComponent/>
        <GraphComponent/>
        <MessageBox/>
    </div>
);
export default App;
