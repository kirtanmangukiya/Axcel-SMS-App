import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  AppState,
} from 'react-native';
import {useNavigation, DrawerActions, StackActions, useRoute, RouteProp} from '@react-navigation/native';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import YearlyComponent from '../../components/yearly_component/yearly_component';
import TopBar from '../../components/TopBar';
import {classData} from '../../config/axios';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {
  classApiResponce,
  ClassAssignment,
  MainStackParamList,
} from '../../types';

type YearScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'ClassScreen'
>;
type YearScreenResultRouteProp = RouteProp<MainStackParamList, 'ClassScreen'>;

const ClassScreen: React.FC = () => {
  const navigation = useNavigation<YearScreenNavigationProp>();
  const [data, setData] = useState<classApiResponce | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const route = useRoute<YearScreenResultRouteProp>();
  const results = route.params?.results;

  const handleRefreshPress = useCallback(() => {
    setRefreshing(true); // Start refreshing indicator
    checkInternetAndLoadData(); // Trigger data reload on refresh
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({item}: {item: ClassAssignment}) => (
    <View style={{marginVertical: 10, marginHorizontal: 15}}>
      <YearlyComponent data={item} />
    </View>
  );

  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: data?.classes || [],
      sourceScreen: 'ClassScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const loadData = async () => {
    try {
      const fetchedData = await classData();
      setData(fetchedData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing indicator
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
    checkInternetAndLoadData(); // Initial data load

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkInternetAndLoadData();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const renderContent = () => {
    if (results === undefined) {
      return loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      ) : data?.classes?.length === 0 ? (
        <NoDataFound noFoundTitle="Data Not Found" />
      ) : (
        <FlatList
          data={data?.classes}
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
    } else if (results.length === 0) {
      return <NoDataFound noFoundTitle="No Data Found" />;
    } else if (results.length > 0) {
      return (
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
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Class"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        />
        <View style={styles.content}>
          {renderContent()}
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    bottom: 10,
  },
  contentContainer: {
    paddingVertical: 10,
    marginVertical: 20,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClassScreen;
