import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import GridSquare from './gridSquare';
import { ItemTypes, TILE_SIZE } from '../constants';


const GRID_STYLES = {
  width: `${(20 * TILE_SIZE) + 40}px`,
  height: `${(20 * TILE_SIZE) + 40}px`
};

const target = {
  drop(props, monitor) {
    const position = monitor.getClientOffset();
    const diff = monitor.getDifferenceFromInitialOffset();
    console.log(monitor.getDifferenceFromInitialOffset())

    monitor.getItem().onMenuDrop(monitor.getSourceClientOffset());
  }
};

const collect = (connect, monitor) => (
  {
    connectDropTarget: connect.dropTarget()
  }
);

class GameBoard extends Component {
  constructor(props) {
    super(props);

    const gridTargets = [];

    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
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
    const { tiles, connectDropTarget } = this.props;
    const { gridTargets } = this.state;

    const gridSquares = gridTargets.map((gridTarget, i) =>
      <GridSquare
        key={`${gridTarget.x}${gridTarget.y}-${i}`}
        tile={tiles.find(t => t.coords.x === gridTarget.x && t.coords.y === gridTarget.y)}
        { ...gridTarget } />
    );

    return connectDropTarget(
      <div style={GRID_STYLES} className="grid">
        {gridSquares}
      </div>
    );
  }
}

export default DropTarget(ItemTypes.MENU, target, collect)(GameBoard);
