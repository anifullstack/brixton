import React from 'react';
import { graphql } from 'react-apollo';

import StudentAddView from '../components/StudentAddView';
import { AddStudent } from './Student';

import ADD_STUDENT from '../graphql/AddStudent.graphql';

class StudentAdd extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  render() {
    return <StudentAddView {...this.props} />;
  }
}

export default graphql(ADD_STUDENT, {
  props: ({ ownProps: { history, navigation }, mutate }) => ({
    addStudent: async (firstName,lastName,birthDate, content) => {
      let studentData = await mutate({
        variables: { input: { firstName: firstName.trim(),lastName:lastName.trim(),birthDate:birthDate.trim(), content: content.trim() } },
        optimisticResponse: {
          __typename: 'Mutation',
          addStudent: {
            __typename: 'Student',
            id: null,
            firstName: firstName,
            lastName: lastName,
            birthDate:birthDate,
            content: content,
            journals: []
          }
        },
        updateQueries: {
          students: (
            prev,
            {
              mutationResult: {
                data: { addStudent }
              }
            }
          ) => {
            return AddStudent(prev, addStudent);
          }
        }
      });

      if (history) {
        return history.push('/student/' + studentData.data.addStudent.id, {
          student: studentData.data.addStudent
        });
      } else if (navigation) {
        return navigation.navigate('StudentEdit', { id: studentData.data.addStudent.id });
      }
    }
  })
})(StudentAdd);
