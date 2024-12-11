import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  RefreshControl,
} from 'react-native';
import TopBar from '../components/TopBar';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
  StackActions,
  useIsFocused,
} from '@react-navigation/native';
import EventComponent from '../components/event_component/EventComponent';
import NoDataFound from '../components/no_data_found/NoDataFound';
import { EventData } from '../config/axios';
import { EventApiResponse, MainStackParamList } from '../types';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type EventsScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'EventsScreen'
>;

type EventsScreenResultRouteProp = RouteProp<
  MainStackParamList,
  'EventsScreen'
>;

const EventsScreen: React.FC = () => {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const [data, setData] = useState<EventApiResponse | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showingResults, setShowingResults] = useState<boolean>(false);
  const route = useRoute<EventsScreenResultRouteProp>();
  const results = route.params?.results;

  const isFocused = useIsFocused();

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    setShowingResults(false);  // Reset to show all data on refresh
    onRefresh();
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    console.log('Search icon pressed');
    const pushAction = StackActions.push('SearchScreen', {
      students: data?.events || [],
      sourceScreen: 'EventsScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allData = await EventData();
      setData(allData);
    } catch (error) {
      setError((error as Error).message);
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    if (isFocused) {
      if (results) {
        setShowingResults(true);  // Show results if navigating back from SearchScreen
      } else {
        loadData(); // Load fresh data when screen is focused and not coming from SearchScreen
      }
    }
  }, [isFocused, results]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    if (showingResults && results) {
      return results.length === 0 ? (
        <NoDataFound noFoundTitle="No Events Found" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <EventComponent data={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      );
    }

    if (data?.events.length === 0) {
      return <NoDataFound noFoundTitle="Data Not Found" />;
    }

    return (
      <FlatList
        data={data?.events}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <EventComponent data={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Events"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={results ? null : handleMenuPress}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {renderContent()}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventsScreen;
