import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
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

const InsideNewsComponent2: React.FC<InsideNewsProps> = ({ route }) => {
  const { data } = route.params;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>(data.newsText);

  const navigation = useNavigation<NewsBoardScreenNavigationProp>();

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

  const handleDownload = (url: string) => {
    navigation.navigate('PdfShowComponent', { pdfUrl: url });
  };

  useEffect(() => {
    // Update the HTML content and log it to the console
    setHtmlContent(data.newsText);
    console.log('Updated HTML Content:', data.newsText);
  }, [data.newsText]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with the path to your background image
      style={styles.backgroundImage}>
      <TopBar title='News Board' />
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
          <View style={styles.header}>
            <Text style={styles.title}>{data.title}</Text>
          </View>
          <RenderHtml
            contentWidth={screenWidth}
            source={{ html: htmlContent }}
          />
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

export default InsideNewsComponent2;

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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
