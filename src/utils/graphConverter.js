import { Edge } from "../components/Graph/Edge/Edge";

export const edgesListToAdjacencyList = (vertices, edges) => {
    const adjacencyList = {};
    vertices.forEach(vertex => adjacencyList[vertex.name] = []);
    edges.forEach(edge => {
        adjacencyList[edge.from.name].push({name: edge.to.name, weight: edge.weight});
        if (!edge.isOriented() && (edge.from !== edge.to))
            adjacencyList[edge.to.name].push({name: edge.from.name, weight: edge.weight});
    });
    for (let [, verticesList] of Object.entries(adjacencyList))
        verticesList = verticesList.sort((a, b) => a.name - b.name);
    return adjacencyList;
};

export const edgesListToReversedAdjacencyList = (vertices, edges) => {
    return edgesListToAdjacencyList(vertices, edges.map(e =>
        new Edge(e.to, e.from, e.isOriented(), e.weight))
    );
};

export const edgesListToAdjacencyMatrix = (vertices, edges) => {
    const verticesNumbers = [];
    vertices.forEach(v => verticesNumbers.push(v.name));
    verticesNumbers.sort((a, b) => a - b);
    const nameToIndex = {};
    verticesNumbers.forEach((number, index) => nameToIndex[number] = index);

    const adjacencyMatrix = new Array(vertices.length);
    for (let i = 0; i < vertices.length; ++i) {
        adjacencyMatrix[i] = new Array(vertices.length);
        for (let j = 0; j < vertices.length; ++j)
            adjacencyMatrix[i][j] = null;
    }

    let from, to, cell;
    edges.forEach(e => {
        from = nameToIndex[e.from.name];
        to = nameToIndex[e.to.name];
        cell = e.weight ? { weighted: true, weight: e.weight } : { weighted : false };
        adjacencyMatrix[from][to] = cell;
        if (!e.isOriented())
            adjacencyMatrix[to][from] = cell;
    });

    return {adjacencyMatrix, verticesNumbers};
};