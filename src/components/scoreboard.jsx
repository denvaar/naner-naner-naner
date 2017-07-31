import React from 'react';


const Scoreboard = ({ words, puzzleComplete }) => {

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

  return (
    <div className="scoreboard">
      <div className="menu-bar"><i className="fa fa-arrows-alt" aria-hidden="true"></i> &nbsp;&nbsp;Menu</div>
      <div className="scoreboard-body">
        {displayCompleted}
        <div>Words:</div>
        {words && <ol>{words.map((word, i) =>
          <li key={word + i}>{word}</li>)}</ol>}
      </div>
    </div>
  );
};

export default Scoreboard;
