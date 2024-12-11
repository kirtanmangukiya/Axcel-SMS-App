import React, {useEffect, useState} from 'react';
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
} from '@react-navigation/native';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import YearlyComponent from '../../components/yearly_component/yearly_component';
import TopBar from '../../components/TopBar';
import {AssignmentsData} from '../../config/axios';
import {
  AssignmentApiResponce,
  ClassAssignment,
  MainStackParamList,
} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
type YearScreenResultRouteProp = RouteProp<
  MainStackParamList,
  'YearScreenResult'
>;
type YearScreenResultNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'YearScreenResult'
>;

const YearScreenResult: React.FC = () => {
  const navigation = useNavigation<YearScreenResultNavigationProp>();
  const [data, setData] = useState<AssignmentApiResponce | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const route = useRoute<YearScreenResultRouteProp>();
  const {results} = route.params;

  const handleMenuPress = React.useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({item}: {item: ClassAssignment}) => (
    <View style={{marginVertical: 10, marginHorizontal: 15}}>
      <YearlyComponent data={item} />
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        {/* <TopBar
          title="Years"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        /> */}
        <View style={styles.content}>
          {!results.length ? (
            <NoDataFound noFoundTitle="Data Not Found" />
          ) : (
            <FlatList
              data={results}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  //   onRefresh={handleRefreshPress}
                  colors={['#ffffff']}
                />
              }
            />
          )}
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
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingVertical: 10,
    marginVertical: 20,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YearScreenResult;
