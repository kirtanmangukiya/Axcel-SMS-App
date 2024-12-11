  import React, { useCallback, useEffect, useState } from 'react';
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
    StackActions,
    useRoute,
    RouteProp,
    useFocusEffect,
  } from '@react-navigation/native';
  import AssignmentComponent from '../../components/assignment_component/AssignmentComponent';
  import { AssignmentsData } from '../../config/axios';
  import TopBarAssignment from '../../components/top_bar/TopBarAssignment';
  import { AssignmentApiResponce, MainStackParamList } from '../../types';
  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
  import NoDataFound from '../../components/no_data_found/NoDataFound';

  type AssignmentScreenNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'AssignmentScreen'
  >;

  type AssignmentScreenResultRouteProp = RouteProp<
    MainStackParamList,
    'AssignmentScreen'
  >;

  const AssignmentScreen: React.FC = () => {
    const navigation = useNavigation<AssignmentScreenNavigationProp>();
    const route = useRoute<AssignmentScreenResultRouteProp>();
    const [data, setData] = useState<AssignmentApiResponce>();
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // Safely extract results from route.params if it exists
    const results = route.params?.results;

    const loadData = useCallback(async () => {
      try {
        setLoading(true);
        const response = await AssignmentsData();
        setData(response);
        console.log('---------------------', response?.assignments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

    const handleRefreshPress = useCallback(() => {
      console.log('Refresh icon pressed');
      setRefreshing(true);
      loadData();
    }, [loadData]);

    const handleMenuPress = useCallback(() => {
      console.log('Menu icon pressed');
      navigation.dispatch(DrawerActions.openDrawer());
    }, [navigation]);

    const handleSearchPress = useCallback(() => {
      console.log('Search icon pressed');
      const pushAction = StackActions.push('SearchScreen', {
        students: data?.assignments || [],
        sourceScreen: 'AssignmentScreen',
      }); // Navigate to SearchScreen
      navigation.dispatch(pushAction);
    }, [navigation, data]);

    const handleAddPress = useCallback(() => {
      const pushAction = StackActions.push('AddAssignmentScreen');
      navigation.dispatch(pushAction);
    }, [navigation]);

    useFocusEffect(
      useCallback(() => {
        loadData();
      }, [loadData])
    );

    const renderContent = () => {
      if (results === undefined) {
        return loading ? (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndacatorr />
          </View>
        ) : data?.assignments.length === 0 ? (
          <NoDataFound noFoundTitle="Data Not Found" />
        ) : (
          <FlatList
            data={data?.assignments}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <AssignmentComponent data={item} />}
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
            renderItem={({ item }) => <AssignmentComponent data={item} />}
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
          <TopBarAssignment
            title="Assignment"
            onSearchPress={handleSearchPress}
            onRefreshPress={handleRefreshPress}
            onMenuPress={results ? null : handleMenuPress}
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
      resizeMode: 'cover', // or 'stretch' as per your preference
    },
    content: {
      flex: 1,
      bottom: 10,
    },
    container: {
      flex: 1,
      // backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: Add opacity to overlay
    },
    contentContainer: {
      paddingVertical: 10,
    },
    activityIndicatorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  export default AssignmentScreen;
