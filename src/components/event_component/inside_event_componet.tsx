import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {RootStackParamList} from '../../types';
import ActivityIndacatorr from '../activity_indicator/ActivityIndacatorr';
import TopBar from '../TopBar';
import EventComponent2 from './EventComponent2';

interface InsideEventProps {
  route: RouteProp<RootStackParamList, 'InsideEventComponent'>;
}

const InsideEventComponent: React.FC<InsideEventProps> = ({route}) => {
  const {data} = route.params;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [link, setLink] = useState('');

  // Extract URL from eventDescription
  const extractLink = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : '';
  };

  React.useEffect(() => {
    const extractedLink = extractLink(data.eventDescription);
    setLink(extractedLink);
  }, [data.eventDescription]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate an API call or any data refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleLinkPress = () => {
    setShowWebView(true);
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with the path to your background image
      style={styles.backgroundImage}>
      {/* <View style={{marginBottom: '3%'}}> */}
      <TopBar title="Events" />
      {/* </View> */}
      {showWebView ? (
        <WebView source={{uri: link}} style={styles.webView} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndacatorr />
            </View>
          )}
          <View style={styles.contentContainer}>
            <EventComponent2 data={data} />
            {link && (
              <TouchableOpacity onPress={handleLinkPress}>
                <Text style={styles.link}>{link}</Text>
              </TouchableOpacity>
            )}
            {/* Render other details */}
          </View>
        </ScrollView>
      )}
    </ImageBackground>
  );
};

export default InsideEventComponent;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    // padding: 16,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  link: {
    fontSize: 16,
    padding: 10,
    color: 'blue',
    textDecorationLine: 'underline',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  webView: {
    flex: 1,
  },
});
