import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const InsideHomework = () => {
  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <Text>InsideHomework</Text>
    </ImageBackground>
  );
};

export default InsideHomework;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
});
