import React, { Component } from 'react';
import LoginComponent from './LoginComponent.js';
import FinancesView from './finances/FinancesView.js';
import Header from './header/Header.js';
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

    this.state.nav_date = new Date();
    this.state.update = false;
    this.state.incomes = [];
    this.state.expenses = [];
  }

  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  setDate = (date, callback) => {
    this.setState({ nav_date: date }, () => {
        callback();
    });
  }

  submit = (password) => {
    this.setState({token: password});
    localStorage.setItem("token", password);
  }


  compareByDate = (a, b) => {
    var date1 = new Date(a['date']);
    var date2 = new Date(b['date']);

    if (date1 < date2) return -1;
    if (date1 === date2) return 0;
    return 1;

  } 

  updateTransactions = (incomes, expenses) => {
    this.setState({incomes: incomes.sort(this.compareByDate), expenses: expenses.sort(this.compareByDate)})
  }

  render() {
    return (
      <div id="#" className="App">
        { this.state.token ? 
          <>
            <Header 
              token={ this.state.token }
              nav_date={this.state.nav_date}
              months={this.months}
              update={this.updateFinancesView}
              updateTransactions={this.updateTransactions}
              incomes={this.state.incomes}
              expenses={this.state.expenses}
            />
            <div style={{marginTop: '60px'}}></div>
            <FinancesView 
              token={ this.state.token }
              nav_date={this.state.nav_date}
              setDate={this.setDate}
              months={this.months}
              updateTransactions={this.updateTransactions}
              incomes={this.state.incomes}
              expenses={this.state.expenses}
            />
          </>
           : 
          (
          <div>
            <LoginComponent submit={this.submit} /> 
          </div>
          )
        }
      </div>
    );
  }
}

export default App;
