import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';

import { MenuItem } from '../../modules/common/components/web';

import Student from './containers/Student';
import StudentEdit from './containers/StudentEdit';
import StudentAdd from './containers/StudentAdd';

import resources from './locales';
import resolvers from './resolvers';
import Feature from '../connector';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/students" className="nav-link" activeClassName="active">
    {t('student:navLink')}
  </NavLink>
));

export default new Feature({
  route: [
    <Route exact path="/students" component={Student} />,
    <Route exact path="/student/new" component={StudentAdd} />,
    <Route path="/student/:id" component={StudentEdit} />
  ],
  navItem: (
    <MenuItem key="/students">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  resolver: resolvers,
  localization: { ns: 'student', resources }
});
