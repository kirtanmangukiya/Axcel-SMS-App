import { useNavigation, DrawerActions } from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const HelloTesting2: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
        <Text>HelloTesting2</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HelloTesting2;

const styles = StyleSheet.create({});
