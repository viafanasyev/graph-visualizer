import React from "react";
import classnames from "classnames/bind";
import styles from "./HintBox.module.scss";
import Draggable from 'react-draggable';

const cx = classnames.bind(styles);

class HintBox extends React.Component {
    state = {
        hidden: false
    };

    collapse = () => {
        this.setState({ hidden: !this.state.hidden });
        // FIXME: Fix unfolding in the bottom of the screen
    };

    render() {
        return (
            <Draggable grid={[4, 4]} bounds={"body"}>
                <div className={cx("hint-box", {[`hint-box-hidden`]: this.state.hidden})}>
                    <div
                        className={cx("close-button")}
                        onClick={() => this.collapse()}>
                        &#x2715;
                    </div>
                    <div className={cx("text")}>
                        <p>
                            Горячие клавиши:
                        </p>
                        <ul>
                            <li>Ctrl + G - сгенерировать случайные рёбра</li>
                            <li>Ctrl + Alt + C - удалить всё</li>
                            <li>I - свернуть/развернуть информацию об алгоритме</li>
                        </ul>
                        <p className={cx("hint")}>
                            (Некоторые горячие клавиши могут работать только в английской раскладке)
                        </p>
                    </div>
                </div>
            </Draggable>
        );
    }
}

export default HintBox;