import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountBalance from '@material-ui/icons/AccountBalance';
import Add from '@material-ui/icons/Add';
import NewTransactionFormView from './NewTransactionFormView.js';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

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

    openPlaid = () => {
        document.getElementsByClassName('_id_plaid_link')[0].click()
    }

        
    showForm = () => {
        this.setState({open: true});
    }

    handleClose = () => {
        this.setState({open: false});
    }

    render () {
        return (
            <>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h4" color="inherit" noWrap>
                            Finances
                        </Typography>
                        <div style={{flexGrow: 1}} />
                        <IconButton color="inherit" onClick={this.showForm}>
                            <Add />
                        </IconButton>
                        <IconButton color="inherit" onClick={this.openPlaid}>
                            <AccountBalance />
                        </IconButton>  
                        <IconButton color="inherit" onClick={this.logOut}>
                            <ExitToApp />
                        </IconButton>
                        <div hidden={ true }>
                            <PlaidLink
                                clientName='Walter'
                                env='development'
                                publicKey='9d7db14e1dc1a8595c35d7ad861e8e'
                                product={['transactions']}
                                onExit={this.handleOnExit}
                                onSuccess={this.handleOnSuccess}
                                className='_id_plaid_link'
                            >
                            </PlaidLink>
                        </div>
                    </Toolbar>          
                </AppBar>
                <NewTransactionFormView 
                    open={this.state.open}
                    handleClose={this.handleClose}
                    nav_date={this.props.nav_date}
                    months={this.props.months}
                    token={this.props.token}
                    updateTransactions={this.props.updateTransactions} 
                    incomes={this.props.incomes}
                    expenses={this.props.expenses}
                />        
            </>
        )
    }
}
export default Header;