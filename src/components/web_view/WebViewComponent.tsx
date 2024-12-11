import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, SafeAreaView, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {MainStackParamList} from '../../types';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import TopBar from '../TopBar';
import StripeTopBar from '../top_bar/StripeTopBar';

interface WebViewComponentProps {
  route: {
    params: {
      url: string;
    };
  };
}

const WebViewComponent: React.FC<WebViewComponentProps> = ({route}) => {
  const {url} = route.params;
  const navigation = useNavigation();

  const handleNavigationStateChange = (navState: any) => {
    if (navState.url !== url) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="Axcel SMS" />
      <WebView
        source={{uri: url}}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
};

export default WebViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  webview: {
    flex: 1,
  },
});
