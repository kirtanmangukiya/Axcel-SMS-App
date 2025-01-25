import React, {useEffect, useState} from 'react';
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
import {RouteProp} from '@react-navigation/native';
import {MainStackParamList, RootStackParamList} from '../../types';
import ActivityIndacatorr from '../activity_indicator/ActivityIndacatorr';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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

const InsideNewsComponent: React.FC<InsideNewsProps> = ({route}) => {
  const {data} = route.params;
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
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    setHtmlContent(data.newsText);
    console.log('Updated HTML Content:', data.newsText);
  }, [data.newsText]);

  const handleDownload = (url: string) => {
    navigation.navigate('PdfShowComponent', {pdfUrl: url});
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };
  const renderHTML = (html: string) => {
    return (
      <RenderHtml
        contentWidth={screenWidth * 0.9}
        source={{html}}
        baseStyle={{color: 'black'}}
        renderers={{
          a: props => {
            const {href, children} = props;
            if (
              href &&
              (href.startsWith('http://') || href.startsWith('https://'))
            ) {
              return (
                <TouchableOpacity onPress={() => handleLinkPress(href)}>
                  <Text style={styles.link}>{children}</Text>
                </TouchableOpacity>
              );
            }
            return (
              <Text style={[styles.text, {color: 'black'}]}>{children}</Text>
            );
          },
        }}
      />
    );
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.backgroundImage}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.topBarContainer}>
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
            <Text style={styles.date}>{data?.newsDate}</Text>
          </View>
          <View style={styles.textContainer}>{renderHTML(htmlContent)}</View>
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
  topBarContainer: {
    marginBottom: screenHeight * 0.02,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: screenWidth * 0.04,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: 'white',
    padding: screenWidth * 0.04,
    borderRadius: 10,
    marginBottom: screenHeight * 0.02,
  },
  title: {
    fontSize: screenWidth * 0.055,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: screenHeight * 0.01,
  },
  date: {
    fontSize: screenWidth * 0.04,
    color: '#444444',
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: screenWidth * 0.04,
    borderRadius: 10,
  },
  text: {
    color: 'black',
    fontSize: screenWidth * 0.04,
    lineHeight: screenWidth * 0.06,
  },
  link: {
    color: '#0066CC',
    textDecorationLine: 'underline',
    fontSize: screenWidth * 0.04,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  downloadButtonsContainer: {
    marginTop: screenHeight * 0.02,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: screenWidth * 0.03,
    borderRadius: 8,
    marginTop: screenHeight * 0.01,
  },
  downloadButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: screenWidth * 0.04,
  },
});
