import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, SafeAreaView, Image, Dimensions} from 'react-native';

// Get device screen dimensions
const {width, height} = Dimensions.get('window');

interface WebViewComponentProps {
  route: {
    params: {
      url: string;
    };
  };
}

const WebViewComponent2: React.FC<WebViewComponentProps> = ({route}) => {
  const {url} = route.params;

  console.log(url);
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{uri: url}}
        style={styles.image} // Full size image style
        resizeMode="cover" // Ensures the image covers the screen
      />
    </SafeAreaView>
  );
};

export default WebViewComponent2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width, // Full width of the screen
    height: height, // Full height of the screen
  },
});
