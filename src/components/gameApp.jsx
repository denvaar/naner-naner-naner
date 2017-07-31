import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import { DOWN, RIGHT } from '../constants';
import GameBoard from './gameBoard';
import Scoreboard from './scoreboard';
import TilePile from './tilePile';
import Tile from './tile';
import {
  randomLetter,
  findNeighbors,
  sortNeighbors,
  makeEdges,
  iterateEdges } from '../utils';


const initialTiles = [
  { id: 0, live: false, coords: { x: -1, y: -1 } },
  { id: 1, live: false, coords: { x: -1, y: -1 } },
  { id: 2, live: false, coords: { x: -1, y: -1 } },
  { id: 3, live: false, coords: { x: -1, y: -1 } },
  { id: 4, live: false, coords: { x: -1, y: -1 } },
  { id: 5, live: false, coords: { x: -1, y: -1 } },
  { id: 6, live: false, coords: { x: -1, y: -1 } },
  { id: 7, live: false, coords: { x: -1, y: -1 } },
  { id: 8, live: false, coords: { x: -1, y: -1 } },
  { id: 9, live: false, coords: { x: -1, y: -1 } },
  { id: 10, live: false, coords: { x: -1, y: -1 } },
  { id: 11, live: false, coords: { x: -1, y: -1 } },
  { id: 12, live: false, coords: { x: -1, y: -1 } },
  { id: 13, live: false, coords: { x: -1, y: -1 } },
  { id: 14, live: false, coords: { x: -1, y: -1 } },
  { id: 15, live: false, coords: { x: -1, y: -1 } },
];

const getRandom = (min, max) => Math.random() * (max - min) + min;

class GameApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      puzzleComplete: false,
      edges: [],
      tiles: initialTiles.map(t =>
        ({
          ...t,
          letter: randomLetter(),
          x: getRandom(0, 600),
          y: getRandom(0, 600),
          tilt: getRandom(-25, 25)
        }))
    };
  }

  onTileDrop(tile, targetCoords) {
    const index = this.state.tiles.findIndex(t =>
      t.id === tile.id);

    const rowNeighbors = findNeighbors(
      this.state.tiles,
      targetCoords,
      true
    );

    const columnNeighbors = findNeighbors(
      this.state.tiles,
      targetCoords,
      false
    );

    const newEdge = {
      tileId: tile.id,
      letter: tile.letter,
      coords: targetCoords
    };

    const horizontalNeighbors = sortNeighbors(
      [
        ...rowNeighbors,
        newEdge
      ],
      'x'
    );

    const verticalNeighbors = sortNeighbors(
      [
        ...columnNeighbors,
        newEdge
      ],
      'y'
    );

    let newEdges = this.state.edges;

    if (verticalNeighbors.length > 1) {
      newEdges = [
        ...newEdges,
        ...makeEdges(verticalNeighbors, DOWN)
      ];
    }

    if (horizontalNeighbors.length > 1) {
      newEdges = [
        ...newEdges,
        ...makeEdges(horizontalNeighbors, RIGHT)
      ];
    }

    this.setState({
      words: [],
      edges: newEdges,
      tiles: [
        ...this.state.tiles.slice(0, index),
        {
          ...tile,
          live: true,
          coords: targetCoords
        },
        ...this.state.tiles.slice(index + 1)
      ]
    }, () => this.setState({
      puzzleComplete: this.isPuzzleComplete(),
      words: iterateEdges(this.state.edges.map(e => ({ ...e, visited: false })))
    }));
  }

  isPuzzleComplete() {
    const liveTiles = this.state.tiles.filter(t => t.live).length;

    return liveTiles > 1 && liveTiles - this.state.edges.length === 1;
  }

  render() {
    const inactiveTiles = this.state.tiles
      .filter(tile => !tile.live)
      .map(tile => (
        <Tile
          { ...tile }
          onDrop={(targetCoords) => this.onTileDrop(tile, targetCoords)}
          key={tile.id} />
      ));

    const activeTiles = this.state.tiles
      .filter(tile => tile.live)
      .map(tile => (
          {
            ...tile,
            tilt: 0,
            key: tile.id
          }
      ));

    return (
      <div>
        <GameBoard tiles={activeTiles} />
        <Scoreboard
          words={this.state.words}
          puzzleComplete={this.state.puzzleComplete} />
        <TilePile tiles={inactiveTiles} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(GameApp);
