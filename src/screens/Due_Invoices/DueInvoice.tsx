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
  useIsFocused,
  CommonActions,
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
const FETCH_COOLDOWN = 300000;

const DueInvoice: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceItemResponce[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());

  const handleInvoiceChange = useCallback(() => {
    handleRefreshPress();
    loadData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    checkInternetAndFetchData(false);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        const currentTime = Date.now();
        if (currentTime - lastFetchTime > FETCH_COOLDOWN) {
          setLastFetchTime(currentTime);
          checkInternetAndFetchData(false);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [lastFetchTime]);

  const checkInternetAndFetchData = async (loadMore = false) => {
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

    loadData(loadMore);
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
    const currentTime = Date.now();
    if (currentTime - lastFetchTime > FETCH_COOLDOWN) {
      setRefreshing(true);
      setLastFetchTime(currentTime);
      checkInternetAndFetchData(false);
    }
  }, [lastFetchTime]);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('SearchScreen', {
      students: invoiceData || [],
      sourceScreen: 'DueInvoice',
    });
  }, [navigation, invoiceData]);

  const renderItem = useCallback(
    ({item}: {item: InvoiceItemResponce}) => (
      <View style={{marginVertical: 10, marginHorizontal: 15}}>
        <InvoiceComponent 
          data={item} 
          onInvoiceChange={handleInvoiceChange}
          key={item.id + Date.now()}
          screenName="DueInvoice"
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
      <FlatList
        data={invoiceData}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}-${Date.now()}`}
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
        extraData={invoiceData}
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

export default React.memo(DueInvoice);