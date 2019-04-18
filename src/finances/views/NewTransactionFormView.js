import React, { Component } from 'react';
import { API_ROOT } from '../../config.js';

class NewTransactionFormView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date().getDate(),
            amount: 0.00,
            category: "",
            name: "",
            type: "cash",
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
        var month = this.state.nav_date.getMonth() + 1;
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
                        this.getTransactions();
                    }) 
            })
            .catch(err => { console.log(err); }); 
    }
    
    render () {
        return (
            <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', paddingLeft: '60px' }}>
                <h2>New Transaction</h2>
                <label>
                    Day:
                    <input type='number' value={this.state.date} onChange={this.handleChange('date')}></input>
                </label>
                <label>
                    Amount:
                    <input type='number' value={this.state.amount} onChange={this.handleChange('amount')}></input>
                </label>
                <label >
                    Name:
                    <input type='text' value={this.state.name} onChange={this.handleChange('name')}></input>
                </label>
                <label>
                    Type:
                    <select value={this.state.type} onChange={this.handleChange('type')}>
                        <option value="cash expense">Cash</option>
                        <option value="credit card expense">Credit</option>
                        <option value="debit card expense">Debit</option>
                        <option value="income">Income</option>
                    </select>
                </label>
                <label>
                    Category:
                    <select value={this.state.category} onChange={this.handleChange('category')}>
                    { this.state.type === 'income' ? 
                        (
                            <>
                            <option value="other">Other</option>
                            <option value="primary income">Primary Income</option>
                            <option value="tax return">Tax Return</option>
                            <option value="bonus income">Bonus Income</option>
                            </>
                        ) : (
                            <>
                            <option value="other">Other</option>
                            <option value="rent/parking">Rent/Parking</option>
                            <option value="utilities">Utilities</option>
                            <option value="car payment">Car Payment</option>
                            <option value="car insurance">Car Insurance</option>
                            <option value="gas/transportation">Gas/Transportation</option>
                            <option value="food out">Food Out</option>
                            <option value="alcohol">Alcohol</option>
                            <option value="groceries">Groceries</option>
                            <option value="subscriptions">Subscriptions</option>
                            <option value="personal care">Personal Care</option>
                            <option value="phone bill">Phone Bill</option>
                            <option value="gym">Gym</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="discretionary">Discretionary</option>
                            </>
                        )
                    }
                    </select>
                </label>
                <div style={{ float: 'center' }}>
                    <button onClick={this.submit}>Submit</button>
                </div>
            </div>
        )
    }
}

export default NewTransactionFormView;