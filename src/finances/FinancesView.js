import React, { Component } from 'react';
import MonthNavigation from '../MonthNavigation.js';
import NewTransactionFormView from './views/NewTransactionFormView.js';
import TotalsView from './views/TotalsView.js';
import TransactionListView from './views/TransactionListView.js';
import { API_ROOT } from '../config.js';

class FinancesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incomes: [],
            expenses: [],
            credit_payments: [],
            savings_transfers: [],
            income_total: 0,
            expense_total: 0,
            month: new Date(),
            nav_date: new Date(),
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
        this.getTransactions();

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

    setDate = (date) => {
        this.setState({ nav_date: date }, () => {
            this.getTransactions();
        });
    }

    logOut = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }   

    compareByDate = (a, b) => {
        var date1 = new Date(a['date']);
        var date2 = new Date(b['date']);

        if (date1 < date2) return -1;
        if (date1 === date2) return 0;
        return 1;

    } 

    sortAndSaveData = (data) => {

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

        this.setState(
            {
                incomes: incomes.sort(this.compareByDate),
                expenses: expenses.sort(this.compareByDate),
                savings_transfers: savings_transfers.sort(this.compareByDate),
                credit_payments: credit_payments.sort(this.compareByDate),
                income_total: Math.round(income_total * 100) / 100,
                expense_total: Math.round(expense_total * 100) / 100,
                income_categories: income_categories,
                expense_categories: expense_categories,
            }
        )
    }

    getTransactions = () => {

		var data = {
			method: "GET",
			headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.props.token
			},
			mode: 'cors',
        };
        
        var query = '?month=' + (this.state.nav_date.getMonth() + 1) + '&year=' + (this.state.nav_date.getFullYear());

        fetch(API_ROOT + '/transactions/' + query, data)
            .then((data) => { 
                data.json()
                    .then((data) => { 
                        this.sortAndSaveData(data);
                    }) 
            })
            .catch(err => { alert(err); });

    }


    render() {

        return (
            <div>
                <button onClick={this.logOut}>Log Out</button>
                <div className='container'>
                    <div className="row">
                        <div className='col-lg-6' >
                            <NewTransactionFormView />

                        </div>
                        <div className='col-lg-6'>
                            <TotalsView month={this.months[this.state.nav_date.getMonth()]} year={this.state.nav_date.getFullYear()} expense_categories={this.state.expense_categories} expense_total={this.state.expense_total} income_total={this.state.income_total} />
                        </div>
                    </div>
                </div>
                <TransactionListView incomes={this.state.incomes} expenses={this.state.expenses} />
                <MonthNavigation setDate={this.setDate} selected_date={this.state.nav_date}/>
            </div>
        );
    }
}

export default FinancesView;
