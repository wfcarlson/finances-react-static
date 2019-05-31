import React, { Component } from 'react';


class TotalsView extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            income_categories: {
                "other": 0
            },
        }
    }


    expense_budget_categories = {
        "rent/parking": 1367.95,
        "utilities": 213.00,
        "car payment": 300,
        "car insurance": 200,
        "gas/transportation": 100,
        "food out": 300,
        "alcohol": 150,
        "groceries": 300,
        "subscriptions": 61,
        "personal care": 120,
        "gym": 60,
        "entertainment": 200,
        "discretionary": 300,
        "other": 50
    }

    renderCategories = (dict, total) => {

        var cats = Object.keys(dict).map((key) => {

            var color = 'black';
            if (dict[key] > this.expense_budget_categories[key]) {
                color = 'red';
            }
            else if (this.expense_budget_categories[key] > dict[key]) {
                color = 'green';
            }
            
            return (
                <tr key={ key } >
                    <td align='left'>
                        { key }
                    </td>
                    <td style={{ color:color }}>
                        { Math.round(dict[key] * 100) / 100 }
                    </td>
                    <td>
                        { this.expense_budget_categories[key] }
                    </td>
                </tr>
            )
        })

        cats.push(  
            <tr align='left' key={"total"} >
                <td>
                    Total
                </td>
                <td>
                    { total }
                </td>
                <td>
                    3801.95
                </td>
            </tr>
        )

        return cats;
    }

    render() {

        var color = 'black';
        if (this.props.expense_total > this.props.income_total) {
            color = 'red';
        }
        else if (this.props.income_total > this.props.expense_total) {
            color = 'green';
        }

        return (
            <div>
                <h1>Totals: {this.props.month}, {this.props.year}</h1>
                <div>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Income</th>
                            <th>Expenses</th>
                            <th>Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td align='left'>
                                {this.props.income_total}
                            </td>
                            <td align='left'>
                                {this.props.expense_total}
                            </td>
                            <td align='left' style={{ color: color }}>
                                { Math.round((this.props.income_total - this.props.expense_total) * 100) / 100 }
                            </td>
                        </tr>
                    </tbody>
                </table>

                <br/>

                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>
                                Categories
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderCategories(this.props.expense_categories, this.props.expense_total) }
                    </tbody>
                </table>
                </div>
            </div>
        )
    }
}

export default TotalsView;
