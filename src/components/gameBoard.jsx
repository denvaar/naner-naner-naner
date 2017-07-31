import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import GridSquare from './gridSquare';

export default class GameBoard extends Component {
  constructor(props) {
    super(props);

    const gridTargets = [];

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        gridTargets.push({
          x,
          y
        });
      }
    }

    this.state = {
      gridTargets
    };
  }

  render() {
    const { tiles } = this.props;
    const { gridTargets } = this.state;

    const gridSquares = gridTargets.map(gridTarget =>
      <GridSquare
        key={`${gridTarget.x}${gridTarget.y}`}
        tile={tiles.find(t => t.coords.x === gridTarget.x && t.coords.y === gridTarget.y)}
        { ...gridTarget } />
    );

    return (
      <div className="grid">
        {gridSquares}
      </div>
    );
  }
}
