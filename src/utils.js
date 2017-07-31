export const snapToGrid = (x, y) => {
  const snappedX = Math.round(x / 50) * 50;
  const snappedY = Math.round(y / 50) * 50;

  return [snappedX, snappedY];
}

export const randomLetter = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

/* find adjacent vertices within a graph (in preparation for making an edge) */
export const findNeighbors = (tiles, targetCoords, rowWise = true) => {
  const conditionA = (tile) =>
    tile.coords[rowWise ? 'y' : 'x'] === targetCoords[rowWise ? 'y' : 'x'];
  const conditionB = (tile) =>
    tile.coords[rowWise ? 'x' : 'y'] === targetCoords[rowWise ? 'x' : 'y'] + 1;
  const conditionC = (tile) =>
    tile.coords[rowWise ? 'x' : 'y'] === targetCoords[rowWise ? 'x' : 'y'] - 1;

  return (
    tiles
      .filter(tile =>
        (conditionA(tile) && conditionB(tile) ||
         conditionA(tile) && conditionC(tile))
      )
      .map(tile => ( // strip down to only what an edge needs
        {
          tileId: tile.id,
          letter: tile.letter,
          coords: tile.coords
        }
      ))
  );
};

/*
determine which of two vertices comes first

The graph needs to be directed because words can only
be spelled in two possible directions:
  1. top to bottom
  2. left to right

The `sortAttr` can be x or y.
*/
export const sortNeighbors = (neighbors, sortAttr) => {
  return (
    neighbors.sort((a, b) => {
      if (a.coords[sortAttr] < b.coords[sortAttr]) return -1;
      return 1;
    })
  );
};

/* create an edge on the graph between two vertices */
export const makeEdges = ([ from, to, rest ], direction) => {
  const edge = {
    direction,
    fromTileIndex: from.tileId,
    toTileIndex: to.tileId,
    fromTileLetter: from.letter,
    toTileLetter: to.letter
  };

  if (rest) {
    return [
      edge,
      {
        direction,
        fromTileIndex: to.tileId,
        toTileIndex: rest.tileId,
        fromTileLetter: to.letter,
        toTileLetter: rest.letter
      }
    ];
  }
  return [edge];
};

/* iterate over all unvisited edges in graph */
export const iterateEdges = (edges) => {
  const paths = [];
  edges.forEach(edge => {
    if (!edge.visited) {
      const beginningEdge = findBeginningEdge(edge, edges);
      const path = traverseEdges(beginningEdge, edges);

      paths.push(path);
    }
  });

  return paths;
};

/* find edge that marks the beginning of a path */
const findBeginningEdge = (edge, edges) => {
  const { fromTileIndex, direction } = edge;

  const previousEdge = edges.find(edge => (
    edge.direction === direction &&
    edge.toTileIndex === fromTileIndex
  ));

  if (previousEdge) {
    return findBeginningEdge(previousEdge, edges);
  }
  return edge;
};

/* walk down a path to produce a word */
const traverseEdges = (startEdge, edges) => {
  const word = `${startEdge.fromTileLetter}`;
  const nextEdge = edges.find(edge => (
    edge.direction === startEdge.direction &&
    edge.fromTileIndex === startEdge.toTileIndex
  ));

  edges.find(edge => (
    edge.direction === startEdge.direction &&
    edge.fromTileIndex === startEdge.fromTileIndex &&
    edge.toTileIndex === startEdge.toTileIndex
  )).visited = true;

  if (nextEdge) return word + traverseEdges(nextEdge, edges);
  return `${word}${startEdge.toTileLetter}`;
};
