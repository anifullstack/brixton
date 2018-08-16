import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Loading } from '../../common/components/native';

import translate from '../../../i18n';
import StudentForm from './StudentForm';
import StudentJournals from '../containers/StudentJournals';

const onSubmit = (student, editStudent) => values => {
  editStudent(student.id, values.firstName,values.lastName,values.birthDate, values.content);
};

const StudentEditView = ({ loading, student, navigation, subscribeToMore, editStudent, t }) => {
  let studentObj = student;
  // if new student was just added read it from router
  if (!studentObj && navigation.state) {
    studentObj = navigation.state.params.student;
  }

  if (loading && !studentObj) {
    return <Loading text={t('student.loadMsg')} />;
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <StudentForm onSubmit={onSubmit(studentObj, editStudent)} student={student} />
          {studentObj && (
            <StudentJournals
              studentId={navigation.state.params.id}
              journals={studentObj.journals}
              subscribeToMore={subscribeToMore}
            />
          )}
        </ScrollView>
      </View>
    );
  }
};

StudentEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  student: PropTypes.object,
  editStudent: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default translate('student')(StudentEditView);
