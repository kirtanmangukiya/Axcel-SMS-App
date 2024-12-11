import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {WebView} from 'react-native-webview'; // Add WebView
import {MainStackParamList} from '../../types';

type PDFViewerProps = NativeStackScreenProps<
  MainStackParamList,
  'PdfShowComponent2'
>;

const PdfShowComponent2: React.FC<PDFViewerProps> = ({route}) => {
  // Get the pdfUrl from the route params
  const {pdfUrl} = route.params;

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.container}
      resizeMode="cover">
      <View style={styles.content}>
        {/* Render the WebView with the passed pdfUrl */}
        <WebView
          source={{uri: pdfUrl}}
          startInLoadingState={true}
          style={styles.webview}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default PdfShowComponent2;
