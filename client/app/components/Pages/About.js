import React, {Component} from 'react';
import {getFromStorage} from "../../utils/storage";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:true,
      token:'',
    };

    this.logout = this.logout.bind(this);
  }

  logout(){
    this.setState({
      isLoading:true
    });

    const object = getFromStorage('the_main_app');
    if(object && object.token){
      const {token} = object;
      //verify token
      fetch('/api/account/logout?token='+token)
        .then(res => res.json())
        .then(json =>{
          if(json.success){
            window.localStorage.removeItem("the_main_app");
            this.setState({
              //clear token
              token:'',
              isLoading: false
            });
          }else{
            this.setState({
              isLoading:false,
            });
          }
        });
    }else{
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    return (
      <div>
        <h1>this is Account</h1>
        <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}

export default About;
