import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import Layout from "../Header/Layout";
import {BrowserRouter as Router, Route, Switch,Redirect} from "react-router-dom";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Group from "../Group/Group";
import Signin from "../Auth/Signin";
import Register from "../Auth/Register";
import NotFound from "./NotFound";
import Work from "../Pages/Work";
import MapPage from "../Pages/Map";

import fakeAuth from "../Auth/fakeAuth";



const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class App extends React.Component{
  render(){
    return(
      <Router>
        <Layout>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/login" component={Signin} />
                <Route path="/signup" component={Register}/>
                <Route path="/work" component={Work}/>
                <Route path="/map" component={MapPage}/>
                <PrivateRoute path="/group" component={Group}/>
                <Route component={NotFound}/>
            </Switch>
          </Layout>
      </Router>
    );
  }
}

export default App;
