import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import TopBar from '../components/TopBar';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import NoDataFound from '../components/no_data_found/NoDataFound';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import NewsBoardComponent from '../components/news_board_component/NewsBoardComponent';
import ResourceAndGuide from '../components/resource_and_guide/ResourceAndGuideComponent';
const dummyData = {
  newsTitle: 'Exciting News Update',
  newsText:
    'This is a brief summary of the news content that will be displayed on the NewsBoardComponent. The full content will be available when the user clicks on the component.',
  newsDate: '2024-07-25',
  newsImage: 'https://example.com/news1.pdf',
  newsImage2: 'https://example.com/news2.pdf',
  newsImage3: 'https://example.com/news3.pdf',
  newsImage4: null,
  newsImage5: 'https://example.com/news5.pdf',
  newsImage6: null,
  newsImage7: 'https://example.com/news7.pdf',
  newsImage8: null,
  newsImage9: null,
  newsImage10: null,
};

const StudyMaterial: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  const handleSearchPress = React.useCallback(() => {
    console.log('Search icon pressed');
  }, []);

  const handleRefreshPress = React.useCallback(() => {
    console.log('Refresh icon pressed');
  }, []);

  const handleMenuPress = React.useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Study Material"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        />
        <View style={styles.content}>
          {loading ? (
            <ActivityIndacatorr />
          ) : data ? (
            <ResourceAndGuide data={dummyData} />
          ) : (
            // Add your specific data rendering here
            <NoDataFound noFoundTitle="No Data Found " />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' as per your preference
  },
  container: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)'', // Optional: Add opacity to overlay
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudyMaterial;
