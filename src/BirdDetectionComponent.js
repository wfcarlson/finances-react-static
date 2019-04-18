import React, { Component } from 'react';
import Tappable from 'react-tappable/lib/Tappable';
require('create-react-class');

class BirdDetectionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file_name: "",
            image_preview: "",
            labels: [],
        }
    }

    submit = () => {
        if (this.state.file) {
            var data = {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "image/jpeg"
                },
                body: this.state.file
            };

            fetch('https://enixy5ou56.execute-api.us-east-1.amazonaws.com/production/upload_image', data)
                .then((response) => {
                    response.json().then((data) => this.setState({labels: data['Labels']}))
                })
                .catch((error) => { console.log(error)});
        }
    }

    updateFile = (event) => {
        this.setState({
            file_name: event.target.value,
            file: event.target.files[0],
            image_preview: URL.createObjectURL(event.target.files[0]),
            labels: []
        }, () => this.submit())
    }

    isItABird = () => {
        var bird = false;

        this.state.labels.forEach((label) => {
            console.log(label)
            if (label.Name === 'Bird') {
                bird = true;
            }
        })

        if (bird) {
            return "Yes it's a bird!"
        }
        else if (this.state.labels.length > 0){
            return "No but it might be a " + this.state.labels[0].Name
        }
        else {
            return ""
        }
    }

    render() {
        return (
            <div>
                <h1>Is it a bird?</h1>
                <label>Upload an image</label>
                <input type="file" value={this.state.file_name} onChange={this.updateFile}/>
                <br/>
                <p>{ this.isItABird() }</p>
                { 
                    this.state.image_preview ?
                    <img alt="bird?" src={ this.state.image_preview } style={{height: 'auto',width: 'auto', maxWidth: '400px'}}/>
                    :
                    null
                }
            </div>
        );
    }
}

export default BirdDetectionComponent;
