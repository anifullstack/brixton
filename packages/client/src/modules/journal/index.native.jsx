import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import translate from '../../i18n';
import { Button, HeaderTitle, IconButton, primary } from '../common/components/native';

import Student from './containers/Student';
import StudentEdit from './containers/StudentEdit';
import StudentAdd from './containers/StudentAdd';
import resources from './locales';
import resolvers from './resolvers';

import Feature from '../connector';

const withI18N = (Component, props) => {
  const WithI18N = translate('student')(Component);
  return <WithI18N {...props} />;
};

const StudentListHeaderRight = ({ navigation, t }) => {
  return (
    <View style={styles.addButtonContainer}>
      <Button style={styles.addButton} size={'small'} type={'info'} onPress={() => navigation.navigate('StudentAdd')}>
        {t('list.btn.add')}
      </Button>
    </View>
  );
};
StudentListHeaderRight.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class StudentListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    
    headerTitle: withI18N(HeaderTitle, { style: 'subTitle', i18nKey: 'list.subTitle' }),
    headerRight: withI18N(StudentListHeaderRight, { navigation }),
    headerLeft: (
      <IconButton iconName="menu" iconSize={32} iconColor="#fff" onPress={() => navigation.openDrawer()} />
    ),
    headerStyle: { backgroundColor: '#64B5F6', marginTop: -15 }
  });

  render() {
    return <Student navigation={this.props.navigation} />;
  }
}

StudentListScreen.propTypes = {
  navigation: PropTypes.object
};


const StudentEditTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t(`student.label.edit`)} {t('student.label.student')}
  </Text>
);
StudentEditTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

const StudentAddTitle = ({ t }) => (
  <Text style={styles.subTitle}>
    {t('student.label.create')} {t('student.label.student')}
  </Text>
);
StudentAddTitle.propTypes = {
  navigation: PropTypes.object,
  t: PropTypes.func
};

class StudentEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({

    headerTitle: withI18N(StudentEditTitle, { navigation }),
    headerStyle: styles.header
  });

  render() {
    return <StudentEdit navigation={this.props.navigation} />;
  }
}

StudentEditScreen.propTypes = {
  navigation: PropTypes.object
};

class StudentAddScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: withI18N(StudentAddTitle, { navigation }),
    headerStyle: styles.header
  });

  render() {
    return <StudentAdd navigation={this.props.navigation} />;
  }
}

StudentAddScreen.propTypes = {
  navigation: PropTypes.object
};

const StudentNavigator = createStackNavigator({
  StudentList: { screen: StudentListScreen },
  StudentEdit: { screen: StudentEditScreen },
  StudentAdd: { screen: StudentAddScreen }
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff'
  },
  subTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
    fontWeight: Platform.OS === 'ios' ? '700' : '500',
    color: 'rgba(0, 0, 0, .9)',
    textAlign: Platform.OS === 'ios' ? 'center' : 'left',
    marginHorizontal: 16
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  addButton: {
    height: 32,
    width: 60
  }
});

export default new Feature({

  drawerItem: {
    Student: {
      screen: StudentNavigator,
      navigationOptions: {
  
        drawerLabel: withI18N(HeaderTitle, { i18nKey: 'list.title' })
      }
    }
  },
  resolver: resolvers,
  localization: { ns: 'student', resources }
});
