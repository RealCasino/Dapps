import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';


class GameStore extends EventEmitter {

  constructor() {
    super();
    this.numbers = [
      {color: 'green', id: 0},
      {color: 'red', id: 1},
      {color: 'black', id: 2},
      {color: 'red', id: 3},
      {color: 'black', id: 4},
      {color: 'red', id: 5},
      {color: 'black', id: 6},
      {color: 'red', id: 7},
      {color: 'black', id: 8},
      {color: 'red', id: 9},
      {color: 'black', id: 10},
      {color: 'black', id: 11},
      {color: 'red', id: 12},
      {color: 'black', id: 13},
      {color: 'red', id: 14},
      {color: 'black', id: 15},
      {color: 'red', id: 16},
      {color: 'black', id: 17},
      {color: 'red', id: 18},
      {color: 'red', id: 19},
      {color: 'black', id: 20},
      {color: 'red', id: 21},
      {color: 'black', id: 22},
      {color: 'red', id: 23},
      {color: 'black', id: 24},
      {color: 'red', id: 25},
      {color: 'black', id: 26},
      {color: 'red', id: 27},
      {color: 'black', id: 28},
      {color: 'black', id: 29},
      {color: 'red', id: 30},
      {color: 'black', id: 31},
      {color: 'red', id: 32},
      {color: 'black', id: 33},
      {color: 'red', id: 34},
      {color: 'black', id: 35},
      {color: 'red', id: 36}
    ];
    this.bets = [];
    this.lastBet = [];
    this.money = 100000;
    this.totalBet = 0;
    this.token = 0.1;
    this.previusBets = null;
    this.previousBid = null;
    this.videoURL = 'http://static2.casinotv.com/ICO/video/video.html';
    this.completeBetsDisable = false;
    this.cancelBtnDisable = false;
    this.chipDisable = false;
    this.isHiddenPlaceBetsImg = false;
  }

  getNumbers() { return this.numbers; }
  getBets() { return this.bets; }
  getMoney() { return this.money; }
  getTotalBet() { return this.totalBet; }
  getToken() { return this.token; }
  getPreviousBets() { return this.previusBets; }
  getPreviousBid() { return this.previousBid; }
  getVideoURL() {return this.videoURL;}
  getCompleteBtnStatus() {return this.completeBetsDisable;}
  getCancelBetsBtnStatus() {return this.cancelBtnDisable;}
  getChipBtnStatus() {return this.chipDisable;}
  getPlaceBetsImgStatus() {return this.isHiddenPlaceBetsImg;}

  updateBets(bets, money) {
    this.bets = bets;
    this.emit("betsUpdate");
    this.updateMoney(-money);
    this.updateBid(money);
  }

  updateLastBets(lastBet){
    this.lastBet = lastBet;
  }

  updateMoney(x) {
    this.money += x;
    this.money = Math.round(this.money * 100) / 100;
    this.emit("moneyUpdate");
  }

  updateBid(x) {
    this.totalBet += x;
    this.totalBet = Math.round(this.totalBet * 100) / 100;
    this.emit("totalBetUpdate");
  }

  deleteLastBets(){
    let bets = this.bets;
    let allLastBet =  this.lastBet;
    if(bets.length > 0){
      let lastBet = allLastBet.pop();
      for(let i = bets.length-1; i >= 0; i--){
        if(bets[i] && (bets[i].value === lastBet.value) &&(bets[i].type === lastBet.type)){
            if((bets[i].bid - lastBet.bid) > 0) {
                bets[i].bid -= lastBet.bid;
                bets[i].bid = Math.round(bets[i].bid * 100) / 100;
            }else {
                delete(bets[i]);
            }
            this.emit("betsUpdate");
            this.updateMoney(lastBet.bid);
            this.updateBid(-lastBet.bid);
        }
      }
    }
  }

  deleteAllBets() {
    this.updateBets([], -this.totalBet);
  }

  newGame() {
      this.previusBets = this.bets;
      this.previousBid = this.totalBet;
      this.bets = [];
      this.totalBet = 0;
    this.emit("betsUpdate");
    this.emit("totalBetUpdate");
    this.emit("newGame");
  }

  handleActions(action) {
    switch(action.type) {
      case "UPDATE_BETS":
        this.updateBets(action.bets, action.money);
        break;
      case "UPDATE_LAST_BETS":
        this.updateLastBets(action.lastBet);
        break;
      case "DELETE_LAST_BETS":
        this.deleteLastBets();
        break;
      case "DELETE_ALL_BETS":
        this.deleteAllBets();
        break;
      case "START_GAME":
        this.emit("startGame");
        break;
      case "START_NEW_GAME":
        this.newGame();
        break;
      case "TOKEN_CLICKED":
        this.token = action.val;
        this.emit("tokenUpdate");
        break;
      default:
        break;
    }
  }

}

const gameStore = new GameStore();
dispatcher.register(gameStore.handleActions.bind(gameStore));

export default gameStore;
