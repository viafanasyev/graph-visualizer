export class Queue {
    constructor() {
        this._queue = [];
    }

    get length() {
        return this._queue.length;
    }

    isEmpty() {
        return this._queue.length === 0;
    }

    push(value) {
        this._queue.push(value);
    }

    pop() {
        // TODO: O(N) -> O(1)
        return this._queue.shift();
    }

    peek() {
        return this._queue[0];
    }
}