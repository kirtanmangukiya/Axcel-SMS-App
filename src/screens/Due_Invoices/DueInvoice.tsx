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
  useIsFocused,
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
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState<boolean>(!results);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceItemResponce[]>(
    results || [],
  );
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleInvoiceChange = useCallback(() => {
    handleRefreshPress();
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!results && initialLoad) {
      checkInternetAndFetchData();
      setInitialLoad(false);
    }
  }, [results, initialLoad]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.match(/inactive|background/) && 
        nextAppState === 'active' && 
        isFocused && 
        !results
      ) {
        NetInfo.fetch().then(state => {
          if (state.isConnected) {
            loadData();
          }
        });
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, isFocused, results]);

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

  const loadData = async (loadMore = false) => {
    if (!isFocused) return;
    
    if (!loadMore) {
      setLoading(true);
    }

    try {
      const tokenString = await AsyncStorage.getItem('loginData');
      if (!tokenString) {
        throw new Error('No token found');
      }

      const loginData = JSON.parse(tokenString);

      const data = await DueInvoiceData();

      if (!data || !data.invoices) {
        console.error(
          'Data or invoices field is missing in the response:',
          data,
        );
        return;
      }

      const invoices = data.invoices || [];
      setInvoiceData(invoices);
    } catch (error) {
      console.error('Error loading data:', error);
      Toast.show({
        type: 'error',
        text1: 'Data Load Error',
        text2: 'Failed to load data from the server.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefreshPress = useCallback(() => {
    if (route.params) {
      route.params.results = undefined;
    }
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadData();
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: {item: InvoiceItemResponce}) => (
      <View style={{marginVertical: 10, marginHorizontal: 15}}>
        <InvoiceComponent 
          data={item} 
          onInvoiceChange={handleInvoiceChange}
          key={item.id + Date.now()} // Add a unique key that changes when data updates
        />
      </View>
    ),
    [handleInvoiceChange],
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
          keyExtractor={item => `${item.id}-${Date.now()}`} // Update keyExtractor to ensure uniqueness
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
          extraData={invoiceData} // Add extraData prop to force re-render when data changes
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