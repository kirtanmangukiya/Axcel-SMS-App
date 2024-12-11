import {
  ActivityIndicator,
  AppState,
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {
  DrawerActions,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {InvoiceItemResponce, MainStackParamList} from '../../types';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DueInvoiceData} from '../../config/axios';
import InvoiceComponent from '../../components/InvoiceComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import Toast from 'react-native-toast-message';
import TopBar from '../../components/TopBar';

type InvoiceScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'DueInvoice'
>;

const DueInvoice: React.FC = () => {
  const navigation = useNavigation<InvoiceScreenNavigationProp>();
  const route = useRoute();
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
      checkInternetAndFetchData();
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

  const loadData = async () => {
    setLoading(true); // Start loading indicator

    try {
      const tokenString = await AsyncStorage.getItem('loginData');
      if (!tokenString) {
        throw new Error('No token found');
      }
console.log('tokenStringtokenStringtokenString',tokenString);

      const loginData = JSON.parse(tokenString);

      const data = await DueInvoiceData(); // Directly call the API function
      // console.log('Data of invoice:', data);

      // Safeguard: Ensure data exists and has 'invoices2' field
      if (!data || !data.invoices2) {
        console.error(
          'Data or invoices2 field is missing in the response:',
          data,
        );
        return;
      }

      const invoices = data.invoices2 || [];

      const dueInvoices = invoices.filter(
        (invoice: {
          fullName: null;
          paymentStatus: number;
          dueDate: {split: (arg0: string) => [any, any, any]};
          invoicePyaments: {paymentStatus: number}[];
        }) => {
          // Current time in seconds
          const currentTime = Math.floor(Date.now() / 1000);
          const [month, day, year] = invoice.dueDate.split('/');

          // Create a Date object with the appropriate month (0-indexed)
          const dueDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
          );
          const dueDateTimestamp = Math.floor(dueDate.getTime() / 1000);
          // const paymentStatus = invoice.invoicePyaments?.[0]?.paymentStatus;
          return dueDateTimestamp < currentTime && invoice?.paymentStatus !== 1;
        },
      );
    
      setInvoiceData(invoices);
    } catch (error) {
      console.error('Error loading data:', error);
      Toast.show({
        type: 'error',
        text1: 'Data Load Error',
        text2: 'Failed to load data from the server.',
      });
    } finally {
      setLoading(false); // Stop loading indicator
      setRefreshing(false); // Stop refreshing indicator if using pull-to-refresh
    }
  };

  const handleRefreshPress = useCallback(() => {
    if (route.params) {
      route.params.results = undefined;
    }
    setRefreshing(true);
    setPage(1); // Reset the page to 1 when refreshing
    setHasMore(true); // Reset the hasMore flag when refreshing
    loadData(); // Load data regardless of the initial results
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: {item: InvoiceItemResponce}) => (
      <View style={{marginVertical: 10, marginHorizontal: 15}}>
        <InvoiceComponent data={item} />
      </View>
    ),
    [],
  );

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    if (invoiceData.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <NoDataFound noFoundTitle="No Data Found" />
        </View>
      );
    }

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
          windowSize={21}
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
    invoiceData,
    refreshing,
    loadingMore,
    handleRefreshPress,
    renderItem,
  ]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Due Invoices"
          onSearchPress={handleRefreshPress}
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

export default React.memo(DueInvoice);
