import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Connect4 from './connect4/index';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Cognite interview boilerplate</h1>
        </header>
        <Connect4 />
      </div>
    );
  }
}

export default App;
