import React, { Component } from 'react';
import { API_ROOT } from './config.js';
var Crypto = require('crypto-js');


class LoginComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      password: ""
    }
  }

  updatePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  submit = () => {
    var data = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.state.password
      },
      mode: 'cors',
    };

    fetch(API_ROOT + '/transactions/', data)
        .then(() => {
          this.props.submit(Crypto.SHA256(this.state.password).toString()) 
        }) 
        .catch(() => { alert('Incorrect password')});
  
  }

  render() {
    return (
      <div>
          <label>
              Password: 
              <input type="password" name="password" value={ this.state.password } onChange={ this.updatePassword } />
              <button onClick={ this.submit }>Login</button>
          </label>
      </div>
    );
  }
}

export default LoginComponent;
