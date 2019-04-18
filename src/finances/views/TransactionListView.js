import React, { Component } from 'react';
import { API_ROOT } from '../../config.js';

class TransactionListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: ''
        }
    }

    handleDelete = (transaction) => {
        return () => {

            var data = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.props.token
                },
                mode: 'cors',
                body: JSON.stringify({transaction_id: transaction.transaction_id, date: transaction.date})
            };
            
            fetch(API_ROOT + '/transactions/', data)
                .then(() => { 
                    this.getTransactions();
                }) 
                .catch(err => { console.log(err); }); 
        }
    }

    setEdit = (transaction) => {
        return () => {
            this.setState({editing: transaction});
        }
    }

    handleEdit = (attribute) => {
        return (event) => {
            var editing = this.state.editing;
            editing[attribute] = event.target.value;
            this.setState({editing: editing});
        }
    }

    saveEdit = () => {
                    
        var data = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.props.token
            },
            mode: 'cors',
            body: JSON.stringify(this.state.editing)
        };
        
        fetch(API_ROOT + '/transactions/', data)
            .then((data) => { 
                data.json()
                    .then(() => { 
                        this.setState({editing: ''})
                        this.getTransactions();
                    }) 
            })
            .catch(err => { console.log(err); }); 
    }

    render () {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }} >
                <h1>Incomes</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.incomes.map((income) => 
                            
                            (<tr style={{ cursor:'pointer' }} onClick={this.setEdit(income)} key={income['transaction_id']}>
                                <td>{income['date']}</td>
                                <td>{income['amount']}</td>
                                <td>
                                    { this.state.editing.transaction_id === income.transaction_id ? 
                                        (
                                            <input type='text' value={this.state.editing.name} onChange={ this.handleEdit('name') }></input>
                                        )
                                            :
                                        (
                                            income['name']
                                        )
                                    }
                                </td>
                                <td>
                                    { this.state.editing.transaction_id === income.transaction_id ? 
                                        (
                                            <label>
                                                <select value={income.finances_category} onChange={this.handleUpdate(income)}>
                                                    <option value="other">Other</option>
                                                    <option value="primary income">Primary Income</option>
                                                    <option value="tax return">Tax Return</option>
                                                    <option value="bonus income">Bonus Income</option>
                                                </select>
                                            </label>
                                        )
                                            :
                                        (
                                            income.finances_category
                                        )
                                    }

                                </td>
                                <td onClick={this.handleDelete(income)} style={{ cursor: 'pointer' }}>X</td>
                                { this.state.editing.transaction_id === income.transaction_id ?
                                    (<td><button onClick={this.saveEdit}>save</button></td>)
                                        :
                                    (null)
                                }
                            </tr>)
                        )}
                    </tbody>
                </table>
                <h1>Expenses</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.expenses.map((expense) => 

                            (<tr style={{ cursor:'pointer' }} onClick={this.setEdit(expense)} key={expense['transaction_id']}>
                                <td>{expense['date']}</td>
                                <td>{expense['amount']}</td>
                                <td>
                                    { this.state.editing.transaction_id === expense.transaction_id ? 
                                        (
                                            <input type='text' value={this.state.editing.name} onChange={ this.handleEdit('name') }></input>
                                        )
                                            :
                                        ( expense['name'] )
                                    }
                                </td>
                                <td>
                                    { this.state.editing.transaction_id === expense.transaction_id ? 
                                        (
                                            <label>
                                                <select value={this.state.editing.finances_category} onChange={ this.handleEdit('finances_category') }>
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
                                                </select>
                                            </label>
                                        )
                                            :
                                        (
                                            expense.finances_category
                                        )
                                    }
                                    
                                </td>
                                <td onClick={this.handleDelete(expense)} style={{ cursor: 'pointer' }}>X</td>
                                { this.state.editing.transaction_id === expense.transaction_id ?
                                    (<td><button onClick={this.saveEdit}>save</button></td>)
                                        :
                                    (null)
                                }
                            </tr>)
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default TransactionListView