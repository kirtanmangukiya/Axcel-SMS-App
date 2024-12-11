import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  AppState,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  StackActions,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {InvoiceData} from '../config/axios';
import {InvoiceItemResponce, MainStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import TopBar from '../components/TopBar';
import NoDataFound from '../components/no_data_found/NoDataFound';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import InvoiceComponent from '../components/InvoiceComponent';

type InvoiceScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'InvoiceScreen'
>;
type InvoiceScreenRouteProp = RouteProp<MainStackParamList, 'InvoiceScreen'>;

const InvoiceScreen: React.FC = () => {
  const navigation = useNavigation<InvoiceScreenNavigationProp>();
  const route = useRoute<InvoiceScreenRouteProp>();
  const results = route.params?.results;

  const [loading, setLoading] = useState<boolean>(!results);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceItemResponce[]>(
    results || [],
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    if (!results) {
      checkInternetAndFetchData(); // Only fetch data if results are undefined
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkInternetAndFetchData();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, results]);

  const checkInternetAndFetchData = async () => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Bad network connection',
      });
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (!results) {
      loadData();
    }
  };

  const loadData = async (isPagination: boolean = false) => {
    if (loadingMore || (!hasMore && isPagination)) return; // Prevent loading if already loading or no more data

    if (isPagination) {
      setLoadingMore(true);
      setPage(prevPage => prevPage + 1); // Increment the page before making the request
    } else {
      setLoading(true);
      setPage(1); // Reset page to 1 for fresh load
      setHasMore(true); // Reset hasMore flag
    }

    try {
      console.log('Fetching page:', page); // Debugging: Check which page is being requested

      const data = await InvoiceData(page); // Pass the updated page state
      const invoices = data.invoices || [];

      if (invoices.length === 0) {
        setHasMore(false); // No more data to load
      }

      // Filter out duplicates based on `id`
      const uniqueInvoices = invoices.filter(
        invoice => !invoiceData.some(existing => existing.id === invoice.id),
      );

      if (isPagination) {
        setInvoiceData(prevData => [...prevData, ...uniqueInvoices]); // Append new unique data
      } else {
        setInvoiceData(uniqueInvoices); // Load fresh data
      }

      console.log('Fetched invoices:', uniqueInvoices); // Debugging: Log the fetched data
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // This will handle invoice changes and trigger a refresh
  const onInvoiceChange = (newInvoiceData: InvoiceItemResponce[]) => {
    setInvoiceData(newInvoiceData);
    setRefreshing(true);
    loadData();
  };

  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: invoiceData || [],
      sourceScreen: 'InvoiceScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, invoiceData]);

  const handleRefreshPress = useCallback(() => {
    // Setting route.params.results to undefined
    if (route.params) {
      route.params.results = undefined;
    }
    setRefreshing(true);
    setPage(1); // Reset the page to 1 when refreshing
    setHasMore(true); // Reset the hasMore flag when refreshing
    loadData(); // Load data regardless of the initial results
  }, [route.params]);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: {item: InvoiceItemResponce}) => (
      <View style={{marginVertical: 10, marginHorizontal: 15}}>
        <InvoiceComponent data={item} onInvoiceChange={onInvoiceChange} />
      </View>
    ),
    [],
  );

  const renderContent = useMemo(() => {
    // If the loading state is true, show the loading indicator
    if (loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    // If the 'results' are available, show only the passed 'results' data
    if (results && results?.length > 0) {
      return (
        <>
          <FlatList
            data={results} // Use the 'results' directly from route params
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </>
      );
    }

    // If there are no results or invoice data, show the 'No Data Found' component
    if (invoiceData?.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <NoDataFound noFoundTitle="No Data Found" />
        </View>
      );
    }

    // Otherwise, show the invoiceData with refresh and load more functionality
    return (
      <>
        <FlatList
          data={invoiceData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              colors={['#ffffff']}
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
            />
          }
          onEndReached={() => loadData(true)}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          // windowSize={21}
          maxToRenderPerBatch={10}
        />
        {loadingMore && invoiceData.length > 0 && (
          <View style={styles.footer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </>
    );
  }, [
    loading,
    results,
    invoiceData,
    refreshing,
    loadingMore,
    handleRefreshPress,
    renderItem,
  ]);

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Invoices"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={!results ? handleMenuPress : null}
        />
        <View style={styles.content}>{renderContent}</View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
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
  container: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 10,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(InvoiceScreen);
