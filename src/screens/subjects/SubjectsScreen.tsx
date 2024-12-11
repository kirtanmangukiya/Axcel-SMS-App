import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  Text,
  RefreshControl,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  useRoute,
  StackActions,
} from '@react-navigation/native';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import TopBar from '../../components/TopBar';
import SubjectsComponent from '../../components/subjects_component/SubjectsComponent';
import {SubjectAndTeacherData} from '../../config/axios';
import {
  MainStackParamList,
  subjectAndTeaceherApiResponce,
  subjectsData,
} from '../../types';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

type SubjectsScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'SubjectsScreen'
>;

const SubjectsScreen: React.FC = () => {
  const navigation = useNavigation<SubjectsScreenNavigationProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<subjectAndTeaceherApiResponce | undefined>(
    undefined,
  );
  const [showSubjectsDataOnly, setShowSubjectsDataOnly] =
    useState<boolean>(false);
  const route = useRoute();
  const results = route.params?.results;

  console.log(
    'Check the result work in subject screen ----------------:',
    results,
  );

  const handleSearchPress = useCallback(() => {
    console.log('Search icon pressed');
    const pushAction = StackActions.push('SearchScreen', {
      students: data?.subjects || [],
      sourceScreen: 'SubjectsScreen',
    }); // Navigate to SearchScreen
    navigation.dispatch(pushAction);
  }, [navigation, data]);

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    setShowSubjectsDataOnly(true); // Force display of data?.subjects permanently
    onRefresh();
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const loadData = async () => {
    try {
      const response = await SubjectAndTeacherData();
      setData(response);
    } catch (error) {
      console.error('Network error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Unable to fetch data. Please check your connection.',
        position: 'top',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const renderItem = ({item}: {item: subjectsData}) => (
    <View style={{marginVertical: 8}}>
      <SubjectsComponent data={item} />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndacatorr />
        </View>
      );
    } else if (
      showSubjectsDataOnly ||
      !results ||
      results.length === undefined
    ) {
      return data?.subjects?.length ? (
        <FlatList
          data={data?.subjects}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <NoDataFound noFoundTitle="No Data Found" />
      );
    } else if (results.length === 0) {
      return <NoDataFound noFoundTitle="No Data Found" />;
    } else {
      return (
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
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Subjects"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={results ? null : handleMenuPress}
        />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {renderContent()}
        </View>
      </View>
      <Toast />
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
  contentContainer: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubjectsScreen;
