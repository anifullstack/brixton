import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import { DrawerItems } from 'react-navigation';

import modules from '../../../';

const styles = StyleSheet.create({
  container: {
    flex: 1
    // paddingTop: 20,
  }
});

const DrawerComponent = props => {
  const skippedItems = modules.getSkippedDrawerItems();
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={{ height: 150, backgroundColor: '#f7f7f9', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'red' }}>Montessori</Text>
        </View>
        <DrawerItems
          {...props}
          onItemPress={({ focused, route }) => {
            if (!skippedItems.includes(route.routeName)) {
              props.onItemPress({ focused, route });
            }
          }}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

DrawerComponent.propTypes = {
  onItemPress: PropTypes.func
};

export default DrawerComponent;
