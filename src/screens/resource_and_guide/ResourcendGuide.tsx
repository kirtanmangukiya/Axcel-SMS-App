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
    MainStackParamList,
    resourceAndGuideApiResponce,
  } from '../../types';
  import { LibraryBooksData, resourceAndGuideData } from '../../config/axios';
  import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
  import NoDataFound from '../../components/no_data_found/NoDataFound';
  import BooksLibraryComponent from '../BooksLibraryComponent';
  import TopBar from '../../components/TopBar';
  import ResourceAndGuideComponent from '../../components/resource_and_guide/ResourceAndGuideComponent';

  type InvoiceScreenNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'ResourceAndGuide'
  >;

  type YearScreenResultRouteProp = RouteProp<
    MainStackParamList,
    'ResourceAndGuide'
  >;
  const ResourceAndGuide: React.FC = () => {
    const navigation = useNavigation<InvoiceScreenNavigationProp>();
    const route = useRoute<YearScreenResultRouteProp>();

    // Safely extract results from route.params if it exists
    const results = route.params?.results;

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<resourceAndGuideApiResponce>();
    const [refreshing, setRefreshing] = useState<boolean>(false); // State for RefreshControl

    // console.log('-----------------------------------', data);fv

    const handleRefreshPress = useCallback(() => {
      console.log('Refresh icon pressed');
      setRefreshing(true); // Start refreshing indicator
      loadData(); // Trigger data reload on refresh
    }, []);

    const handleMenuPress = useCallback(() => {
      console.log('Menu icon pressed', navigation.dispatch);
      navigation.dispatch(DrawerActions.openDrawer());
    }, [navigation]);

    const renderItem = ({ item }: { item: object }) => {
      // console.log('-------------------', item);

      return (
        <View style={{ marginVertical: 5 }}>
          <ResourceAndGuideComponent data={item} />
        </View>
      )
    };

    const loadData = async () => {
      setLoading(true); // Ensure loading state is set when loading data
      try {
        const newData = await resourceAndGuideData();
        setData(newData);
        console.log('Hello', newData);
      } catch (error) {
        console.log('Error loading data:', error);
      } finally {
        setLoading(false); // Stop loading indicator
        setRefreshing(false); // Stop refreshing indicator
      }
    };

    const handleSearchPress = React.useCallback(() => {
      console.log('Search icon pressed');
      const pushAction = StackActions.push('SearchScreen', {
        students: data?.materials || [],
        sourceScreen: 'ResourceAndGuide',
      }); // Navigate to SearchScreenPP
      navigation.dispatch(pushAction);
    }, [navigation, data]);

    useEffect(() => {
      loadData(); // Initial data load
    }, []);
    const renderContent = () => {
      if (results === undefined) {
        return loading ? (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndacatorr />
          </View>
        ) : data?.material?.length === 0 ? (
          <NoDataFound noFoundTitle="Data Not Found" />
        ) : (
          <FlatList
            data={data?.materials}
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
        source={require('../../assest/icons/SideBarBg.jpg')} // Replace with your image path
        style={styles.background}>
        <View style={styles.container}>
          <TopBar
            title="Resource"
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

  export default ResourceAndGuide;
