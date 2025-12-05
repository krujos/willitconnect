import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

const HeaderBar = function header() {
  return (
    <Navbar inverse fixedTop fluid>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">willitconnect</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavItem className="link" eventKey={1} href="https://github.com/krujos/willitconnect">
            <span className="mega-octicon octicon-mark-github"> </span></NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderBar;
