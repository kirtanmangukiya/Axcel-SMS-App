import React from 'react';
import { RouteProp } from '@react-navigation/native'; // For accessing route params
import { WebView } from 'react-native-webview';

interface RouteExternalUrlScreenProps {
  route: RouteProp<any, any>; // You can refine this type depending on your navigation structure
}

const RouteExternalUrlScreen: React.FC<RouteExternalUrlScreenProps> = ({ route }) => {
  // Extract the URL from the route params
  const { url } = route.params;

  return <WebView source={{ uri: url }} />;
};

export default RouteExternalUrlScreen;
