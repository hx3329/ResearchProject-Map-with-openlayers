import React from "react"
import MobileContainer from "./MobileContainer";
import DesktopContainer from "./Navbar";
import PropTypes from "prop-types";
import Footer from "../Footer/Footer";

class Layout extends React.Component{
  render(){
    return(
      <div>
        <DesktopContainer>{this.props.children}</DesktopContainer>
        <MobileContainer>{this.props.children}</MobileContainer>
        <Footer>{this.props.children}</Footer>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout;
