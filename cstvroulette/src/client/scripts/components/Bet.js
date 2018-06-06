class Bet {

  constructor(type, value, bid, pos) {
    this.pos = pos;
    this.type = type;
    this.value = value;
    this.bid = bid;
    this.multiplier = this.setMultiplier();
    this.win = 0;
  }

  setMultiplier() {
    let multiplier;
    switch(this.type) {
      case "number":
        multiplier = 36;
        break;
      case "color":
      case "parity":
      case "half":
        multiplier = 2;
        break;
      case "twelve":
      case "row":
        multiplier = 3;
        break;
      default:
        break;
    }

    return multiplier;

  }

  raiseBid(val) {
    this.bid += val;
    this.bid = Math.round(this.bid * 100) / 100;
  }

  getWin(winningNumber) {
    let win = false;
    let number = winningNumber.id;
    let color = winningNumber.color;
    switch(this.type) {
      case "number":
        win = this.value === number ? true : false;
        break;
      case "color":
        win = this.value === color ? true : false;
        break;
      case "parity":
        if (number !== 0 && this.value === 'odd' && number % 2 !== 0) {win = true;}
        else if (number !== 0 && this.value === 'even' && number % 2 === 0) {win = true;}
        break;
      case "twelve":
        if (this.value === '1-12' && number >= 1 && number <= 12) {win = true;}
        else if (this.value === '13-24' && number >= 13 && number <= 24) {win = true;}
        else if (this.value === '25-36' && number >= 25 && number <= 36) {win = true;}
        break;
      case "half":
        if (this.value === '1-18' && number >= 1 && number <= 18) {win = true;}
        else if (this.value === '19-36' && number >=19 && number <= 36) {win = true;}
        break;
      case "row":
        if (number !== 0 && this.value === '1st' && number%3 === 1) {win = true;}
        else if (number !== 0 && this.value === '2nd' && number%3 === 2) {win = true;}
        else if (number !== 0 && this.value === '3rd' && number%3 === 0) {win = true;}
        break;
      default:
        break;
    }

    if (win) { this.win = this.multiplier * this.bid; }
    else { this.win = 0;}

  }


} // class

export default Bet;
