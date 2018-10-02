import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
// import axios from 'axios';
import io from 'socket.io-client';

import DataTable from './DataTable';
import InputData from './InputData';


class Data extends Component {

  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);

    this.state = {
      datas: [],
      online:0
    }

    this.fetchDatas = this.fetchDatas.bind(this);
    this.handleDataAdded = this.handleDataAdded.bind(this);
    this.handleDataUpdated = this.handleDataUpdated.bind(this);
    this.handleDataDeleted = this.handleDataDeleted.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {

    this.fetchDatas();
    this.socket.on('visitor enters', data => this.setState({ online: data }));
    this.socket.on('visitor exits', data => this.setState({ online: data }));
    this.socket.on('add', data => this.handleDataAdded(data));
    this.socket.on('update', data => this.handleDataUpdated(data));
    this.socket.on('delete', data => this.handleDataDeleted(data));
  }

  // Fetch data from the back-end
  fetchDatas() {
    fetch(`${this.server}/api/datas/`)
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        this.setState({
          datas:json
        });
      })
      .catch((err) => {
        console.log(err);
      });


  }

  handleDataAdded(data) {
    let datas = this.state.datas.slice();
    datas.push(data);
    this.setState({ datas: datas });
  }

  handleDataUpdated(data) {
    let datas = this.state.datas.slice();
    for (let i = 0, n = datas.length; i < n; i++) {
      if (datas[i]._id === data._id) {
        datas[i].name = data.name;
        datas[i].email = data.email;
        datas[i].age = data.age;
        datas[i].gender = data.gender;
        datas[i].AircraftModel = data.AircraftModel;
        datas[i].EngineModel = data.EngineModel;
        break; // Stop this loop, we found it!
      }
    }
    this.setState({ datas: datas });
  }

  handleDataDeleted(data) {
    let datas = this.state.datas.slice();
    datas = datas.filter(u => { return u._id !== data._id; });
    this.setState({ datas: datas });
  }

  render() {
    let online = this.state.online;
    let verb = (online <= 1) ? 'is' : 'are'; // linking verb, if you'd prefer
    let noun = (online <= 1) ? 'person' : 'people';

    return (
      <div>
        <div className='App'>
        </div>
        <Container style={{padding:20}}>
          <InputData
            headerTitle='Add Data'
            buttonTriggerTitle='Add New'
            buttonSubmitTitle='Add'
            buttonColor='green'
            onDataAdded={this.handleDataAdded}
            server={this.server}
            socket={this.socket}
          />
          <em id='online'>{`${online} ${noun} ${verb} online.`}</em>
          <DataTable
            onDataUpdated={this.handleDataUpdated}
            onDataDeleted={this.handleDataDeleted}
            datas={this.state.datas}
            server={this.server}
            socket={this.socket}
          />
        </Container>
        <br/>
      </div>
    );
  }
}

export default Data;
