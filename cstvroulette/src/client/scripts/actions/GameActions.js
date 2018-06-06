import dispatcher from '../dispatcher';

export function updateBets(bets, money) {
  dispatcher.dispatch({
    type: "UPDATE_BETS",
    bets: bets,
    money: money
  });
}

export function updateLastBet(lastBet) {
  dispatcher.dispatch({
    type: "UPDATE_LAST_BETS",
    lastBet: lastBet
  });
}



export function startGame() {
  dispatcher.dispatch({
    type: "START_GAME"
  });
}

export function deleteAllBets() {
  dispatcher.dispatch({
    type: "DELETE_ALL_BETS"
  });
}

export function deleteLastBets(){
  dispatcher.dispatch({
    type: "DELETE_LAST_BETS"
  });
}

export function startNewGame() {
  dispatcher.dispatch({
    type: "START_NEW_GAME"
  });
}

export function tokenClicked(val) {
  dispatcher.dispatch({
    type: "TOKEN_CLICKED",
    val: val
  });
}
