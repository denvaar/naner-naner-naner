import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import { ItemTypes } from '../constants';
import { snapToGrid } from '../utils';
import Tile from './tile';


const gridTarget = {
	drop(props, monitor, component) {
		const position = monitor.getClientOffset();
		const [x, y] = snapToGrid(position.x, position.y);

    monitor.getItem().onDrop({ x: props.x, y: props.y });
	},
	hover(props, monitor, component) {
		const position = monitor.getClientOffset();
	}
};

const collect = (connect, monitor) => (
  {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
);

class GridSquare extends Component {
  render() {
    const { connectDropTarget, isOver, tile } = this.props;

    return connectDropTarget(
      <div className={isOver ? "grid-square hover-over" : "grid-square"}>
        {tile ? <Tile { ...tile } /> : null}
      </div>
    );
  }
};

export default DropTarget(ItemTypes.TILE, gridTarget, collect)(GridSquare);
