import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
  StackActions,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  bookSlibrarayItem,
  BooksLibraryApiResponce,
  HostelDataApiResponce,
  HostelObject,
  MainStackParamList,
} from '../../types';
import BooksLibraryComponent from '../BooksLibraryComponent';
import { HostelData, LibraryBooksData } from '../../config/axios';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import TopBar from '../../components/TopBar';
import HostelComponent from '../../components/hostel_component/HostelComponent';

type HostelScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'HostelScreen'
>;

type HostelScreenResultRouteProp = RouteProp<
  MainStackParamList,
  'HostelScreen'
>;

const HostelScreen: React.FC = () => {
  const navigation = useNavigation<HostelScreenNavigationProp>();
  const route = useRoute<HostelScreenResultRouteProp>();
  const results = route.params?.results;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<HostelDataApiResponce>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showDataOnly, setShowDataOnly] = useState<boolean>(false); // New state to control data display

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    setShowDataOnly(true); // Force display of data?.subjects permanently
    setRefreshing(true);
    loadData();
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed', navigation.dispatch);
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({ item }: { item: HostelObject }) => (
    <View style={{ marginVertical: 5 }}>
      <HostelComponent data={item} />
    </View>
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const newData = await HostelData();
      setData(newData);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearchPress = React.useCallback(() => {
    console.log('Search icon pressed');
    const pushAction = StackActions.push('SearchScreen', {
      students: data || [],
      sourceScreen: 'HostelScreen',
    });
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  useEffect(() => {
    loadData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndacatorr />
        </View>
      );
    }

    if (showDataOnly || !results) {
      return data?.length === 0 ? (
        <NoDataFound noFoundTitle="Data Not Found" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefreshPress} />
          }
        />
      );
    } else if (results.length === 0) {
      return <NoDataFound noFoundTitle="No Data Found" />;
    } else {
      return (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefreshPress} />
          }
        />
      );
    }
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Hostel"
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
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 5, // Reduced padding
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default HostelScreen;
