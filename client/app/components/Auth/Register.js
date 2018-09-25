import React from 'react'
import {Button, Form, Grid, Image, Segment} from 'semantic-ui-react'


import {
  getFromStorage,
  setInStorage
} from "../../utils/storage";

//style
const Style = {
  margin: '20px',
}

class SignUpPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      signUpFirstName:'',
      signUpLastName:'',
      signUpEmail:'',
      signUpPassword:'',
      signUpError:'',
      isLoading:true,
      token:'',
    };

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.onSignUp = this.onSignUp.bind(this);
  }

  componentDidMount(){
    const object = getFromStorage('the_main_app');
    if(object && object.token){
      const {token} = object;
      //verify token
      fetch('/api/account/verify?token='+token)
        .then(res => res.json())
        .then(json =>{
          if(json.success){
            this.setState({
              token,
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

  //onchage of firstName
  handleFirstNameChange(e){
    this.setState({signUpFirstName:e.target.value})
  }
  //onchage of lastName
  handleLastNameChange(e){
    this.setState({signUpLastName:e.target.value})
  }
  //onChange of email
  handleEmailChange(e){
    this.setState({signUpEmail:e.target.value})
  }
  //onchange of Password
  handlePasswordChange(e){
    this.setState({signUpPassword:e.target.value})
  }

  onSignUp(){
    //grap state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    this.setState({
      isLoading:true
    });

    //Post request to backend
    fetch('/api/account/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      }),

    }).then(res => res.json())
      .then(json => {
        if(json.success){
          this.setState({
            signUpError: json.message,
            isLoading:false,
            //input box empty
            signUpEmail:'',
            signUpPassword:'',
            signUpFirstName:'',
            signUpLastName:''
          });
        }else{
          this.setState({
            signUpError: json.message,
            isLoading: false
          });
        }
      });
  }


  render(){
    const {
      isLoading,
      token,
      signUpError,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;

    if (isLoading){
      return(<div><p>Loading.....</p></div>);
    }

    if (!token) {
      return(
        <div style={Style}>
          {
            (signUpError)?(
              <p>{signUpError}</p>
            ):(null)
          }
          <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column  style={{ maxWidth: 450 }}>
              <Image src='./logo2.jpg' size='small' verticalAlign='middle'/>
              <Form  size='large'>
                <Segment textAlign='left' stacked>
                  <Form.Field>
                    <Form.Input icon='user'
                                iconPosition='left'
                                label='Email address'
                                placeholder='Email address'
                                type='email'
                                value={signUpEmail}
                                onChange={this.handleEmailChange}
                    />
                    <Form.Input
                      fluid icon='lock'
                      iconPosition='left'
                      label='Password'
                      placeholder='Password'
                      type='password'
                      value={signUpPassword}
                      onChange={this.handlePasswordChange}
                    />
                  </Form.Field>
                  <Form.Group widths='equal'>
                    <Form.Input
                      type='name'
                      label='First name'
                      placeholder='First name'
                      value={signUpFirstName}
                      onChange={this.handleFirstNameChange}
                    />
                    <Form.Input
                      type='name'
                      label='Last name'
                      placeholder='Last name'
                      value={signUpLastName}
                      onChange={this.handleLastNameChange} />
                  </Form.Group>
                  <Form.Field>
                    <Form.Input label='Address' placeholder='Address' />
                    <Form.Input icon='mobile alternate' iconPosition='left' label='Phone' placeholder='Phone' />
                  </Form.Field>
                  <Form.Checkbox label='I agree to the Terms and Conditions' />
                  <Button onClick={this.onSignUp} primary>SignUp</Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      );
    }



    return(
      <div>
        <p>Account</p>
      </div>
    );
  }
}


export default SignUpPage;
