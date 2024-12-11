import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  AppState,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  StackActions,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import TopBar from '../../components/TopBar';
import GradeComponent from '../../components/grade_component/GradeComponent';
import {GradleLevelData} from '../../config/axios';
import {gradleLevelApiResponce, MainStackParamList} from '../../types';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

type GradeLevelNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'GradeLevel'
>;

type GradeLevelResultRouteProp = RouteProp<MainStackParamList, 'GradeLevel'>;

const GradeLevel: React.FC = () => {
  const navigation = useNavigation<GradeLevelNavigationProp>();
  const route = useRoute<GradeLevelResultRouteProp>();

  const [data, setData] = useState<gradleLevelApiResponce[]>([]);
  const [fullData, setFullData] = useState<gradleLevelApiResponce[]>([]); // Store full data
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [showFullData, setShowFullData] = useState<boolean>(false); // State to toggle between results and full data

  const results = route.params?.results;

  const loadData = async () => {
    setLoading(true);
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
      const fetchedData = await GradleLevelData();
      setData(fetchedData || []);
      setFullData(fetchedData || []); // Store the full data
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefreshPress = useCallback(() => {
    setShowFullData(true); // Force display of fullData
    setRefreshing(true);
    loadData(); // Reload full data
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('SearchScreen', {
      students: fullData,
      sourceScreen: 'GradeLevel',
      onSearchResult: (searchResults: gradleLevelApiResponce[]) => {
        setData(searchResults);
        setShowFullData(false); // Switch back to showing search results if needed
      },
    });
  }, [navigation, fullData]);

  const renderItem = ({item}: {item: gradleLevelApiResponce}) => (
    <View style={{}}>
      <GradeComponent data={item} />
    </View>
  );

  const renderContent = () => {
    const displayData = showFullData ? fullData : results || data;

    if (loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    return displayData.length === 0 ? (
      <NoDataFound
        noFoundTitle={results ? 'No Results Found' : 'Data Not Found'}
      />
    ) : (
      <FlatList
        data={displayData}
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
    );
  };

  useEffect(() => {
    loadData();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        loadData();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Grade Level"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={results ? null : handleMenuPress}
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
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingVertical: 10,
  },
});

export default GradeLevel;
