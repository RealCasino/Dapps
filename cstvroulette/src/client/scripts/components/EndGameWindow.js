import React, { Component } from 'react';

import GameStore from '../stores/GameStore';
import * as Actions from '../actions/GameActions';

import styles from '../App.css';

class EndGameWindow extends Component {

  constructor() {
    super();
    this.state = {
      bets: GameStore.getBets()
    };
  }

  componentWillMount() {
    GameStore.on("betsUpdate", () => { this.setState({bets: GameStore.getBets() });});
  }

  startNewGame() {
    Actions.startNewGame();
  }

  printClass() {
    if (this.props.display) {
      return styles.modalOpen;
    }
    else {
      return "";
    }
  }

  printWinningNumber() {
    if (this.props.winningNumber) {
      return <div className={`${styles.winner} ${styles[this.props.winningNumber.color]}`}>
        {this.props.winningNumber ? this.props.winningNumber.id : null}
      </div>
    }
    else {
      return "";
    }
  }

  render() {
    return (
      <div className={`${styles.modal} ${this.printClass()}`}>
        <div className={`${styles.modalContent} ${styles.endGameWindow}`}>
            {this.printWinningNumber()}
            <table>
              <thead>
                <tr>
                  <th>Bet</th>
                  <th>Bid</th>
                </tr>
              </thead>
              <tbody>
                {this.state.bets.map((bet, id) => {
                  if (bet) {
                    return <tr>
                      <td>{bet.value}</td>
                      <td>{bet.bid}</td>
                    </tr>
                  }
                  return "";
                })}
              </tbody>
            </table>
          <button className={styles.defaultBtn} onClick={() => this.startNewGame()}>OK</button>
        </div>
      </div>
    );
  }

}

export default EndGameWindow;
