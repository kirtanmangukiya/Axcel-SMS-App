import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList, RootStackParamList } from '../../types';
import ActivityIndacatorr from '../activity_indicator/ActivityIndacatorr';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TopBar from '../TopBar';
import RenderHtml from 'react-native-render-html';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface InsideNewsProps {
  route: RouteProp<RootStackParamList, 'InsideNewsComponent'>;
}
type NewsBoardScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'InsideNewsComponent'
>;

const InsideNewsComponent: React.FC<InsideNewsProps> = ({ route }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NewsBoardScreenNavigationProp>();
  const [htmlContent, setHtmlContent] = useState<string>(data?.newsText || '');

  const pdfUrls = [
    data?.newsImage,
    data?.newsImage2,
    data?.newsImage3,
    data?.newsImage4,
    data?.newsImage5,
    data?.newsImage6,
    data?.newsImage7,
    data?.newsImage8,
    data?.newsImage9,
    data?.newsImage10,
  ].filter(url => url && url.endsWith('.pdf'));

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate an API call or any data refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    // Update the HTML content and log it to the console
    setHtmlContent(data.newsText);
    console.log('Updated HTML Content:', data.newsText);
  }, [data.newsText]);

  const handleDownload = (url: string) => {
    navigation.navigate('PdfShowComponent', { pdfUrl: url });
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const renderHTML = (html: string) => {
    return (
      <RenderHtml
        contentWidth={screenWidth}
        source={{ html }}
        renderers={{
          a: (props) => {
            const { href, children } = props;
            // Check if the href starts with http or https
            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
              return (
                <TouchableOpacity onPress={() => handleLinkPress(href)}>
                  <Text style={styles.link}>{children}</Text>
                </TouchableOpacity>
              );
            }
            // If href is not a valid link, render it as plain text
            return <Text>{children}</Text>;
          },
        }}
      />
    );
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with the path to your background image
      style={styles.backgroundImage}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{ marginBottom: '5%' }}>
          <TopBar title="News Board" />
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndacatorr />
          </View>
        )}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{data.newsTitle}</Text>
            <Text style={{ color: 'black' }}>{data?.newsDate}</Text>
          </View>
          <View style={styles.textContainer}>
            {renderHTML(htmlContent)}
          </View>
          {pdfUrls.length > 0 && (
            <View style={styles.downloadButtonsContainer}>
              {pdfUrls.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.downloadButton}
                  onPress={() => handleDownload(url)}>
                  <Icon name="download-outline" size={24} color="white" />
                  <Text style={styles.downloadButtonText}>
                    Download {index + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default InsideNewsComponent;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    padding: '5%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '5%',
    borderRadius: 10,
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  downloadButtonsContainer: {
    marginTop: 20,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  downloadButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
