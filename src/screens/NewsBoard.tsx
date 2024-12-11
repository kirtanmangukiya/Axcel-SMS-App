import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  AppState,
} from 'react-native';
import NewsBoardComponent from '../components/news_board_component/NewsBoardComponent';
import TopBar from '../components/TopBar';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
  StackActions,
} from '@react-navigation/native';
import { MainStackParamList, NewsBoardResponse } from '../types';
import { NewsBoardData } from '../config/axios';
import NoDataFound from '../components/no_data_found/NoDataFound';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

type NewsBoardScreenResultRouteProp = RouteProp<MainStackParamList, 'NewsBoard'>;

type NewsBoardScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'NewsBoard'
>;

const NewsBoard: React.FC = () => {
  const navigation = useNavigation<NewsBoardScreenNavigationProp>();

  const [newsBoard, setNewsBoard] = useState<NewsBoardResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isSearchResult, setIsSearchResult] = useState<boolean>(false); // Track if data is from search

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const route = useRoute<NewsBoardScreenResultRouteProp>();
  const results = route.params?.results;

  const loadData = async (isPagination: boolean = false) => {
    if (loadingMore || !hasMore) return;

    if (isPagination) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setPage(1);
    }

    try {
      const data = await NewsBoardData(page);
      if (isPagination) {
        setNewsBoard(prevData => ({
          ...prevData,
          newsboard: [...(prevData?.newsboard || []), ...data.newsboard],
        }));
      } else {
        setNewsBoard(data);
        setIsSearchResult(false); // Reset to indicate the data is original, not from search
      }

      if (data.newsboard.length === 0) {
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const checkInternetAndLoadData = async () => {
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
    loadData();
  };

  useEffect(() => {
    if (results) {
      setIsSearchResult(true); // Set flag if data is from search
    } else {
      checkInternetAndLoadData();
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkInternetAndLoadData();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, results]);

  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: newsBoard?.newsboard || [],
      sourceScreen: 'NewsBoard',
    });
    navigation.dispatch(pushAction);
  }, [navigation, newsBoard]);

  const handleRefreshPress = useCallback(() => {
    setRefreshing(true);
    setHasMore(true); // Reset hasMore when refreshing
    loadData(); // Reload original data
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({ item }: { item: any }) => (
    <View>
      <NewsBoardComponent data={item} />
    </View>
  );

  const renderContent = () => {
    if (loading && !isSearchResult) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    if (isSearchResult) {
      return results && results.length > 0 ? (
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
      ) : (
        <NoDataFound noFoundTitle="No Data Found" />
      );
    } else {
      return newsBoard?.newsboard && newsBoard.newsboard.length > 0 ? (
        <FlatList
          data={newsBoard.newsboard}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
            />
          }
          onEndReached={() => loadData(true)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => loadingMore ? <ActivityIndicator size="large" color="#ffffff" /> : null}
        />
      ) : (
        <NoDataFound noFoundTitle="Data Not Found" />
      );
    }
  };

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="News Board"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={results ? null : handleMenuPress}
        />
        {renderContent()}
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
  contentContainer: {
    paddingVertical: 10,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsBoard;
