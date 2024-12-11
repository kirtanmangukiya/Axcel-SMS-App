import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  Dimensions,
} from 'react-native';
import TopBar from '../components/TopBar';
import {
  useNavigation,
  DrawerActions,
  StackActions,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import StudentProfileComponent from '../components/StudentProfileComponent';
import {StudentsData} from '../config/axios';
import {MainStackParamList, StudentApiRespoce} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../components/no_data_found/NoDataFound';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height: screenHeight} = Dimensions.get('window');

type StudentScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'StudentScreen'
>;
type StudentResultRouteProp = RouteProp<MainStackParamList, 'StudentScreen'>;

const StudentScreen: React.FC = () => {
  const route = useRoute<StudentResultRouteProp>();
  const navigation = useNavigation<StudentScreenNavigationProp>();
  const searchResults = route.params?.results;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<StudentApiRespoce | undefined>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  console.log(data?.userRole);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenString = await AsyncStorage.getItem('loginData');
        if (tokenString !== null) {
          const parsedToken = JSON.parse(tokenString); // Parse the string to an object
          setToken(parsedToken); // Set the parsed object in the state
        }
      } catch (error) {
        console.error('Error retrieving token', error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      console.log('---------------', token.user.role); // Access token.user.role safely
    }
  }, [token]); // Run this effect whenever token changes
  // Only runs once on mount

  // const handleSearchPress = useCallback(() => {
  //   const pushAction = StackActions.push('SearchScreen', {
  //     sourceScreen: 'StudentScreen',
  //   });
  //   navigation.dispatch(pushAction);
  // }, [navigation]);
  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: data?.students || [],
      sourceScreen: 'StudentScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setShowSearchResults(false); // Reset to show full data on refresh
    loadData(1); // Reload the first page
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  useEffect(() => {
    loadData(page); // Load initial data
  }, []);

  useEffect(() => {
    if (searchResults) {
      setShowSearchResults(true); // Show search results if available
    }
  }, [searchResults]);

  const loadData = async (pageNumber: number) => {
    if (loadingMore || !hasMore) return; // Prevent multiple fetches or if no more data

    setLoadingMore(pageNumber > 1); // Show loadingMore only for subsequent pages
    setLoading(pageNumber === 1); // Show loader only for the first page

    try {
      const response = await StudentsData(pageNumber); // Fetch data from API
      if (response?.students?.length) {
        setData(prevData => ({
          ...prevData,
          students: [...(prevData?.students || []), ...response.students],
        }));
        setPage(pageNumber + 1); // Increment page number for the next fetch
        setHasMore(true); // Continue fetching if data is still available
      } else {
        setHasMore(false); // No more data available
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false); // Reset refreshing state here
    }
  };

  const renderContent = () => {
    if (loading && page === 1) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    const studentsToShow = showSearchResults ? searchResults : data?.students;

    if (!studentsToShow || studentsToShow.length === 0) {
      return <NoDataFound noFoundTitle="No Data Found" />;
    }

    return (
      <FlatList
        data={studentsToShow}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <StudentProfileComponent
            studentRollId={item.studentRollId}
            name={item.name}
            username={item.fullName}
            email={item.email}
            profileImageUri={item.profileImageUri}
            docs={item.docs}
            userRole={token?.user?.role}
            id={item.id}
          />
        )}
        contentContainerStyle={styles.flatListContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            colors={['#ffffff']}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerContainer}>
              <ActivityIndacatorr />
            </View>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    );
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadData(page); // Fetch the next page
    }
  };

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Students"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefresh}
          onMenuPress={handleMenuPress}
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
    bottom: 10,
  },
  flatListContainer: {
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 10,
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // Adjust padding as needed
  },
});

export default StudentScreen;
