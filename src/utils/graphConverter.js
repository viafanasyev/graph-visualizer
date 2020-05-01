export const edgesListToAdjacencyList = (vertices, edges) => {
    const adjacencyList = {};
    vertices.forEach(vertex => adjacencyList[vertex.name] = []);
    edges.forEach(edge => {
        adjacencyList[edge.from.name].push(edge.to.name);
        if (!edge.isOriented() && (edge.from !== edge.to))
            adjacencyList[edge.to.name].push(edge.from.name);
    });
    for (let [, verticesList] of Object.entries(adjacencyList))
        verticesList = verticesList.sort((a, b) => a - b);
    return adjacencyList;
};