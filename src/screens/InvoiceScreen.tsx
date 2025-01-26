import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { InvoiceData } from '../config/axios';
import { InvoiceItemResponce, MainStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
    results || []
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(!!results);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const [seenIds] = useState(() => new Set<string>());
  const FETCH_COOLDOWN = 300000;

  useEffect(() => {
    if (!isFiltered && !results && !invoiceData.length) {
      checkInternetAndFetchData(false);
    }

    // Adding check for AppState to prevent refetch on app backgrounding
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (!isFiltered && nextAppState === 'active') {
        const currentTime = Date.now();
        // Only fetch if more than 5 minutes have passed since last fetch
        if (currentTime - lastFetchTime > FETCH_COOLDOWN) {
          setLastFetchTime(currentTime);
          checkInternetAndFetchData(false);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isFiltered, results, lastFetchTime]);

  const checkInternetAndFetchData = useCallback(
    async (isPagination: boolean) => {
      if (isFiltered) return;

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

      loadData(isPagination);
    },
    [isFiltered],
  );

  const loadData = async (isPagination: boolean) => {
    if (loadingMore || (!hasMore && isPagination)) return;

    if (isPagination) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      seenIds.clear();
    }

    try {
      const currentPage = isPagination ? page + 1 : 1;
      const data = await InvoiceData(currentPage);
      const invoices = data.invoices || [];

      if (invoices.length === 0) {
        setHasMore(false);
        setLoadingMore(false);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const uniqueInvoices = invoices.filter(invoice => {
        const stringId = invoice.id.toString();
        if (seenIds.has(stringId)) {
          return false;
        }
        seenIds.add(stringId);
        return true;
      });

      if (uniqueInvoices.length === 0) {
        setHasMore(false);
      } else {
        setInvoiceData(prevData =>
          isPagination ? [...prevData, ...uniqueInvoices] : uniqueInvoices,
        );
        setPage(currentPage);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefreshPress = useCallback(() => {
    setRefreshing(true);
    navigation.setParams({ results: undefined });
    loadData(false);
  }, [loadData, navigation]);

  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: invoiceData || [],
      sourceScreen: 'InvoiceScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, invoiceData]);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: InvoiceItemResponce }) => (
      <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
        <InvoiceComponent
          data={item}
          onInvoiceChange={() => {
            setRefreshing(true);
            loadData();
          }}
        />
      </View>
    ),
    [loadData],
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
          keyExtractor={item => `invoice_${item.id}`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
            />
          }
          onEndReached={() => {
            if (!loadingMore && hasMore) {
              checkInternetAndFetchData(true);
            }
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
        />
        {loadingMore && (
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
    hasMore,
    handleRefreshPress,
    renderItem,
  ]);

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <TopBar
          title="Invoices"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
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
