import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import { ItemTypes } from '../constants';


const menuSource = {
  beginDrag(props, monitor, component) {
    return { onMenuDrop: component.onMenuDrop };
  }
};

const collect = (connect, monitor) => (
  {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
);

class Scoreboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 5,
      y: 5
    };

    this.onMenuDrop = this.onMenuDrop.bind(this);
  }

  onMenuDrop({ x, y }) {
    this.setState({ x, y });
  }

  render() {
    const { x, y } = this.state;
    const { words, puzzleComplete, connectDragSource } = this.props;

    let displayCompleted = (
      <div>
        Puzzle:&nbsp;
        <span className="complete">
          <i className="fa fa-check" aria-hidden="true"></i>
          Complete
        </span>
      </div>
    );

    if (!puzzleComplete) {
      displayCompleted = (
        <div>
          Puzzle:&nbsp;
          <span className="incomplete">
            <i className="fa fa-times" aria-hidden="true"></i>
            Incomplete
          </span>
        </div>
      );
    }

    return connectDragSource(
      <div
        className="scoreboard"
        style={{ left: `${x}px`, top: `${y}px` }}>
        <div className="menu-bar"><i className="fa fa-arrows-alt" aria-hidden="true"></i> &nbsp;&nbsp;Menu</div>
        <div className="scoreboard-body">
          {displayCompleted}
          <div>Words:</div>
          {words && <ol>{words.map((word, i) =>
            <li key={word + i}>{word}</li>)}</ol>}
        </div>
      </div>
    );
  }
};

export default DragSource(
  ItemTypes.MENU,
  menuSource,
  collect
)(Scoreboard);
