import React, { Component } from 'react';
import { scaleOrdinal } from 'd3-scale';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';

class Pie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentWillReceiveProps(newProps) {
    
        if (newProps.data) {
            var data = []
            Object.entries(newProps.data).forEach(entry => { data.push({name: entry[0], value: entry[1]})})
            this.setState({data: data})
        }
    }

    width = 300;
    height = 300;
    radius = Math.min(this.width, this.height) / 2;
    color = scaleOrdinal().range([
        '#98abc5',
        '#8a89a6',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00',
    ]);

    arc = d3Arc()
        .outerRadius(this.radius - 10)
        .innerRadius(this.radius - 70).padAngle(0.025);

    pie = d3Pie()
        .sort(null)
        .value(function(d) {
          return d.value;
        });
    
    renderData = () => {
        return this.pie(this.state.data).map(d => 
            {
                return (
                    <g className="arc" key={`a${d.data.name}`}>
                        <path d={this.arc(d)} fill={this.color(d.data.name)} />
                        <text style={{ whiteSpace: 'normal'}} transform={`translate(${this.arc.centroid(d)})`} dy=".35em">
                            {d.data.name}
                        </text>
                    </g>
                )
            }
          )
    }

    render() {
        return (
            <svg width={this.width} height={this.height}>
              <g transform={`translate(${this.width / 2}, ${this.height / 2})`}>
                { this.renderData() }
              </g>
            </svg>
          );
    }
}
export default Pie

