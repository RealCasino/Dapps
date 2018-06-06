import React, { Component } from "react";

import GameStore from "../stores/GameStore";
import * as Actions from "../actions/GameActions";

import styles from "../App.css";

import Board from "./Board";
import RouletteVideo from "./RouletteVideo";

import Infobox from "./Infobox";
import Controls from "./Controls";
import EndGameWindow from "./EndGameWindow";
import ErrorWindow from "./ErrorWindow";
import ProgressWindow from "./ProgressWindow";
import Bet from "./Bet";
import Web3 from "web3";
//import abiDecoder from "abi-decoder";

class Game extends Component {
    constructor() {
        super();
        this.state = {
            numbers: GameStore.getNumbers(),
            money: GameStore.getMoney(),
            totalBet: 0,
            token: GameStore.getToken(),
            bets: [],
            lastBet: [],
            endGame: false,
            win: 0,
            winningNumber: null,
            moneyError: false,
            progresWin:false,
            videoURL: GameStore.getVideoURL(),
            completeBetsDisable: GameStore.getCompleteBtnStatus(),
            cancelBtnDisable: GameStore.getCancelBetsBtnStatus(),
            chipDisable: GameStore.getChipBtnStatus(),
            isPlaceBetsImgHidden: GameStore.getPlaceBetsImgStatus()
        };
        this.counter = 0;
    }

    componentWillMount() {
        GameStore.on("startGame", () => {
            this.startGame();
        });
        GameStore.on("newGame", () => {
            this.setState({ endGame: false, win: 0, winningNumber: null });
        });
        GameStore.on("moneyUpdate", () => {
            this.setState({ money: GameStore.getMoney() });
        });
        GameStore.on("betsUpdate", () => {
            this.setState({ bets: GameStore.getBets() });
        });
        GameStore.on("tokenUpdate", () => {
            this.setState({ token: GameStore.getToken() });
        });
    }

    startGame() {
        let web3, self = this;
        this.setState({cancelBtnDisable: true, completeBetsDisable: true, chipDisable:true});

        if (typeof web3 !== "undefined") {
            web3 = new Web3(web3.currentProvider);
        } else {
            web3 = new Web3(
                new Web3.providers.HttpProvider("http://localhost:8545")
            );
        }
        let coinbase = web3.eth.coinbase;
        //let balance = web3.eth.getBalance(coinbase);
        const recipientAddress = "0x490314424d6BA95c25F81bbFBBA352cdcf44Ee7f";
        const recipientABI = [{"constant":false,"inputs":[{"name":"playerBets","type":"uint256[]"}],"name":"registerBets","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bets","outputs":[{"name":"owner","type":"address"},{"name":"betType","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"block","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"betsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"toBlock","type":"uint256"},{"name":"result","type":"uint256"},{"name":"resultVideo","type":"string"}],"name":"registerResult","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[],"name":"onBetsRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_fromBlock","type":"uint256"},{"indexed":false,"name":"_toBlock","type":"uint256"},{"indexed":false,"name":"_result","type":"uint256"},{"indexed":false,"name":"_resultVideo","type":"string"}],"name":"onResultRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_winner","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"onWinRegistered","type":"event"}];
        const bets = this.state.bets;
        let posBid = [];
        bets.forEach((val, idx, arr) => {
            if (val.hasOwnProperty("pos") && val.hasOwnProperty("bid")) {
                posBid.push(val.pos, parseInt(web3.toWei(val.bid, 'finney'), 10));
            }
        });
        let totalBet = web3.toWei(GameStore.getTotalBet(), 'finney');
        const totalGas = 100000 + 30000 * (posBid.length / 2);
        web3.eth.defaultAccount = web3.eth.accounts[0];
        let myContract = web3.eth.contract(recipientABI).at(recipientAddress);
        myContract.registerBets(
            posBid,
            {
                from: web3.eth.accounts[0],
                gas: totalGas,
                value: totalBet
            },
            (error, event) => {
                if (!error) {
                    this.setState({ progresWin: true });
                    let myFilter = web3.eth.filter({
                        fromBlock: 0,
                        toBlock: "latest",
                        address: recipientAddress
                    }).get((err, result)=>{
                        if (!err) {
                            myContract.onResultRegistered({}, (errResultRegistered,resultResultRegistered)=>{
                                if(!errResultRegistered){
                                    if(resultResultRegistered.hasOwnProperty('args') && resultResultRegistered.args.hasOwnProperty('_resultVideo')){
                                        this.setState({ progresWin: false });
                                        let videoUrl = resultResultRegistered.args._resultVideo;
                                        let num  = videoUrl.slice(videoUrl.lastIndexOf('/')+1);
                                        num = num.slice(0, num.indexOf('.'));
                                        self.refs.rouletteVideo.sendNumber(num);
                                        self.setState({isPlaceBetsImgHidden: true});
                                        setTimeout(()=>{
                                            let rand = resultResultRegistered.args._result.c[0];
                                            let winningNumber = self.state.numbers[rand];
                                            self.getWin(winningNumber);
                                            self.setState({endGame: true, winningNumber: winningNumber});
                                            self.refs.infobox.addWinningNumber(winningNumber.id, winningNumber.color);
                                            self.setState({completeBetsDisable: false, cancelBtnDisable:false, chipDisable:false});
                                            self.setState({isPlaceBetsImgHidden: false});

                                        },16000);
                                    }
                                }
                            });

                            /*myContract.onWinRegistered({}, (errWinRegistered, resultWinRegistered)=>{
                                console.log("onWinRegistered", arguments);
                                if(!errWinRegistered){
                                    console.log('resultWinRegistered', resultWinRegistered);
                                }
                            });*/
                        }else{
                            console.log('err', err);
                            this.setState({ progresWin: false });
                        }
                    });
                } else{
                    console.log('registerBets Error:', error);
                    this.setState({ progresWin: false });
                    GameStore.deleteAllBets();
                    self.setState({completeBetsDisable: false, cancelBtnDisable:false, chipDisable:false});
                }
            }
        );
    }

    getWin(winningNumber) {
        let bets = this.state.bets;
        let win = 0;
        for (let i = 0; i < bets.length; i++) {
            if (bets[i]) {
                bets[i].getWin(winningNumber);
                win += bets[i].win;
            }
        }
        this.setState({ win });
        GameStore.updateMoney(win);
    }

    optionClicked(type, val, id) {
        if (this.state.token <= this.state.money) {
            let bets = this.state.bets;
            let lastBet = this.state.lastBet;
            if (!bets[id]) {
                bets[id] = new Bet(type, val, this.state.token, id);
            } else {
                bets[id].raiseBid(this.state.token);
            }
            lastBet[this.counter] = new Bet(type, val, this.state.token, id);
            this.counter += 1;
            Actions.updateBets(bets, this.state.token);
            Actions.updateLastBet(lastBet);
        } else {
            this.setState({ moneyError: true });
        }
    }

    deleteBet(id) {
        let bets = this.state.bets;
        let bid = bets[id].bid;
        bets[id] = null;
        Actions.updateBets(bets, -bid);
    }

    playPrevoiusBets() {
        let previousBets = GameStore.getPreviousBets();
        let totalPrevoiusBet = GameStore.getPreviousBid();
        if (totalPrevoiusBet <= this.state.money + GameStore.getTotalBet()) {
            Actions.updateBets(
                previousBets,
                totalPrevoiusBet - GameStore.getTotalBet()
            );
        } else {
            this.setState({ moneyError: true });
        }
    }

    deleteError() {
        this.setState({ moneyError: false });
    }

    deleteProgress() {
        this.setState({ progresWin: false });
    }

    render() {
        return (
            <div className={styles.gameContainer}>
                <div className={styles.boardVideo}>
                    <Board
                        optionClicked={this.optionClicked.bind(this)}
                        deleteBet={this.deleteBet.bind(this)}
                        chipDisable = {this.state.chipDisable}
                    />
                    <RouletteVideo videoLink = {this.state.videoURL}  isHide={this.state.isPlaceBetsImgHidden} ref="rouletteVideo" />

                </div>
                <Controls playPrevoiusBets={this.playPrevoiusBets.bind(this)}
                      completeBetsDisable={this.state.completeBetsDisable}
                      cancelBtnDisable={this.state.cancelBtnDisable}
                      chipDisable = {this.state.chipDisable}
                />
                <Infobox deleteBet={this.deleteBet.bind(this)} ref="infobox" />
                <EndGameWindow
                    display={this.state.endGame}
                    winningNumber={this.state.winningNumber}
                    win={this.state.win}
                />
                <ErrorWindow
                    display={this.state.moneyError}
                    deleteError={this.deleteError.bind(this)}
                />
                <ProgressWindow
                    display={this.state.progresWin}
                    deleteProgress={this.deleteProgress.bind(this)}
                />
            </div>
        );
    }
}

export default Game;