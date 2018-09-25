import React, {Component} from 'react';

class Work extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputName:'',
      inputError:''
    };
    this.inputName=this.inputName.bind(this);
    this.handleNameChange=this.handleNameChange.bind(this);
  }

  handleNameChange(e){
    this.setState({inputName:e.target.value})
  }

  inputName(){
    //grap state
    const {
      inputName,
    } = this.state;

    //Post request to backend
    fetch('/api/data',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        Name: inputName
      }),

    }).then(res => res.json())
      .then(json => {
        if(json.success){
          this.setState({
            inputError: json.message,
            //input box empty
            // inputName:''
          });
        }else{
          this.setState({
            inputError: json.message,
          });
        }
      });
  }

  render() {
    const {inputError} = this.state;
    return (

      <div>
        {
          (inputError)?(
            <p>{inputError}</p>
          ):(null)
        }
        <h1>This is Work</h1>
        <input type="name" label="Name" value={this.state.inputName} onChange={this.handleNameChange}/>
        <button onClick={this.inputName}>Submit</button>
      </div>
    );
  }
}

export default Work;
