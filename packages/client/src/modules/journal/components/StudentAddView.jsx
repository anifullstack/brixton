import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';

import translate from '../../../i18n';
import StudentForm from './StudentForm';

const onSubmit = addStudent => values => {
  addStudent(values.firstName,values.lastName,values.birthDate, values.content);
};

const StudentAddView = ({ addStudent }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <StudentForm onSubmit={onSubmit(addStudent)} />
      </ScrollView>
    </View>
  );
};

StudentAddView.propTypes = {
  addStudent: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});

export default translate('student')(StudentAddView);
