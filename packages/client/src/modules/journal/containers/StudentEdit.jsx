import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';

import StudentEditView from '../components/StudentEditView';
import STUDENT_QUERY from '../graphql/StudentQuery.graphql';

import EDIT_STUDENT from '../graphql/EditStudent.graphql';
import STUDENT_SUBSCRIPTION from '../graphql/StudentSubscription.graphql';

class StudentEdit extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    student: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired,
    history: PropTypes.object,
    navigation: PropTypes.object
  };

  constructor(props) {
    super(props);
    console.log("Container|StudentEdit|constructor|props" + JSON.stringify(props));
    this.subscription = null;
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.initStudentEditSubscription();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      let prevStudentId = prevProps.student ? prevProps.student.id : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevStudentId !== this.props.student.id) {
        this.subscription();
        this.subscription = null;
      }
      this.initStudentEditSubscription();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  initStudentEditSubscription() {
    if (!this.subscription && this.props.student) {
      this.subscribeToStudentEdit(this.props.student.id);
    }
  }

  subscribeToStudentEdit = studentId => {
    const { subscribeToMore, history, navigation } = this.props;

    this.subscription = subscribeToMore({
      document: STUDENT_SUBSCRIPTION,
      variables: { id: studentId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              studentUpdated: { mutation }
            }
          }
        }
      ) => {
        if (mutation === 'DELETED') {
          if (history) {
            return history.push('/students');
          } else if (navigation) {
            return navigation.goBack();
          }
        }
        return prev;
      }
    });
  };

  render() {
    console.log('StudentEdit||Render||Props|| ' + JSON.stringify(this.props));
    return <StudentEditView {...this.props} />;
  }
}

export default compose(
  graphql(STUDENT_QUERY, {
    options: props => {
      console.log("Container|StudentEdit|compose|student-query|props|" + JSON.stringify(props))
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, error, student, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, student, subscribeToMore };
    }
  }),
  graphql(EDIT_STUDENT, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editStudent: async (id, firstName, lastName, birthDate, content) => {
        await mutate({
          variables: {
            input: {
              id,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              birthDate: birthDate.trim(),
              content: content.trim()
            }
          }
        });
        if (history) {
          return history.push('/students');
        }
        if (navigation) {
          return navigation.navigate('StudentList');
        }
      }
    })
  })
)(StudentEdit);
