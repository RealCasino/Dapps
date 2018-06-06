import React, { Component } from 'react';

import GameStore from '../stores/GameStore';

import styles from '../App.css';

class Board extends Component {

  constructor() {
    super();
    this.state = {
      bets: GameStore.getBets()
    }
  }

  componentWillMount() {
    GameStore.on("betsUpdate", () => { this.setState({bets: GameStore.getBets() });});
  }

  optionClicked(type, val, id) {
    if(!this.props.chipDisable){
        this.props.optionClicked(type, val, id);
    }
  }

  printDeleteButton(id) {
    if (this.state.bets[id]) {
      return <button onClick={(e) => {
        e.stopPropagation();
        this.deleteBetClicked(id);
      }}>X</button>
    }
    else { return null}
  }

  printBid(id) {
    if (this.state.bets[id]) {
      return "Bid: " + this.state.bets[id].bid
    }
    else {
      return ""
    }
  }

  printChips(id){
    if (this.state.bets[id]) {
      return (<div  className={`${styles.chip}`}>{this.state.bets[id].bid}</div>);
    }
    else {
      return "";
    }
  }

  printClass(id) {
    if (this.state.bets[id]) {
      return styles.betOption;
    }
    else {
      return "";
    }
  }

  deleteBetClicked(id) {
    this.props.deleteBet(id);
  }

  render() {

    return (
      <div className={styles.board}>
        <div className={`${styles.twelves} ${styles.boardColumn}`}>
          <div className={`${styles.twelve} ${styles.option}`} title={this.printBid(42)} onClick={() => {this.optionClicked('twelve', '1-12', 42)}}>1 to 12 {this.printChips(42)}</div>
          <div className={`${styles.twelve} ${styles.option}`} title={this.printBid(43)} onClick={() => {this.optionClicked('twelve', '13-24', 43)}}>13 to 24 {this.printChips(43)}</div>
          <div className={`${styles.twelve} ${styles.option}`} title={this.printBid(44)} onClick={() => {this.optionClicked('twelve', '25-36', 44)}}>25 to 36 {this.printChips(44)}</div>
        </div>
        <div className={`${styles.numbers} ${styles.boardColumn}`}>
          {GameStore.getNumbers().map((item, key) => {
            let title = this.printBid(item.id);
            let attr = {'title' : title};
            let chip = this.printChips(item.id);
            return <div className={`${styles[item.color]} ${styles.number} ${styles.option} `} {...attr} onClick={() => {this.optionClicked('number', item.id, item.id)}}>
              {item.id}
              {chip}
            </div>
          })}
          <div className={styles.rows}>
            <div className={`${styles.row} ${styles.option}`} title={this.printBid(39)} onClick={() => {this.optionClicked('row', '1st', 39)}}>1st {this.printChips(39)}</div>
            <div className={`${styles.row} ${styles.option}`} title={this.printBid(40)} onClick={() => {this.optionClicked('row', '2nd', 40)}}>2nd {this.printChips(40)}</div>
            <div className={`${styles.row} ${styles.option}`} title={this.printBid(41)} onClick={() => {this.optionClicked('row', '3rd', 41)}}>3rd {this.printChips(41)}</div>
          </div>
        </div>
        <div className={`${styles.otherOptions} ${styles.boardColumn}`}>
          <div className={`${styles.option}`} title={this.printBid(46)} onClick={() => {this.optionClicked('half', '1-18', 46)}}>1 to 18 {this.printChips(46)}</div>
          <div className={`${styles.option}`} title={this.printBid(48)} onClick={() => {this.optionClicked('parity', 'odd', 48)}}>ODD {this.printChips(48)}</div>
          <div className={`${styles.option}`} title={this.printBid(38)} onClick={() => {this.optionClicked('color', 'red', 38)}}><div className={styles.redOption}></div> {this.printChips(38)}</div>
          <div className={`${styles.option}`} title={this.printBid(37)} onClick={() => {this.optionClicked('color', 'black', 37)}}><div className={styles.blackOption}></div> {this.printChips(37)}</div>
          <div className={`${styles.option}`} title={this.printBid(47)} onClick={() => {this.optionClicked('parity', 'even', 47)}}>EVEN {this.printChips(47)}</div>
          <div className={`${styles.option}`} title={this.printBid(45)} onClick={() => {this.optionClicked('half', '19-36', 45)}}>19 to 36 {this.printChips(45)}</div>
        </div>  {/* other */}
      </div>

    );
  }

}

export default Board;
