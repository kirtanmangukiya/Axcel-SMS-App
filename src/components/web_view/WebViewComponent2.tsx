import React from 'react';
import {StyleSheet, SafeAreaView, Image, Dimensions} from 'react-native';

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

  console.log('Image URL:', url); // Add logging to verify URL

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{uri: url}}
        style={styles.image}
        resizeMode="contain"
        defaultSource={require('../../assest/icons/SideBarBg.jpg')} // Fallback image
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
});

export default WebViewComponent2;
