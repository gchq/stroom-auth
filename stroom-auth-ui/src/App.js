import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Please log in</h2>
        </div>
        <p className="App-intro">
          <form>
              Username: <input type="text" name="username"/>
              Password: <input type="password" name="password"/>
              <input type="submit" value="Submit"/>
          </form>
        </p>
      </div>
    );
  }
}

export default App;
