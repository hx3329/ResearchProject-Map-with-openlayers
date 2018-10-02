import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import InputData from './InputData';
import ConfirmDelete from './ConfirmDelete';

class DataTable extends Component {

  render() {

    let coords = this.props.users;
    console.log(coords);
    coords = coords.map((coord) =>
      <Table.Row key={coord._id}>
        <Table.Cell>{coord.name}</Table.Cell>
        <Table.Cell>{coord.email}</Table.Cell>
        <Table.Cell>{coord.age}</Table.Cell>
        <Table.Cell>{coord.gender}</Table.Cell>
        <Table.Cell>{coord.AircraftModel}</Table.Cell>
        <Table.Cell>{coord.EngineModel}</Table.Cell>
        <Table.Cell>
          <InputData
            headerTitle='Edit User'
            buttonTriggerTitle='Edit'
            buttonSubmitTitle='Save'
            buttonColor='blue'
            userID={coord._id}
            onUserUpdated={this.props.onUserUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
          <ConfirmDelete
            headerTitle='Delete User'
            buttonTriggerTitle='Delete'
            buttonColor='black'
            user={coord}
            onUserDeleted={this.props.onUserDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Make every new user appear on top of the list
    coords =  [...coords].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>AirSpaceClass</Table.HeaderCell>
            <Table.HeaderCell>From_City</Table.HeaderCell>
            <Table.HeaderCell>To_City</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>AircraftModel</Table.HeaderCell>
            <Table.HeaderCell>EngineModel</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {coords}
        </Table.Body>
      </Table>
    );
  }
}

export default DataTable;
