import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Text,
  AppState,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  StackActions,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {
  MainStackParamList,
  ParentApiRespoce,
  ParentProfileProps,
} from '../../types';
import {ParentData} from '../../config/axios';
import TopBar from '../../components/TopBar';
import ParentComponent from '../../components/parent_component/ParentComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import Pagination from 'react-native-pagination';

type ParentScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'ParentsScreen'
>;
type ParentResultRouteProp = RouteProp<MainStackParamList, 'ParentsScreen'>;

const {height: screenHeight} = Dimensions.get('window');

const ParentsScreen: React.FC = () => {
  const navigation = useNavigation<ParentScreenNavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<ParentApiRespoce | undefined>(undefined);
  const [appState, setAppState] = useState(AppState.currentState);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isShowingSearchResults, setIsShowingSearchResults] = useState<boolean>(false); // New state

  const results = useRoute<ParentResultRouteProp>().params?.results;

  const handleApprovalPress = React.useCallback(() => {
    console.log('Waiting Approval button pressed');
    navigation.navigate('showDataScreen');
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: data?.parents || [],
      sourceScreen: 'ParentsScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    setRefreshing(true);
    setIsShowingSearchResults(false); // Reset to show full data
    setCurrentPage(1);
    loadData(1);
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const loadData = async (page: number) => {
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

      const response = await ParentData(page);

      const itemsPerPage = response.itemsPerPage || 10; // Use API's itemsPerPage or default to 10

      if (page === 1) {
        setData(response);
      } else {
        setData(prevData => {
          if (!prevData) {
            return response;
          }

          return {
            ...prevData,
            parents: [...prevData.parents, ...response.parents],
            totalItems: response.totalItems,
            roles: response.roles,
          };
        });
      }

      const calculatedTotalPages = Math.ceil(response.totalItems / itemsPerPage);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setIsLoadingMore(true);
      setCurrentPage(nextPage);
      loadData(nextPage);
    } else if (currentPage >= totalPages) {
      console.log('Data end - No more data to load');
    }
  };

  useEffect(() => {
    loadData(1);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        loadData(1);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const renderItem = ({item}: {item: ParentProfileProps}) => (
    <View style={{marginVertical: 5, marginHorizontal: 1}}>
      <ParentComponent data={item} />
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  };

  const renderContent = () => {
    if (isShowingSearchResults && results) {
      // If showing search results
      if (results.length === 0) {
        return <NoDataFound noFoundTitle="No Data Found" />;
      } else {
        return (
          <FlatList
            data={results}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl
                colors={['#ffffff']}
                refreshing={refreshing}
                onRefresh={handleRefreshPress}
              />
            }
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
          />
        );
      }
    } else {
      // Show full data
      return loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      ) : data?.parents?.length === 0 ? (
        <NoDataFound noFoundTitle="Data Not Found" />
      ) : (
        <FlatList
          data={data?.parents}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              colors={['#ffffff']}
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
            />
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
        />
      );
    }
  };

  useEffect(() => {
    if (results) {
      setIsShowingSearchResults(true); // Set flag to indicate search results are being shown
    }
  }, [results]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Parents"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        />
        <View
          style={{
            marginHorizontal: '3%',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View style={styles.content}>{renderContent()}</View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
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
  flatListContainer: {
    paddingVertical: 20,
    marginHorizontal: 7,
  },
  container: {
    flex: 1,
  },
  separator: {
    height: 10,
  },
});

export default ParentsScreen;
