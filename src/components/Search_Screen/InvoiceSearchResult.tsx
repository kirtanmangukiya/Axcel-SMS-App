import React, {useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  Text,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {InvoiceItemResponce, MainStackParamList} from '../../types';
import InvoiceComponent from '../InvoiceComponent';
import NoDataFound from '../no_data_found/NoDataFound';

type InvoiceSearchResultRouteProp = RouteProp<
  MainStackParamList,
  'InvoiceSearchResult'
>;
type InvoiceSearchResultNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'InvoiceSearchResult'
>;

const InvoiceSearchResult: React.FC = () => {
  const navigation = useNavigation<InvoiceSearchResultNavigationProp>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const route = useRoute<InvoiceSearchResultRouteProp>();
  const {results} = route.params;

  const handleMenuPress = React.useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({item}: {item: InvoiceItemResponce}) => (
    <View style={{marginVertical: 10, marginHorizontal: 15}}>
      <InvoiceComponent data={item} />
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
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
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
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

export default InvoiceSearchResult;
