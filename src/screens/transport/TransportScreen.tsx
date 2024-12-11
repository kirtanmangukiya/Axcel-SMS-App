import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
  StackActions,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  MainStackParamList,
  TeacherApiRespoce,
  transportItem,
} from '../../types';
import {TeacherData} from '../../config/axios';
import TopBar from '../../components/TopBar';
import TransportComponent from '../../components/transport_component/TransportComponent';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../../components/no_data_found/NoDataFound';

type TransportScreenResultRouteProp = RouteProp<
  MainStackParamList,
  'TransportScreen'
>;

type TransportScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'TransportScreen'
>;

const TransportScreen: React.FC = () => {
  const navigation = useNavigation<TransportScreenNavigationProp>();
  const route = useRoute<TransportScreenResultRouteProp>();

  const [data, setData] = useState<transportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const results = route.params?.results;

  // Function to load data from API
  const loadData = async () => {
    console.log('Loading data...');
    setLoading(true);
    try {
      const response: TeacherApiRespoce = await TeacherData();
      const transportArray = Object.values(response.transports);
      setData(transportArray);
      console.log('Response:', response);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(); // Initial data load
  }, []);

  // Handlers for search, refresh, and menu
  const handleSearchPress = useCallback(() => {
    const pushAction = StackActions.push('SearchScreen', {
      students: data || [],
      sourceScreen: 'TransportScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const handleRefreshPress = useCallback(() => {
    setRefreshing(true);
    loadData(); // Reload data on refresh
    console.log('Refreshing data...');
    route.params.results = undefined;
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  // Function to render each transport item
  const renderItem = ({item}: {item: transportItem}) => (
    <View style={{marginVertical: 10, marginHorizontal: 15}}>
      <TransportComponent data={item} />
    </View>
  );

  // Render content based on loading, data, and results
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndacatorr />
        </View>
      );
    } else if (refreshing || !results || results === undefined) {
      return (
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
            />
          }
        />
      );
    }

    if (results.length === 0) {
      return (
        <NoDataFound
          noFoundTitle="No Data Found"
          onRefreshPress={handleRefreshPress}
        />
      );
    }

    return (
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefreshPress}
          />
        }
      />
    );
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Transport"
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
  listContent: {
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransportScreen;
