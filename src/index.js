import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/styles.css';

import GameApp from './components/gameApp';

ReactDOM.render(
  <GameApp />,
  document.getElementById('react-root')
);

if (module.hot) module.hot.accept();
