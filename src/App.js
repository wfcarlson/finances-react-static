import React, { Component } from 'react';
import LoginComponent from './LoginComponent.js';
import BirdDetectionComponent from './BirdDetectionComponent.js';
import FinancesView from './finances/FinancesView.js';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    if (localStorage.getItem("token"))
    {
      this.state = {
        token: localStorage.getItem("token")
      }
    }
    else {
      this.state = {
        token: ""
      }
    }
    
  }

  submit = (password) => {
    this.setState({token: password});
    localStorage.setItem("token", password);
  }

  render() {
    return (
      <div className="App">
        { this.state.token ? 
          <FinancesView token={ this.state.token } />
           : 
          (
          <div>
            <LoginComponent submit={this.submit} /> 
            <BirdDetectionComponent />
          </div>
          )
        }
      </div>
    );
  }
}

export default App;
