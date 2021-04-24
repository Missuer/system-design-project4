import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.png'
import { Nav, Button, Image } from 'react-bootstrap';
import { AuthContext } from '../auth/AuthContext'

const Header = (props) => {

  return (
    <AuthContext.Consumer>
      {(context) => (
        <Navbar style={{ backgroundColor: 'black' }} variant="dark" expand="sm" >
          <Navbar.Toggle aria-controls="left-sidebar" aria-expanded="false" aria-label="Toggle sidebar" onClick={props.showSidebar} />
          <Navbar.Brand><Image style={{ width: '50px' }} src={logo}></Image></Navbar.Brand>

          <Nav className="ml-md-auto">
            {context.authUser &&
              <>
                <Navbar.Brand>Welcome {context.authUser.username}!</Navbar.Brand>
                <Nav.Link onClick={(e) => {
                  e.preventDefault();
                  context.logoutUser();
                }}>Logout</Nav.Link>
              </>}
            {!context.authUser && <NavLink as={NavLink} className="mr-2" to="/login">
              <Button type="button" variant="outline-light">
                LOGIN
              </Button>
            </NavLink>}
            <NavLink className="mr-2" to="/">
              <Button type="button" variant="outline-light">
                Home
              </Button>
            </NavLink>
            <NavLink className="mr-2" to="/map">
              <Button type="button" variant="outline-light">
                MAP
              </Button>
            </NavLink>
          </Nav>
        </Navbar>
      )}
    </AuthContext.Consumer>

  );
}

export default Header;