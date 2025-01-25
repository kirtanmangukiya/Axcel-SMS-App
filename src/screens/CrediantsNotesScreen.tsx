import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  AppState,
  RefreshControl,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import NoDataFound from '../components/no_data_found/NoDataFound';
import TopBar from '../components/TopBar';
import {creditNoteData} from '../config/axios'; // Adjust this to the correct data-fetching function
import {CreditNoteApiResponce, MainStackParamList} from '../types';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import CreditComponent from '../components/credit_component/credit_component';

type CredentialsNotesScreenRouteProp = RouteProp<
  MainStackParamList,
  'CredentialsNotesScreen'
>;

const CredentialsNotesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CredentialsNotesScreenRouteProp>();

  const [data, setData] = useState<CreditNoteApiResponce[]>([]);
  const [fullData, setFullData] = useState<CreditNoteApiResponce[]>([]); // Store full data
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [showFullData, setShowFullData] = useState<boolean>(false); // State to toggle between results and full data

  const results = route.params?.results;

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
      const fetchedData = await creditNoteData(); // Adjust this to your actual data-fetching method
      setFullData(fetchedData.invoices2 || []); // Store the full data
      if (!results) {
        setData(fetchedData.invoices2 || []); // Show full data if results is undefined
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefreshPress = useCallback(() => {
    setShowFullData(true); // Force display of fullData on refresh
    setRefreshing(true);
    setData(fullData); // Display full data after refresh
    loadData(); // Reload full data
  }, [fullData]);
  

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('SearchScreen', {
      students: fullData,
      sourceScreen: 'CredentialsNotesScreen',
      onSearchResult: (searchResults: CreditNoteApiResponce[]) => {
        setData(searchResults);
        setShowFullData(false); // Switch back to showing search results
      },
    });
  }, [navigation, fullData]);

  const handleFullView = useCallback(
    (fileName: string) => {
      // navigation.navigate('PdfShowComponent2', {
      //   pdfUrl:
      //     'https://sms.psleprimary.com/uploads/user_receipts/764_66a35647f3f4b.pdf',
      // });
      navigation.navigate('PdfShowComponent', {
        pdfUrl: '764_66a35647f3f4b.pdf',
        routeScreen: 'StudentProfileComponent',
      });
    },
    [navigation],
  );

  const renderItem = ({item}: {item: CreditNoteApiResponce}) => (
    <TouchableOpacity
      style={{marginVertical: 10, marginHorizontal: '4%'}}
      onPress={() => handleFullView(item.id.toString())}>
      <CreditComponent data={item} />
    </TouchableOpacity>
  );

  const renderContent = () => {
    const displayData = results || fullData;

    if (loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    return displayData.length === 0 ? (
      <NoDataFound
        noFoundTitle={results ? 'No Results Found' : 'Data Not Found'}
      />
    ) : (
      <FlatList
        data={displayData}
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
  };

  useEffect(() => {
    loadData();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState === 'background' && nextAppState === 'active') {
        // Only refresh if the app was in background and is now active
        const lastRefreshTime = Date.now();
        const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (lastRefreshTime - (global.lastRefreshTime || 0) > REFRESH_THRESHOLD) {
          loadData();
          global.lastRefreshTime = lastRefreshTime;
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Credit Notes"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={results ? null : handleMenuPress}
        />
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingVertical: 10,
    marginVertical: 20,
  },
});

export default CredentialsNotesScreen;