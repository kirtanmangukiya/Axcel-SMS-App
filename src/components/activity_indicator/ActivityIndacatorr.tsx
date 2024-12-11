import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const ActivityIndacatorr = () => {
  return (
    <>
      <LottieView
        source={require('../../assest/ActivityIndicator.json')}
        autoPlay
        loop={true}
        style={{
          width: 70,
          height: 70,
        }}
      />
    </>
  );
};

export default ActivityIndacatorr;

const styles = StyleSheet.create({});
