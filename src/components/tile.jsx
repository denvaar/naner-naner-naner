import React, { Component } from 'react';
import { ItemTypes } from '../constants';
import { DragSource } from 'react-dnd';

const tileSource = {
  beginDrag(props, monitor, component) {
    return {onDrop: props.onDrop};
  }
};

const collect = (connect, monitor) => (
  {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
);

const buildStyles = ({ live, x, y, tilt }) => {
  if (live) return null;

  return (
    {
      left: `${x}px`,
      top: `${y}px`,
      transform: `rotate(${tilt}deg)`
    }
  );
};

class Tile extends Component {
  render() {
    const { connectDragSource, isDragging, x, y, tilt, letter } = this.props;
    return connectDragSource(
      <div
        style={buildStyles(this.props)}
        className={isDragging ? "tile tile-dragging" : "tile"}>
        {letter}
      </div>
    );
  }
}

export default DragSource(ItemTypes.TILE, tileSource, collect)(Tile);
