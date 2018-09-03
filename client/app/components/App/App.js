import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Layout from "../Header/Layout";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Group from "../Group/Group";
import Signin from "../Auth/Signin";
import Register from "../Auth/Register";
import NotFound from "./NotFound";


class App extends React.Component{
  render(){
    return(
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
            <Route path="/group" component={Group}/>
            <Route path="/login" component={Signin}/>
            <Route path="/signup" component={Register}/>
            <Route component={NotFound}/>
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
