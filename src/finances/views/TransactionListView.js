import React, { Component } from 'react';
import { API_ROOT } from '../../config.js';

class TransactionListView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editing: '',
            expanded: '',
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
                    this.props.getTransactions();
                }) 
                .catch(err => { console.log(err); }); 
        }
    }

    setEdit = (transaction) => {
        return (event) => {
            event.stopPropagation();
            this.setState({editing: transaction});
        }
    }

    handleEdit = (attribute) => {
        return (event) => {
            event.stopPropagation();
            var editing = this.state.editing;
            editing[attribute] = event.target.value;
            this.setState({editing: editing});
        }
    }

    saveEdit = (event) => {
        event.stopPropagation();
     
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
                        this.props.getTransactions();
                    }) 
            })
            .catch(err => { console.log(err); }); 
    }

    formatDate = (date) => {
        var nums = date.match(/\d+/g)
        return '' + nums[1] + '-' + nums[2];
    }

    toggleExpand = (transaction_type, i) => {
        return () => {
            var id = '#' + transaction_type + '_' + i + '_info';
            if (id === this.state.expanded) 
            {
                var myElement = document.querySelector(id);
                myElement.style.height = '0px';
                this.setState({expanded: ''})
            }
            else {
                if (this.state.expanded) {
                    var myElement = document.querySelector(this.state.expanded);
                    myElement.style.height = '0px';
                }

                var myElement = document.querySelector(id);
                myElement.style.height = 'auto';
                this.setState({expanded: id})
            }
        }
    }

    suppressClick = (event) => {
        event.stopPropagation();
    }

    render () {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }} >
                <h1>Incomes</h1>
                <div style={{ marginRight: '10px', marginLeft: '10px', marginBottom: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'row', borderBottom: '2px solid black'}} >
                    <div style={{ width: '40px',marginBottom: '5px'}}>Date</div>
                    <div style={{ maxWidth: '195px', marginRight: 'auto', marginLeft: '15px' }}>Name</div>
                    <div style={{ width: '50px', marginLeft: '15px'}}>Amount</div>
                </div>
                {this.props.incomes.map((income, i) => 
                    
                    (<div key={"income_" + i}>
                        <div style={{ marginRight: '10px', marginLeft: '10px', cursor:'pointer', display: 'flex', flexDirection: 'row' }} onClick={this.toggleExpand('income', i)} key={income['transaction_id']}>
                            <div style={{ width: '40px',marginBottom: '5px'}}>{ this.formatDate(income['date']) }</div>
                            <div style={{ maxWidth: '245px', marginRight: 'auto', marginLeft: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                { this.state.editing.transaction_id === income.transaction_id ? 
                                    (
                                        <input onClick={ this.suppressClick } type='text' value={this.state.editing.name} onChange={ this.handleEdit('name') }></input>
                                    )
                                        :
                                    ( income['name'] )
                                }
                            </div>
                            <div style={{ width: '50px', marginLeft: '15px'}}>{income['amount']}</div>
                        </div>
                        <div style={{ marginRight: '10px', marginLeft: '10px', marginBottom: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'row', borderBottom: '2px solid lightgrey'}} onClick={this.toggleExpand(i)} className="expander" id={'income_' + i + '_info'}>
                            <div style={{ width: '40px', marginBottom: '5px'}}>
                                { this.state.editing.transaction_id === income.transaction_id ? 
                                    (
                                        <button onClick={this.saveEdit}>Save</button>
                                    )
                                        :
                                    (
                                        <button onClick={this.setEdit(income)}>Edit</button>
                                    )
                                }
                            </div>
                            <div style={{ maxWidth: '195px', marginRight: 'auto', marginLeft: '15px'}}>
                                { this.state.editing.transaction_id === income.transaction_id ?
                                    (
                                        <select value={this.state.editing.finances_category} onChange={ this.handleEdit('finances_category') } onClick={ this.suppressClick }>
                                            <option value="other">Other</option>
                                            <option value="primary income">Primary Income</option>
                                            <option value="tax return">Tax Return</option>
                                            <option value="bonus income">Bonus Income</option>
                                        </select>
                                    )
                                        :
                                    (income['finances_category'])
                                }
                            </div>
                            <div style={{ width: '50px', marginLeft: '15px' }} onClick={this.handleDelete(income)}>X</div>
                        </div>
                    </div>)
                )}
                <h1 id="expenses">Expenses</h1>
                <div style={{ marginRight: '10px', marginLeft: '10px', marginBottom: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'row', borderBottom: '2px solid black'}} >
                    <div style={{ width: '40px',marginBottom: '5px'}}>Date</div>
                    <div style={{ maxWidth: '195px', marginRight: 'auto', marginLeft: '15px' }}>Name</div>
                    <div style={{ width: '50px', marginLeft: '15px'}}>Amount</div>
                </div>
                {this.props.expenses.map((expense, i) => 

                    (<div key={"expense_" + i}>
                        <div style={{ marginRight: '10px', marginLeft: '10px', cursor:'pointer', display: 'flex', flexDirection: 'row' }} onClick={this.toggleExpand('expense', i)} key={expense['transaction_id']}>
                            <div style={{ width: '40px',marginBottom: '5px'}}>{ this.formatDate(expense['date']) }</div>
                            <div style={{ maxWidth: '245px', marginRight: 'auto', marginLeft: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                { this.state.editing.transaction_id === expense.transaction_id ? 
                                    (
                                        <input onClick={ this.suppressClick } type='text' value={this.state.editing.name} onChange={ this.handleEdit('name') }></input>
                                    )
                                        :
                                    ( expense['name'] )
                                }
                            </div>
                            <div style={{ width: '50px', marginLeft: '15px'}}>{expense['amount']}</div>
                        </div>
                        <div style={{ marginRight: '10px', marginLeft: '10px', marginBottom: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'row', borderBottom: '2px solid lightgrey'}} onClick={this.toggleExpand(i)} className="expander" id={'expense_' + i + '_info'}>
                            <div style={{ width: '40px', marginBottom: '5px'}}>
                                { this.state.editing.transaction_id === expense.transaction_id ? 
                                    (
                                        <button onClick={this.saveEdit}>Save</button>
                                    )
                                        :
                                    (
                                        <button onClick={this.setEdit(expense)}>Edit</button>
                                    )
                                }
                            </div>
                            <div style={{ maxWidth: '195px', marginRight: 'auto', marginLeft: '15px'}}>
                                { this.state.editing.transaction_id === expense.transaction_id ?
                                    (
                                        <select value={this.state.editing.finances_category} onChange={ this.handleEdit('finances_category') } onClick={ this.suppressClick }>
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
                                    )
                                        :
                                    (expense['finances_category'])
                                }
                            </div>
                            <div style={{ width: '50px', marginLeft: '15px' }} onClick={this.handleDelete(expense)}>X</div>
                        </div>
                    </div>)
                )}
            </div>
        )
    }
}
export default TransactionListView