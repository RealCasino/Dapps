import React, { Component } from 'react';
import styles from '../App.css';


class RouletteVideo extends Component {
    constructor() {
        super();
    }

    toggleClass(hide){
        return hide ? styles.hide: '';
    }
    sendNumber(num){
        if(this.ifr){
            this.ifr.contentWindow.postMessage({type:'video', number:num}, "*");
        }
        return false;
    }

    render(){
        if (this.props.videoLink) {
            return (
                <div className={styles.videoPlaceBet}>
                    <img className={`${this.toggleClass(this.props.isHide)}`} src="images/place_bets.jpg" alt=""/>
                    <iframe className={`${this.toggleClass(!this.props.isHide)}`}
                            id={`${styles.videoPlaceBetFrame}`}
                            src={`${this.props.videoLink}`}
                            frameBorder="0"
                            allow="autoplay;"
                            ref={(f) => this.ifr = f}
                    ></iframe>
                </div>
            );
        }
    }
}
export default RouletteVideo;