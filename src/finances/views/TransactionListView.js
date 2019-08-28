import React, { Component } from 'react';
import { API_ROOT } from '../../config.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';



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
        return () => {
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

    handlePanelChange = transaction => () => {
        if (this.state.expanded === transaction)
        {
            this.setState({editing: "", expanded: ""})
        }
        else {
            this.setState({expanded: transaction})
        }
    };

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
                        this.props.getTransactions();
                    }) 
            })
            .catch(err => { console.log(err); }); 
    }

    formatDate = (date) => {
        var nums = date.match(/\d+/g)
        return '' + nums[1] + '-' + nums[2];
    }

    formatName = (name) => {
        if (name.length <= 40) {
            return name;
        }
        else {
            return name.substring(0, 38) + '...'
        }
    }

    renderTransaction = (transaction, transaction_type) => {
        return (
            <ExpansionPanel key={ transaction.transaction_id } expanded={this.state.expanded === transaction} onChange={this.handlePanelChange(transaction)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    { this.state.editing.transaction_id === transaction.transaction_id ?
                        (
                            <>
                                <TextField 
                                    id={ transaction.transaction_id + "_name_field" }
                                    label='name'
                                    value={this.state.editing.name}
                                    onChange={this.handleEdit('name')}
                                    onClick={(event) => event.stopPropagation() }
                                    style={{ width: '100%' }}
                                />
                                <TextField 
                                    id={ transaction.transaction_id + "_amount_field" }
                                    label='amount'
                                    value={this.state.editing.amount}
                                    onChange={this.handleEdit('amount')}
                                    onClick={(event) => event.stopPropagation() }
                                    style={{ width: '100%' }}
                                />
                                <IconButton color="inherit" onClick={this.handleDelete(transaction)}>
                                    <Clear />
                                </IconButton>
                            </>
                        )  
                            :   
                        (   <>
                                <Typography variant="subtitle1">{ this.formatName(transaction.name) }</Typography>
                                <div style={{flexGrow: 1}} />
                                <Typography variant="subtitle1">{ transaction.amount }</Typography>
                            </>
                        )
                    }
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    { this.state.editing.transaction_id === transaction.transaction_id ?
                        (
                            <>
                            { transaction_type === 'income' ? 
                                (
                                    <Select value={this.state.editing.finances_category} onChange={ this.handleEdit('finances_category') } >
                                        <MenuItem value="other">Other</MenuItem>
                                        <MenuItem value="primary income">Primary Income</MenuItem>
                                        <MenuItem value="tax return">Tax Return</MenuItem>
                                        <MenuItem value="bonus income">Bonus Income</MenuItem>
                                    </Select>
                                )
                                :
                                (
                                    <Select value={this.state.editing.finances_category} onChange={ this.handleEdit('finances_category') } >
                                        <MenuItem value="other">Other</MenuItem>
                                        <MenuItem value="rent">Rent</MenuItem>
                                        <MenuItem value="utilities">Utilities</MenuItem>
                                        <MenuItem value="parking">Parking</MenuItem>
                                        <MenuItem value="uber">Uber</MenuItem>
                                        <MenuItem value="car payment">Car Payment</MenuItem>
                                        <MenuItem value="car insurance">Car Insurance</MenuItem>
                                        <MenuItem value="car maintenance">Car Maintenance</MenuItem>
                                        <MenuItem value="gas">Gas</MenuItem>
                                        <MenuItem value="food and alcohol out">Food and Alcohol out</MenuItem>
                                        <MenuItem value="groceries">Groceries</MenuItem>
                                        <MenuItem value="subscriptions">Subscriptions</MenuItem>
                                        <MenuItem value="health care">Health care</MenuItem>
                                        <MenuItem value="gym memberships">Gym Memberships</MenuItem>
                                        <MenuItem value="clothing">Clothing</MenuItem>
                                        <MenuItem value="haircuts">Haircuts</MenuItem>
                                        <MenuItem value="entertainment">Entertainment</MenuItem>
                                        <MenuItem value="discretionary">Discretionary</MenuItem>
                                    </Select>
                                )
                            }
                                <div style={{flexGrow: 1}} />
                                <TextField 
                                    id="date_field"
                                    label='date'
                                    value={this.state.editing.date}
                                    onChange={this.handleEdit('date')}
                                    style={{ width: '100%' }}
                                />
                                <div style={{flexGrow: 1}} />
                                <Button onClick={this.saveEdit}>Save</Button>
                            </>
                        )  
                            :   
                        (   
                            <>
                                <Typography variant="subtitle1">{ transaction.finances_category }</Typography>
                                <div style={{flexGrow: 1}} />
                                <Typography variant="subtitle1">{ this.formatDate(transaction.date) }</Typography>
                                <div style={{flexGrow: 1}} />
                                <Button onClick={this.setEdit(transaction)}>Edit</Button>
                            </>
                        )
                    }

                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    render () {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }} >
                <h1>Incomes</h1>
                { this.props.incomes.map((income) => {
                            return this.renderTransaction(income, 'income')
                        }
                    )
                }
                <h1>Expenses</h1>
                { this.props.expenses.map((expense) => {
                            return this.renderTransaction(expense, 'expense')
                        }
                    )
                }
            </div>
        )
    }
}
export default TransactionListView