import React from 'react';
import classnames from "classnames/bind";
import styles from "./PlainGraph.module.scss";

const cx = classnames.bind(styles);

const Cell = ({x, y, blocked, onMouseEnter, onMouseLeave}) => (
    <rect x={x} y={y} className={cx("cell", {[`cell-blocked`]: blocked})}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}/>
);

class PlainGraph extends React.Component {
    state = {
        cells: [],
        cellSize: 40,
        rows: 1000 / 40 + 10,
        columns: 2000 / 40 + 10,
        isMouseDown: false,
        previousMouseRow: -1,
        previousMouseColumn: -1,
        mouseCellState: -1
    };

    componentDidMount() {
        const cellSize = 40;
        const rows = 1000 / cellSize + 10;
        const columns = 2000 / cellSize + 10;
        const cells = [];
        // const rows = window.innerHeight / cellSize + 10, columns = window.innerWidth / cellSize + 10; // TODO: change on resize
        for (let i = 0; i < rows; ++i) {
            const row = [];
            for (let j = 0; j < columns; ++j) {
                row.push(1);
            }
            cells.push(row);
        }
        this.setState({ cells: cells, cellSize: cellSize, rows: rows, columns: columns});
    }

    invertCellUnderMouse = (event) => {
        this.setState(oldState => {
            const x = Math.floor(event.x / this.state.cellSize);
            const y = Math.floor(event.y / this.state.cellSize);
            if ((x === oldState.previousMouseColumn) && (y === oldState.previousMouseRow))
                return oldState;
            const state = {...oldState};

            if (state.cells[y][x] === state.mouseCellState)
                state.cells[y][x] = (state.cells[y][x] === 0) ? 1 : 0;
            state.previousMouseRow = y;
            state.previousMouseColumn = x;

            return state;
        });
    };

    handleMouseDown = (event) => {
        const reducedEvent = { x: event.clientX, y: event.clientY };
        this.setState({
            isMouseDown: true,
            mouseCellState: this.state.cells
                [Math.floor(reducedEvent.y / this.state.cellSize)]
                [Math.floor(reducedEvent.x / this.state.cellSize)]
        });
        this.invertCellUnderMouse(reducedEvent);
    };

    handleMouseUp = (event) => {
        this.invertCellUnderMouse({ x: event.clientX, y: event.clientY });
        this.setState({ isMouseDown: false, previousMouseRow: -1, previousMouseColumn: -1 });
    };

    handleCellMouseEnter = (event) => {
        if (!this.state.isMouseDown)
            return;
        const reducedEvent = { x: event.clientX, y: event.clientY };
        this.invertCellUnderMouse(reducedEvent);
    };

    render() {
        return (
            <div className={cx("plain_graph")}>
                <svg className={cx("drawing_area")}
                     onMouseDown={e => this.handleMouseDown(e)}
                     onMouseUp={e => this.handleMouseUp(e)}>
                    {this.state.cells.map((row, y) =>
                        row.map((cell, x) =>
                            <Cell
                                x={x * this.state.cellSize}
                                y={y * this.state.cellSize}
                                blocked={cell === 0}
                                key={this.state.columns * y + x}
                                onMouseEnter={e => this.handleCellMouseEnter(e)}/>
                            )
                        )
                    }
                </svg>
            </div>
        );
    }
}

export default PlainGraph;