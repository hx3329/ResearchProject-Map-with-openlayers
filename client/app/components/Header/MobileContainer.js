import {Component} from "react";
import {Button, Container, Icon, Menu, Responsive, Segment, Sidebar} from "semantic-ui-react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

class MobileContainer extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.handlePusherClick=this.handlePusherClick.bind(this);
    this.handleToggle=this.handleToggle.bind(this);
  }

  handlePusherClick(){
    const { sidebarOpened } = this.state

    if (sidebarOpened) this.setState({ sidebarOpened: false })
  }

  handleToggle(){
    this.setState({ sidebarOpened: !this.state.sidebarOpened })
  }

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='uncover' inverted vertical visible={sidebarOpened}>
            <Menu.Item as='a' active>
              Home
            </Menu.Item>
            <Menu.Item as={Link} to='/map'>Map</Menu.Item>
            <Menu.Item as={Link} to='/about'>About</Menu.Item>
            <Menu.Item as={Link} to='/group'>Group</Menu.Item>
            <Menu.Item as={Link} to='/login'>Log in</Menu.Item>
            <Menu.Item as={Link} to='/signup'>Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            // style={{ minHeight: '100vh' }}
          >
            <Segment
              inverted
              textAlign='center'
              // style={{ minHeight: 350, padding: '1em 0em' }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                  <Menu.Item position='right'>
                    <Button as='a' inverted>
                      Log in
                    </Button>
                    <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
            </Segment>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

export default MobileContainer;
