import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayout } from '../../common/components/web';
import StudentForm from './StudentForm';

import settings from '../../../../../../settings';

const onSubmit = addStudent => values => {
  addStudent(values.firstName, values.lastName, values.birthDate, values.content);
};

const StudentAddView = ({ addStudent, t }) => {
  const renderMetaData = () => (
    <Helmet
      firstName={`${settings.app.name} - ${t('student.firstName')}`}
      lastName={`${settings.app.name} - ${t('student.lastName')}`}
      birthDate={`${settings.app.name} - ${t('student.birthDate')}`}
      meta={[
        {
          name: 'description',
          content: t('student.meta')
        }
      ]}
    />
  );
  return (
    <PageLayout>
      {renderMetaData()}
      <Link id="back-button" to="/students">
        {t('student.btn.back')}
      </Link>
      <h2>
        {t(`student.label.create`)} {t('student.label.student')}
      </h2>
      <StudentForm onSubmit={onSubmit(addStudent)} />
      <br />
    </PageLayout>
  );
};

StudentAddView.propTypes = {
  addStudent: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('student')(StudentAddView);
