import React, { Component } from 'react';


class TotalsView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expense_categories: {
                "rent": 0,
                "utilities": 0,
                "parking": 0,
                "uber": 0,
                "car insurance": 0,
                "car payment": 0,
                "car maintenance": 0,
                "gas": 0,
                "food and alcohol out": 0,
                "groceries": 0,
                "subscriptions": 0,
                "health care": 0,
                "clothing": 0,
                "haircuts": 0,
                "gym memberships": 0,
                "entertainment": 0,
                "discretionary": 0,
                "other": 0,
            },
            income_categories: {
                "other": 0
            },
        }
    }


    expense_budget_categories = {
        "rent": 1443.50,
        "utilities": 150,
        "parking": 20,
        "uber": 40,
        "car insurance": 150,
        "car payment": 285,
        "car maintenance": 100,
        "gas": 65,
        "food and alcohol out": 400,
        "groceries": 300,
        "subscriptions": 16.48,
        "health care": 100,
        "clothing": 100,
        "haircuts": 30,
        "gym memberships": 231,
        "entertainment": 200,
        "discretionary": 250,
        "other": 0
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
