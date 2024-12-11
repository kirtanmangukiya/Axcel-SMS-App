import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  AppState,
  BackHandler,
  Alert,
} from 'react-native';
import {useNavigation, DrawerActions, useFocusEffect} from '@react-navigation/native';
import ClassLeaderBoardScreen from './ClassLeaderBoardScreen';
import StateSelectedScreen from './StateSelectedScreen';
import NewsSelectedScreen from './NewsSelectedScreen';
import {DashboardData} from '../config/axios';
import {dashBoardApiResponce} from '../types';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import TopBar from '../components/TopBar';

const Dashboard: React.FC = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<dashBoardApiResponce>();
  const [appState, setAppState] = useState(AppState.currentState);

  const handleSearchPress = useCallback(() => {
    console.log('Search icon pressed');
  }, []);

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    onRefresh();
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleTabPress = (index: number) => {
    setSelectedTab(index);
  };

  const getTabImage = (index: number) => {
    switch (index) {
      case 0:
        return selectedTab === 0
          ? require('../assest/icons/dash_tab_leaderboard_selected.png')
          : require('../assest/icons/dash_tab_leaderboard_unselected.png');
      case 1:
        return selectedTab === 1
          ? require('../assest/icons/dash_tab_stat_selected.png')
          : require('../assest/icons/dash_tab_stat_unselected.png');
      case 2:
        return selectedTab === 2
          ? require('../assest/icons/dash_tab_news_selected.png')
          : require('../assest/icons/dash_tab_news_unselected.png');
      default:
        return null;
    }
  };

  const loadData = async () => {
    try {
      const data = await DashboardData();
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          {cancelable: false},
        );
        return true; // Prevent the default back button behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  useEffect(() => {
    checkInternetAndLoadData();

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

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Axcel International School "
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        />
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 0 && styles.selectedTab]}
            onPress={() => handleTabPress(0)}>
            <Image source={getTabImage(0)} style={[{width: 35, height: 27}]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 1 && styles.selectedTab]}
            onPress={() => handleTabPress(1)}>
            <Image source={getTabImage(1)} style={{width: 35, height: 30}} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 2 && styles.selectedTab]}
            onPress={() => handleTabPress(2)}>
            <Image source={getTabImage(2)} style={{width: 45, height: 30}} />
          </TouchableOpacity>
        </View>
        <View style={styles.lineContainer}>
          <View
            style={[
              styles.line,
              {backgroundColor: selectedTab === 0 ? 'red' : 'white'},
            ]}
          />
          <View
            style={[
              styles.line,
              {backgroundColor: selectedTab === 1 ? 'red' : 'white'},
            ]}
          />
          <View
            style={[
              styles.line,
              {backgroundColor: selectedTab === 2 ? 'red' : 'white'},
            ]}
          />
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndacatorr />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {selectedTab === 0 && (
              <ClassLeaderBoardScreen data={data?.studentLeaderBoard ?? []} />
            )}
            {selectedTab === 1 && <StateSelectedScreen />}
            {selectedTab === 2 && (
              <NewsSelectedScreen newsData={data?.newsEvents} />
            )}
          </ScrollView>
        )}
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '5%',
    paddingHorizontal: '7%',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabIcon: {
    width: 30,
    height: 35,
  },
  selectedTab: {
    borderBottomWidth: 2,
  },
  content: {
    flexGrow: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  line: {
    flex: 1,
    height: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;
