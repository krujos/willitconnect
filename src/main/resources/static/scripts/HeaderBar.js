import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';

class HeaderBar extends React.Component {

    render() {
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
                        <NavItem className="link" eventKey={1} href="https://github.com/krujos/willitconnect"><span className="mega-octicon octicon-mark-github"></span></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

module.exports = HeaderBar;
