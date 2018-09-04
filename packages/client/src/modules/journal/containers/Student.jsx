import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import StudentList from '../components/StudentList';

import STUDENTS_QUERY from '../graphql/StudentsQuery.graphql';
import STUDENTS_SUBSCRIPTION from '../graphql/StudentsSubscription.graphql';
import DELETE_STUDENT from '../graphql/DeleteStudent.graphql';

import paginationConfig from '../../../../../../config/pagination';
import { PLATFORM } from '../../../../../common/utils';

const limit =
  PLATFORM === 'web' || PLATFORM === 'server' ? paginationConfig.web.itemsNumber : paginationConfig.mobile.itemsNumber;

export function AddStudent(prev, node) {
  // ignore if duplicate
  if (prev.students.edges.some(student => node.id === student.cursor)) {
    return prev;
  }

  const filteredStudents = prev.students.edges.filter(student => student.node.id !== null);

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'StudentEdges'
  };

  return update(prev, {
    students: {//moment,
      totalCount: {
        $set: prev.students.totalCount + 1
      },
      edges: {
        $set: [edge, ...filteredStudents]
      }
    }
  });
}

function DeleteStudent(prev, id) {
  const index = prev.students.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    students: {
      totalCount: {
        $set: prev.students.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]]
      }
    }
  });
}

class Student extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    students: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentDidUpdate(prevProps) {
    if (!this.props.loading) {
      const endCursor = this.props.students ? this.props.students.pageInfo.endCursor : 0;
      const prevEndCursor = prevProps.students ? prevProps.students.pageInfo.endCursor : null;
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && prevEndCursor !== endCursor) {
        this.subscription();
        this.subscription = null;
      }
      if (!this.subscription) {
        this.subscribeToStudentList(endCursor);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  subscribeToStudentList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: STUDENTS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              studentsUpdated: { mutation, node }
            }
          }
        }
      ) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddStudent(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteStudent(prev, node.id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <StudentList {...this.props} />;
  }
}

export default compose(
  graphql(STUDENTS_QUERY, {
    options: () => {
      return {
        variables: { limit: limit, after: 0 },
        fetchPolicy: 'cache-and-network'
      };
    },
    props: ({ data }) => {
      const { loading, error, students, fetchMore, subscribeToMore } = data;
      const loadData = (after, dataDelivery) => {
        return fetchMore({
          variables: {
            after: after
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.students.totalCount;
            const newEdges = fetchMoreResult.students.edges;
            const pageInfo = fetchMoreResult.students.pageInfo;
            const displayedEdges = dataDelivery === 'add' ? [...previousResult.students.edges, ...newEdges] : newEdges;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              students: {
                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: 'Students'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, students, subscribeToMore, loadData };
    }
  }),
  graphql(DELETE_STUDENT, {
    props: ({ mutate }) => ({
      deleteStudent: id => {
        mutate({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteStudent: {
              id: id,
              __typename: 'Student'
            }
          },
          updateQueries: {
            students: (
              prev,
              {
                mutationResult: {
                  data: { deleteStudent }
                }
              }
            ) => {
              return DeleteStudent(prev, deleteStudent.id);
            }
          }
        });
      }
    })
  })
)(Student);
