import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import TopBar from '../components/TopBar';
import BooksLibraryComponent from './BooksLibraryComponent';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {LibraryBooksData} from '../config/axios';
import {
  bookSlibrarayItem,
  BooksLibraryApiResponce,
  MainStackParamList,
} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../components/no_data_found/NoDataFound';
type InvoiceScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'BooksLibraryScreen'
>;

type YearScreenResultRouteProp = RouteProp<
  MainStackParamList,
  'BooksLibraryScreen'
>;
const BooksLibraryScreen: React.FC = () => {
  const navigation = useNavigation<InvoiceScreenNavigationProp>();
  const route = useRoute<YearScreenResultRouteProp>();

  // Safely extract results from route.params if it exists
  const results = route.params?.results;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<BooksLibraryApiResponce>();
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for RefreshControl

  // console.log('-----------------------------------', data);fv

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    setRefreshing(true); // Start refreshing indicator
    loadData(); // Trigger data reload on refresh
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed', navigation.dispatch);
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({item}: {item: bookSlibrarayItem}) => (
    <View style={{marginVertical: 5}}>
      <BooksLibraryComponent data={item} />
    </View>
  );

  const loadData = async () => {
    setLoading(true); // Ensure loading state is set when loading data
    try {
      const newData = await LibraryBooksData();
      setData(newData);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false); // Stop loading indicator
      setRefreshing(false); // Stop refreshing indicator
    }
  };

  const handleSearchPress = React.useCallback(() => {
    console.log('Search icon pressed');
    navigation.navigate('SearchScreen', {
      students: data?.bookLibrary || [],
      sourceScreen: 'BooksLibraryScreen',
    }); // Navigate to SearchScreenPP
  }, [navigation, data]);

  useEffect(() => {
    loadData(); // Initial data load
  }, []);
  const renderContent = () => {
    if (results === undefined) {
      return loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      ) : data?.bookLibrary.length === 0 ? (
        <NoDataFound noFoundTitle="Data Not Found" />
      ) : (
        <FlatList
          data={data?.bookLibrary}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
            />
          }
        />
      );
    } else if (results.length === 0) {
      return <NoDataFound noFoundTitle="No Data Found" />;
    } else if (results.length > 0) {
      return (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
            />
          }
        />
      );
    }
  };

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Books"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        />
        {/* {loading ? (
          <View style={styles.loadingContainer}>
              <ActivityIndacatorr />
          </View>
        ) : (
          <FlatList
            data={data?.bookLibrary}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              // Integrate RefreshControl for pull-to-refresh
              <RefreshControl
                colors={['#ffffff']} // Customize refresh control colors if needed
                refreshing={refreshing}
                onRefresh={handleRefreshPress}
              />
            }
          />
        )} */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 5, // Reduced padding
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    bottom: 10,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BooksLibraryScreen;
