import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavItem } from 'reactstrap';

import modules from '../../../../../../modules';
import settings from '../../../../../../../../../settings';

const NavBar = () => (
  <Navbar className="navbar navbar-dark " style={{ height: '4.5rem' }}>
    <Container>
      <Nav>
        <NavLink to="/" className="navbar-brand">
          {settings.app.name}
        </NavLink>
        {modules.navItems}
      </Nav>

      <Nav className="form-inline my-2 my-lg-0">
        {modules.navItemsRight}
        {__DEV__ && (
          <NavItem>
            <a href="/graphiql">GraphiQL</a>
          </NavItem>
        )}
      </Nav>
    </Container>
  </Navbar>
);

export default NavBar;
