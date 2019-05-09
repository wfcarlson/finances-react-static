import React, { Component } from 'react';
import MonthNavigation from '../MonthNavigation.js';
import TotalsView from './views/TotalsView.js';
import TransactionListView from './views/TransactionListView.js';
import { API_ROOT } from '../config.js';

class FinancesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incomes: props.incomes,
            expenses: props.expenses,
            credit_payments: [],
            savings_transfers: [],
            income_total: 0,
            expense_total: 0,
            nav_date: this.props.nav_date,
            income_categories: {
                "other": 0
            },
            expense_categories: {
                "rent/parking": 0,
                "utilities": 0,
                "car payment": 0,
                "car insurance": 0,
                "gas/transportation": 0,
                "food out": 0,
                "alcohol": 0,
                "groceries": 0,
                "subscriptions": 0,
                "personal care": 0,
                "gym": 0,
                "entertainment": 0,
                "discretionary": 0,
                "other": 0
            },
        }
        this.getTransactions(props.updateTransactions);

    }


    sortAndSaveData = (data, updateTransactions) => {

        var incomes = []
        var expenses = []
        var credit_payments = []
        var savings_transfers = []
        var income_total = 0
        var expense_total = 0

        var income_categories = {
            "other": 0
        }
        
        var expense_categories = {
            "rent/parking": 0,
            "utilities": 0,
            "car payment": 0,
            "car insurance": 0,
            "gas/transportation": 0,
            "food out": 0,
            "alcohol": 0,
            "groceries": 0,
            "subscriptions": 0,
            "personal care": 0,
            "gym": 0,
            "entertainment": 0,
            "discretionary": 0,
            "other": 0
        }

        data.map((transaction) => {
            if (transaction['type'] === 'income') {
                income_total += transaction['amount'];
                incomes.push(transaction);

                if (transaction['finances_category']) {

                    if (income_categories[transaction['finances_category']]){
                        income_categories[transaction['finances_category']] = income_categories[transaction['finances_category']] + transaction['amount']
                    }
                    else {
                        income_categories[transaction['finances_category']] = transaction['amount']
                    }
                }
                else {
                    income_categories["other"] += transaction['amount']
                }
            }
            else if (transaction['type'] === "debit card expense" || transaction['type'] === 'credit card expense' || transaction['type'] === 'cash') {
                expense_total += transaction['amount'];
                expenses.push(transaction);

                if (transaction['finances_category']) {

                    if (expense_categories[transaction['finances_category']]){
                        expense_categories[transaction['finances_category']] = expense_categories[transaction['finances_category']] + transaction['amount']
                    }
                    else {
                        expense_categories[transaction['finances_category']] = transaction['amount']
                    }
                }
                else {
                    expense_categories["other"] += transaction['amount']
                }
            }
            else if (transaction['type'] === 'credit card payment') {
                credit_payments.push(transaction);
            }
            else {
                savings_transfers.push(transaction);
            }
            return 0;
        })

        updateTransactions(incomes, expenses);

        this.setState(
            {
                savings_transfers: savings_transfers,
                credit_payments: credit_payments,
                income_total: Math.round(income_total * 100) / 100,
                expense_total: Math.round(expense_total * 100) / 100,
                income_categories: income_categories,
                expense_categories: expense_categories,
            }
        )
    }

    getTransactions = (updateTransactions) => {

		var data = {
			method: "GET",
			headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.props.token
			},
			mode: 'cors',
        };
        
        var query = '?month=' + (this.props.nav_date.getMonth() + 1) + '&year=' + (this.props.nav_date.getFullYear());

        fetch(API_ROOT + '/transactions/' + query, data)
            .then((data) => { 
                data.json()
                    .then((data) => { 
                        this.sortAndSaveData(data, updateTransactions);
                    }) 
            })
            .catch(err => { alert(err); });

    }


    render() {
        
        return (
            <div>
                <div className='container'>
                    <div className="row">
                        <div className='col-lg-6'>
                            <TotalsView token={this.props.token} month={this.props.months[this.props.nav_date.getMonth()]} year={this.props.nav_date.getFullYear()} expense_categories={this.state.expense_categories} expense_total={this.state.expense_total} income_total={this.state.income_total} getTransactions={this.getTransactions}/>
                        </div>
                    </div>
                </div>
                <TransactionListView incomes={this.props.incomes} expenses={this.props.expenses} token={this.props.token} getTransactions={this.getTransactions}/>
                <MonthNavigation setDate={this.props.setDate} selected_date={this.props.nav_date} callback={this.getTransactions} />
            </div>
        );
    }
}

export default FinancesView;
