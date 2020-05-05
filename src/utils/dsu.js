export class DSU {
    constructor() {
        this.parent = {};
        this.size = {};
    }

    makeSet(x) {
        this.parent[x] = x;
        this.size[x] = 1;
    }

    find(x) {
        if (x === this.parent[x])
            return x;
        this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }

    union(x, y) {
        x = this.find(x);
        y = this.find(y);
        if (x !== y)
            if (this.size[x] < this.size[y])
                [x, y] = [y, x];
            this.parent[y] = x;
            this.size[x] += this.size[y];
    }
}