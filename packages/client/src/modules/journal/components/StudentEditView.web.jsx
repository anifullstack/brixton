import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayout } from '../../common/components/web';
import StudentForm from './StudentForm';
import StudentJournals from '../containers/StudentJournals';
import settings from '../../../../../../settings';

const onSubmit = (student, editStudent) => values => {
  editStudent(student.id, values.firstName, values.lastName, values.birthDate, values.content);
};

const StudentEditView = ({ loading, student, match, location, subscribeToMore, editStudent, t }) => {
  let studentObj = student;
  // if new student was just added read it from router
  if (!studentObj && location.state) {
    studentObj = location.state.student;
  }

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

  if (loading && !studentObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('student.loadMsg')}</div>
      </PageLayout>
    );
  } else {
    console.log(
      'StudentEditView||onSubmit||id+firstName,lastName,birtgDate+content' + student.id,
      student.firstName,
      student.lastName,
      student.birthDate,
      student.content
    );
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/students">
          {t('student.btn.back')}
        </Link>
        <h2>
          {t(`student.label.edit`)} {t('student.label.student')}
        </h2>
        <StudentForm onSubmit={onSubmit(studentObj, editStudent)} student={student} />
        <br />
		
        {studentObj && (
          <StudentJournals
            studentId={Number(match.params.id)}
            journals={studentObj.journals}
            subscribeToMore={subscribeToMore}
          />
        )}
      </PageLayout>
    );
  }
};

StudentEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  student: PropTypes.object,
  editStudent: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('student')(StudentEditView);
