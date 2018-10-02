import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
// import axios from 'axios';

const genderOptions = [
  { key: 'm', text: 'Male', value: 'm' },
  { key: 'f', text: 'Female', value: 'f' },
  { key: 'o', text: 'Do Not Disclose', value: 'o' }
]

class InputDataForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      age: '',
      gender: '',
      AircraftModel:'',
      EngineModel:'',
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
   // Fill in the form with the appropriate data if data id is provided
    if (this.props.dataID) {
      fetch(`${this.props.server}/api/datas/${this.props.dataID}`)
        .then(response => response.json())
            .then(json => {
          this.setState({
            name: json.name,
            email: json.email,
            age: (json.age === null) ? '' : json.age,
            gender: json.gender,
            AircraftModel: json.AircraftModel,
            EngineModel: json.EngineModel
          });
        })
        .catch((err) => {
          console.log(err);
        });

    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSelectChange(e, data) {
    this.setState({ gender: data.value });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    // Acknowledge that if the data id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.dataID ? 'put' : 'post';
    const params = this.props.dataID ? this.props.dataID : '';

    let resStatus =null;
    fetch(`${this.props.server}/api/datas/${params}`,{
      method: method,
      responseType: 'json',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        age: this.state.age,
        gender: this.state.gender,
        AircraftModel: this.state.AircraftModel,
        EngineModel: this.state.EngineModel
      }),
    })
      .then(response => {
        resStatus = response.status;
        return response.json();
      })
      .then(response => {
        if(resStatus===200){
          // console.log(response);
          this.setState({
            formClassName: 'success',
            formSuccessMessage: response.msg
          });

          if (!this.props.dataID) {
            this.setState({
              name: '',
              email: '',
              age: '',
              gender: '',
              AircraftModel:'',
              EngineModel:'',
            });
            this.props.onDataAdded(response.result);
            this.props.socket.emit('add', response.result);
          }
          else {
            this.props.onDataUpdated(response.result);
            this.props.socket.emit('update', response.result);
          }
        }else{
          this.setState({
            formClassName: 'warning',
            formErrorMessage: response.msg
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {

    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          label='Name'
          type='text'
          placeholder='Elon Musk'
          name='name'
          maxLength='40'
          required
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label='Email'
          type='email'
          placeholder='elonmusk@tesla.com'
          name='email'
          maxLength='40'
          required
          value={this.state.email}
          onChange={this.handleInputChange}
        />
        <Form.Group widths='equal'>
          <Form.Input
            label='Age'
            type='number'
            placeholder='18'
            min={5}
            max={130}
            name='age'
            value={this.state.age}
            onChange={this.handleInputChange}
          />
          <Form.Field
            control={Select}
            label='Gender'
            options={genderOptions}
            placeholder='Gender'
            value={this.state.gender}
            onChange={this.handleSelectChange}
          />
        </Form.Group>
        <Form.Input
          label='AircraftModel'
          type='text'
          placeholder='B717-200'
          name='AircraftModel'
          maxLength='40'
          required
          value={this.state.AircraftModel}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label='EngineModel'
          type='text'
          placeholder='CFM56-3B1'
          name='EngineModel'
          maxLength='40'
          required
          value={this.state.EngineModel}
          onChange={this.handleInputChange}
        />
        <Message
          success
          color='green'
          header='Nice one!'
          content={formSuccessMessage}
        />
        <Message
          warning
          color='yellow'
          header='Woah!'
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default InputDataForm;
