import React, { Component } from 'react';

import GameStore from '../stores/GameStore';

import styles from '../App.css';
import {Rspan} from 'oo7-react';
import {bonds, formatBalance} from 'oo7-parity';

class Infobox extends Component {

  constructor() {
    super();
    this.state = {
      money: GameStore.getMoney(),
      totalBet: GameStore.getTotalBet(),
      bets: GameStore.getBets(),
      lastWinningNumbers: [],
      tableOpen: false
    };
  }

  componentWillMount() {
    GameStore.on("moneyUpdate", () => {this.setState({money: GameStore.getMoney()})})
    GameStore.on("totalBetUpdate", () => {this.setState({totalBet: GameStore.getTotalBet()})})
    GameStore.on("betsUpdate", () => { this.setState({bets: GameStore.getBets()})})
  }

  deleteBetClicked(id) {
    this.props.deleteBet(id)
  }

  addWinningNumber(number, color) {
    let lastWinningNumbers = this.state.lastWinningNumbers
    lastWinningNumbers.unshift({number: number, color: color})
    lastWinningNumbers = lastWinningNumbers.slice(0, 8)
    this.setState({lastWinningNumbers})
  }

  betsTableOpenerClicked() {
    let tableOpen = this.state.tableOpen ? false : true
    this.setState({tableOpen})
  }

  render() {
    let tableOpen = this.state.tableOpen ? styles.open : "";
    let buttonOpen = this.state.tableOpen ? styles.openBtn : "";
    return (
      <div className={styles.infobox}>
        <div className={styles.container}>
          <div className={styles.mainInfo}>
            <div className={styles.moneyInfo}>
              <p><b>Address:</b><Rspan>{bonds.me}</Rspan></p>
              <p><b>Balance:</b> <Rspan> {bonds.balance(bonds.me).map(formatBalance)} </Rspan></p>
              <p><b>Total bet:</b> {this.state.totalBet}</p>
            </div>
          </div>
          <div className={styles.winningNumbersBox}>
            {this.state.lastWinningNumbers.map((item, id) => {
              return <div className={`${styles[item.color]} ${styles.winningNumber}`}>{item.number}</div>;
            })}
          </div>
        </div>
      </div>
    );
  }

}

export default Infobox;
