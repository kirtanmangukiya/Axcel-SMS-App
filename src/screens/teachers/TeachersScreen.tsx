import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  Text,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  AppState,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
  StackActions,
} from '@react-navigation/native';
import {
  MainStackParamList,
  TeacherApiRespoce,
  TeacherProfileProps,
} from '../../types';
import {TeacherData} from '../../config/axios';
import TopBar from '../../components/TopBar';
import TeacherComponent from '../../components/teacher_component/TeacherComponent';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

type teacherScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'TeachersScreen'
>;

type teacherResultRouteProp = RouteProp<MainStackParamList, 'TeachersScreen'>;

const {height: screenHeight} = Dimensions.get('window');

const TeachersScreen: React.FC = () => {
  const navigation = useNavigation<teacherScreenNavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<TeacherApiRespoce | undefined>(undefined);
  const route = useRoute<teacherResultRouteProp>();
  const [appState, setAppState] = useState(AppState.currentState);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [results, setResults] = useState(route.params?.results || undefined);

  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: data?.teachers || [],
      sourceScreen: 'TeachersScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    setRefreshing(true);
    setCurrentPage(1);
    setResults(undefined);
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

      const response = await TeacherData(page);
      const itemsPerPage = 10;

      if (page === 1) {
        // Access the data array inside teachers object
        setData({
          ...response,
          teachers: response.teachers.data || [],
        });
      } else if (response && response.teachers.data) {
        setData(prevData => {
          if (!prevData || !prevData.teachers) {
            return {
              ...response,
              teachers: response.teachers.data || [],
            };
          }

          const newTeachers = response.teachers.data.filter(
            newTeacher =>
              !prevData.teachers.some(
                existingTeacher => existingTeacher.id === newTeacher.id,
              ),
          );

          return {
            ...prevData,
            teachers: [...prevData.teachers, ...newTeachers],
            totalItems: response.totalItems,
          };
        });
      }

      if (response && response.teachers.total) {
        const calculatedTotalPages = Math.ceil(
          response.teachers.total / itemsPerPage,
        );
        setTotalPages(calculatedTotalPages);
      }
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

  const renderItem = ({item}: {item: TeacherProfileProps}) => (
    <View style={{marginVertical: 5, marginHorizontal: 1}}>
      <TeacherComponent data={item} userRole={data?.userRole} />
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
    if (results === undefined) {
      return loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      ) : !data?.teachers || data.teachers.length === 0 ? (
        <NoDataFound noFoundTitle="Data Not Found" />
      ) : (
        <FlatList
          data={data?.teachers}
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
    } else if (results.length === 0) {
      return <NoDataFound noFoundTitle="No Data Found" />;
    } else if (results.length > 0) {
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
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Teachers"
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

export default TeachersScreen;
