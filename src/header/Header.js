import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';

class Header extends Component {

    logOut = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }   

    handleOnSuccess = (token, metadata) => {
        console.log(token)
        console.log(metadata)
        var data = {
			method: "POST",
			headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.props.token
			},
            mode: 'cors',
            body: JSON.stringify({public_token: token})
        };

        fetch('https://1rzyngmflh.execute-api.us-east-1.amazonaws.com/production/exchange', data)
            .then(() => { 
                alert("account added")
            })
            .catch(err => { console.log(err); }); 
    }

    handleOnExit = () => {

    }

    render () {
        return (
            <div style={{ height: 60, width: '100%', backgroundColor: 'green', display: 'flex'}}>
                <button onClick={this.logOut}>Log Out</button>
                <div style={{ margin: 'auto', marginLeft: '10px' }}>
                <PlaidLink
                    clientName='Walter'
                    env='development'
                    publicKey='9d7db14e1dc1a8595c35d7ad861e8e'
                    product ='transactions'
                    onExit={this.handleOnExit}
                    onSuccess={this.handleOnSuccess}
                >
                    Connect Account
                </PlaidLink>
                </div>
            </div>
        )
    }
}
export default Header;