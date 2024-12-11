import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  AppState,
  Dimensions,
} from 'react-native';
import TopBar from '../components/TopBar';
import BooksLibraryComponent from './BooksLibraryComponent';
import {useNavigation, DrawerActions, StackActions, useRoute} from '@react-navigation/native';
import {LibraryBooksData} from '../config/axios';
import {bookSlibrarayItem, BooksLibraryApiResponce, MainStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../components/no_data_found/NoDataFound';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import Pdf from 'react-native-pdf';

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

  const results = route.params?.results;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<BooksLibraryApiResponce | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null); // Track the currently viewing PDF URL

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    setRefreshing(true);
    loadData(); // Always fetch full data on refresh
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    console.log('Search icon pressed');
    const pushAction = StackActions.push('SearchScreen', {
      students: data?.bookLibrary || [],
      sourceScreen: 'BooksLibraryScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const loadData = async () => {
    setLoading(true);
    try {
      const netInfoState = await NetInfo.fetch();
      if (!netInfoState.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'No internet connection available.',
        });
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const newData = await LibraryBooksData();
      setData(newData);
      console.log('BooksLibraryScreen API response:', newData);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({item}: {item: bookSlibrarayItem}) => (
    <View style={{marginVertical: 5}}>
      <BooksLibraryComponent data={item} />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    } else if (!data?.bookLibrary.length) {
      return <NoDataFound noFoundTitle="Data Not Found" />;
    } else {
      return (
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
    }
  };

  useEffect(() => {
    if (results) {
      // If results are passed, use them initially
      setData({bookLibrary: results});
      setLoading(false);
    } else {
      loadData(); // Otherwise, fetch full data from the API
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        loadData();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Books Library"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={results ? null : handleMenuPress}
        />
        <View style={styles.content}>
          {viewingPdf ? (
            <Pdf
              source={{uri: viewingPdf}}
              trustAllCerts={false}
              onLoadComplete={(numberOfPages, filePath) =>
                console.log(`Number of pages: ${numberOfPages}`)
              }
              onError={error => {
                console.log('PDF Load Error:', error);
                Alert.alert('Error', 'Failed to load PDF');
                setViewingPdf(null);
              }}
              style={styles.pdf}
            />
          ) : (
            renderContent()
          )}
        </View>
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
    paddingVertical: 5,
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
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default BooksLibraryScreen;
