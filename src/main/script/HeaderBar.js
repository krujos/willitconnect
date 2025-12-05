import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const HeaderBar = function header() {
  return (
    <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">willitconnect</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link className="link" href="https://github.com/krujos/willitconnect">
              <span className="mega-octicon octicon-mark-github"> </span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderBar;
