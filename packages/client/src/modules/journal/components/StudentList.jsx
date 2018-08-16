/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, Platform, TouchableOpacity, View, FlatList } from 'react-native';
import translate from '../../../i18n';
import { SwipeAction, Loading } from '../../common/components/native';

class StudentList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    students: PropTypes.object,
    navigation: PropTypes.object,
    deleteStudent: PropTypes.func.isRequired,
   loadData: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  keyExtractor = item => `${item.node.id}`;

  renderItemIOS = ({
    item: {
      node: { id, firstName,lastName }
    }
  }) => {
    const { deleteStudent, navigation, t } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate('StudentEdit', { id })}
        right={{
          text: t('list.btn.del'),
          onPress: () => deleteStudent(id)
        }}
      >
        {firstName}
        {lastName}
      </SwipeAction>
    );
  };

  renderItemAndroid = ({
    item: {
      node: { id, firstName,lastName }
    }
  }) => {
    const { deleteStudent, navigation } = this.props;
    return (
      // <TouchableOpacity style={styles.studentWrapper} onPress={() => navigation.navigate('StudentEdit', { id })}>
      //   <Text style={styles.text}>{firstName}  {lastName}</Text>
      //   <TouchableOpacity style={styles.iconWrapper} onPress={() => deleteStudent(id)}>
      //     <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
      //   </TouchableOpacity>
      // </TouchableOpacity>
      <TouchableOpacity style={styles.studentWrapper} onPress={() => navigation.navigate('StudentJournal', { id })}>
        <Text style={styles.text}>{firstName} {lastName}</Text>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('StudentEdit', { id })}>
            <FontAwesome name="edit" size={20} style={{ color: '#3B5998' }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => deleteStudent(id)}>
            <FontAwesome name="trash" size={20} style={{ color: '#3B5998' }} />
          </TouchableOpacity>
      </TouchableOpacity>
      );
    };

  handleScrollEvent = () => {
    const {
      students: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;
    if (this.allowDataLoad) {
      if (this.props.students.pageInfo.hasNextPage) {
        this.allowDataLoad = false;
        return loadData(endCursor + 1, 'add');
      }
    }
  };

  render() {
    const { loading, students, t } = this.props;
    const renderItem = Platform.OS === 'android' ? this.renderItemAndroid : this.renderItemIOS;
    if (loading) {
      return <Loading text={t('student.loadMsg')} />;
    } else {
      this.allowDataLoad = true;
      return (
        <View style={styles.container}>
          <FlatList
            data={students.edges}
            ref={ref => (this.listRef = ref)}
            style={styles.list}
            keyExtractor={this.keyExtractor}
            renderItem={renderItem}
            onEndReachedThreshold={0.5}
            onEndReached={this.handleScrollEvent}
          />
        </View>
      );
    }
  }
}

export default translate('student')(StudentList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  text: {
    fontSize: 18,
    width: '60%'
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  studentWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#000',
    borderBottomWidth: 0.3,
    // borderTopWidth: 0.3,
    // borderTopColor: '#64B5F6',
    height: 50,
    paddingLeft: 7
  },
  list: {
    marginTop: 5
  }
});
