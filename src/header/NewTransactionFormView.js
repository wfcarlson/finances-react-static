import React, { Component } from 'react';
import { API_ROOT } from '../config.js';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from '@material-ui/core';


class NewTransactionFormView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date().getDate(),
            amount: 0.00,
            category: "",
            name: "",
            type: "cash",
            open: props.open,
        }
    }

    handleChange = (attribute) => {
		return (event) => {
			var obj = {};
			obj[attribute] = event.target.value;
			this.setState(obj);
		}
    }
        
    submit = () => {
        var date_str = '' + new Date().getFullYear() + '-'
        var day;
        var month = this.props.nav_date.getMonth() + 1;
        var month_str = ''

        if (month < 10)
        {
            month_str = '0' + month + '-';
        }
        else {
            month_str = '' + month + '-';
        }

        if (('' + this.state.date).length < 2) {
            day = '0' + this.state.date;
        }
        else {
            day = this.state.date;
        }

        date_str += month_str
        date_str += day;

        var transaction = {
            amount: this.state.amount,
            date: date_str,
            type: this.state.type,
            name: this.state.name,
            finances_category: this.state.category
        }

        var data = {
			method: "POST",
			headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.props.token
			},
            mode: 'cors',
            body: JSON.stringify(transaction)
        };

        fetch(API_ROOT + '/transactions/', data)
            .then((data) => { 
                data.json()
                    .then(() => { 
                        this.setState({
                            date: new Date().getDate(),
                            amount: 0.00,
                            name: "",
                        });

                        var incomes = this.props.incomes;
                        var expenses = this.props.expenses;

                        if (this.state.type == 'income')
                        {
                            incomes = incomes.push(transaction)
                        }
                        else {
                            expenses = expenses.push(transaction)
                        }

                        this.props.updateTransactions(incomes, expenses);
                        this.props.handleClose();
                    }) 
            })
            .catch(err => { alert(err); }); 
    }


    render () {
        return (
            <Dialog open={this.props.open} onClose={this.props.handleClose}>
                <DialogTitle>New Transaction</DialogTitle>
                <List>
                    <ListItem>
                        <TextField 
                            id="date_field"
                            label='date'
                            value={this.state.date}
                            onChange={this.handleChange('date')}
                            style={{ width: '100%' }}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField 
                            id="amount_field"
                            label='amount'
                            value={this.state.amount}
                            onChange={this.handleChange('amount')}
                            style={{ width: '100%' }}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField 
                            id="name_field"
                            label='name'
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                            style={{ width: '100%' }}
                        />
                    </ListItem>
                    <ListItem>
                        <Select
                            value={this.state.type}
                            onChange={this.handleChange('type')}
                            name="type"
                            label='type'
                            style={{ width: '100%' }}
                        >
                            <MenuItem value="cash expense">Cash</MenuItem>
                            <MenuItem value="credit card expense">Credit</MenuItem>
                            <MenuItem value="debit card expense">Debit</MenuItem>
                            <MenuItem value="income">Income</MenuItem>
                        </Select>
                    </ListItem>
                    <ListItem>
                        
                        { this.state.type === 'income' ? 
                            (
                                <Select
                                    value={this.state.category}
                                    onChange={this.handleChange('category')}
                                    name='category'
                                    label='category'
                                    style={{ width: '100%' }}
                                >
                                    <MenuItem value="other">Other</MenuItem>
                                    <MenuItem value="primary income">Primary Income</MenuItem>
                                    <MenuItem value="tax return">Tax Return</MenuItem>
                                    <MenuItem value="bonus income">Bonus Income</MenuItem>
                                </Select>
                            ) : (
                                <Select
                                    value={this.state.category}
                                    onChange={this.handleChange('category')}
                                    name='category'
                                    label='category'
                                    style={{ width: '100%' }}
                                >
                                    <MenuItem value="other">Other</MenuItem>
                                    <MenuItem value="rent/parking">Rent/Parking</MenuItem>
                                    <MenuItem value="utilities">Utilities</MenuItem>
                                    <MenuItem value="car payment">Car Payment</MenuItem>
                                    <MenuItem value="car insurance">Car Insurance</MenuItem>
                                    <MenuItem value="gas/transportation">Gas/Transportation</MenuItem>
                                    <MenuItem value="food out">Food Out</MenuItem>
                                    <MenuItem value="alcohol">Alcohol</MenuItem>
                                    <MenuItem value="groceries">Groceries</MenuItem>
                                    <MenuItem value="subscriptions">Subscriptions</MenuItem>
                                    <MenuItem value="personal care">Personal Care</MenuItem>
                                    <MenuItem value="phone bill">Phone Bill</MenuItem>
                                    <MenuItem value="gym">Gym</MenuItem>
                                    <MenuItem value="entertainment">Entertainment</MenuItem>
                                    <MenuItem value="discretionary">Discretionary</MenuItem>
                                </Select>
                            )
                        }
                    </ListItem>
                    <ListItem>
                        <div style={{ float: 'center' }}>
                            <button onClick={this.submit}>Submit</button>
                        </div>
                    </ListItem>
                </List>
            </Dialog>
        )
    }
}

export default NewTransactionFormView;