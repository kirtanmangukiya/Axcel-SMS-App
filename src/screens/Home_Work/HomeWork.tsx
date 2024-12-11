import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
  StackActions,
  useFocusEffect,
} from '@react-navigation/native';
import TopBarAssignment from '../../components/top_bar/TopBarAssignment';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import { homeWorkData } from '../../config/axios';
import {
  Homework,
  HomeWorkApiResponceData,
  MainStackParamList,
} from '../../types';
import HomeWorkComponent from '../../components/homework_component/HomeWorkComponent';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';

type HomeWorkScreenResultRouteProp = RouteProp<MainStackParamList, 'HomeWork'>;
type HomeWorkScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'HomeWork'
>;

const HomeWork: React.FC = () => {
  const navigation = useNavigation<HomeWorkScreenNavigationProp>();
  const [homework, setHomework] = useState<Homework[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const route = useRoute<HomeWorkScreenResultRouteProp>();

  const results = route.params?.results;

  const loadData = async (page: number, isRefresh: boolean = false) => {
    if (isRefresh) setLoading(true);
    try {
      const data = await homeWorkData(page);
      if (data.homeworks.length > 0) {
        setHomework(prevHomework => (page === 1 ? data.homeworks : [...prevHomework, ...data.homeworks]));
        // If you have totalPages in your response, set it here
        // setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadData(1, true); // Reload the data, treating it as a refresh
  };

  useFocusEffect(
    useCallback(() => {
      loadData(currentPage);
    }, [currentPage])
  );

  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: homework || [],
      sourceScreen: 'HomeWork',
    });
    navigation.dispatch(pushAction);
  }, [navigation, homework]);

  const handleRefreshPress = useCallback(() => {
    onRefresh();
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({ item }: { item: Homework }) => (
    <View style={{ marginVertical: 5 }}>
      <HomeWorkComponent data={item} />
    </View>
  );

  const renderContent = () => {
    if (loading && homework.length === 0 && results === undefined) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    if (results !== undefined) {
      return results.length === 0 ? (
        <NoDataFound noFoundTitle="No Data Found" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      );
    }

    return homework.length === 0 ? (
      <NoDataFound noFoundTitle="Data Not Found" />
    ) : (
      <FlatList
        data={homework}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndacatorr /> : null}
        ListFooterComponentStyle={{ paddingBottom: 20 }}
      />
    );
  };

  const handleAddPress = () => {
    const pushAction = StackActions.push('AddHomeWork');
    navigation.dispatch(pushAction);
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBarAssignment
          title="Homework"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
          handleAddPress={handleAddPress}
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
  contentContainer: {
    paddingVertical: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeWork;
