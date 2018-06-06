import React, { Component } from 'react';
import styles from './App.css';
import Game from './components/Game';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <Game />
      </div>
    );
  }
}

export default App;
