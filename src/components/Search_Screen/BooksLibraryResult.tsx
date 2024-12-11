import React, {useEffect, useState, useCallback} from 'react';
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

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  bookSlibrarayItem,
  BooksLibraryApiResponce,
  MainStackParamList,
} from '../../types';
import BooksLibraryComponent from '../../screens/BooksLibraryComponent';
import NoDataFound from '../no_data_found/NoDataFound';
type BooksSearchResultRouteProp = RouteProp<
  MainStackParamList,
  'BooksLibraryScreen'
>;
type BooksSearchResultNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'BooksLibraryScreen'
>;
const BooksLibraryResult: React.FC = () => {
  const navigation = useNavigation<BooksSearchResultNavigationProp>();
  const route = useRoute<BooksSearchResultRouteProp>();
  const {results} = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<BooksLibraryApiResponce>();
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for RefreshControl

  // console.log('-----------------------------------', data);fv

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed', navigation.dispatch);
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({item}: {item: bookSlibrarayItem}) => (
    <View style={{marginVertical: 5}}>
      <BooksLibraryComponent data={item} />
    </View>
  );

  const handleSearchPress = React.useCallback(() => {
    console.log('Search icon pressed');
    navigation.navigate('SearchScreen', {
      students: data?.bookLibrary || [],
      sourceScreen: 'BooksLibraryScreen',
    }); // Navigate to SearchScreenPP
  }, [navigation, data]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        {/* <TopBar
          title="Books"
          onSearchPress={handleSearchPress}
        //   onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        /> */}

        {results.length === 0 ? (
          <View style={styles.noDataContainer}>
            <NoDataFound noFoundTitle="NO DATA FOUND" />
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            initialNumToRender={20}
            refreshControl={
              <RefreshControl
                colors={['#ffffff']}
                refreshing={refreshing}
                // onRefresh={handleRefreshPress}
              />
            }
          />
        )}
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

  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#333',
  },
  listContent: {
    paddingVertical: 10,
  },
});

export default BooksLibraryResult;
