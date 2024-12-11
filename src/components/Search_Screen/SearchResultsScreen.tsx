import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import {
  useNavigation,
  RouteProp,
  useRoute,
  DrawerActions,
} from '@react-navigation/native';
import {MainStackParamList, StudentApiRespoce} from '../../types';
import TopBar from '../TopBar';
import StudentProfileComponent from '../StudentProfileComponent';
import NoDataFound from '../no_data_found/NoDataFound';

type SearchResultsScreenRouteProp = RouteProp<
  MainStackParamList,
  'SearchResultsScreen'
>;

const SearchResultsScreen: React.FC = () => {
  const navigation = useNavigation<SearchResultsScreenRouteProp>();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const route = useRoute<SearchResultsScreenRouteProp>();
  const {results} = route.params;

  const handleRefresh = () => {
    // Refresh logic here
  };
  const handleMenuPress = React.useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <TopBar title="Search Results" onMenuPress={handleMenuPress} />
      <View style={styles.container}>
        <View style={styles.content}>
          {results.length === 0 ? (
            <NoDataFound noFoundTitle="Data No Found" />
          ) : (
            <FlatList
              data={results}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <StudentProfileComponent
                  name={item.name}
                  username={item.fullName}
                  email={item.email}
                  profileImageUri={item.profileImageUri}
                  docs={item.docs}
                />
              )}
              contentContainerStyle={styles.flatListContainer}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              refreshControl={
                <RefreshControl
                  colors={['#ffffff']}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
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
  },
  content: {
    flex: 1,
    marginHorizontal: '5%',
    justifyContent: 'center',
  },
  flatListContainer: {
    paddingVertical: 20,
  },
  separator: {
    height: 10,
  },
});

export default SearchResultsScreen;
