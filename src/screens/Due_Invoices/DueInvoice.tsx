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
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {InvoiceItemResponce, MainStackParamList} from '../../types';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';

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
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const appStateRef = useRef(AppState.currentState);
  const hasDataLoaded = useRef(false);

  const loadData = async (isRefresh = false) => {
    if (!isRefresh && hasDataLoaded.current) return;
    
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

    if (!isRefresh && results) return;

    try {
      const tokenString = await AsyncStorage.getItem('loginData');
      if (!tokenString) {
        throw new Error('No token found');
      }

      setLoading(true);
      const data = await DueInvoiceData();

      if (!data || !data.invoices) {
        console.error('Data or invoices field is missing in the response:', data);
        return;
      }

      setInvoiceData(data.invoices);
      hasDataLoaded.current = true;
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
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!results && !hasDataLoaded.current) {
      loadData();
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        !hasDataLoaded.current
      ) {
        loadData();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [results]);

  const handleRefreshPress = useCallback(() => {
    if (route.params) {
      route.params.results = undefined;
    }
    setRefreshing(true);
    hasDataLoaded.current = false;
    loadData(true);
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = useCallback(
    ({item}: {item: InvoiceItemResponce}) => (
      <View style={{marginVertical: 10, marginHorizontal: 15}}>
        <InvoiceComponent data={item} onInvoiceChange={handleRefreshPress} />
      </View>
    ),
    [handleRefreshPress],
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
        initialNumToRender={10}
        windowSize={21}
        maxToRenderPerBatch={10}
      />
    );
  }, [loading, invoiceData, refreshing, handleRefreshPress, renderItem]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Due Invoices"
          onSearchPress={handleRefreshPress}
          onMenuPress={!results ? handleMenuPress : undefined}
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
});

export default React.memo(DueInvoice);