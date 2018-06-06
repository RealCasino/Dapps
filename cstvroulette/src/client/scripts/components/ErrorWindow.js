import React, { Component } from 'react';

import styles from '../App.css';

class ErrorWindow extends Component {

  closeWindow(){
    this.props.deleteError();
  }

  printClass() {
    if (this.props.display) {
      return styles.modalOpen;
    }
    else {
      return "";
    }
  }

  render() {

    return (
      <div className={`${styles.modal} ${this.printClass()}`}>
        <div className={`${styles.modalContent} ${styles.errorWindowContent}`}>
          <p>You dont have enough money.</p>
          <button className={styles.defaultBtn} onClick={() => this.closeWindow()}>OK</button>
        </div>
      </div>
    );
  }

}

export default ErrorWindow;
