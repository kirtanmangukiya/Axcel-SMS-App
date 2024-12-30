import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useEffect} from 'react';

const LogoutScreen: React.FC = () => {
  useEffect(() => {
    Alert.alert('Success', 'User logout successfully');
  }, []);

  return (
    <View>
      <Text>LogoutScreen</Text>
    </View>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({});
