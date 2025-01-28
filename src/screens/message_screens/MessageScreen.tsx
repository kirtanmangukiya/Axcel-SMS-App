import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  useNavigation,
  DrawerActions,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {
  MainStackParamList,
  MessageListApiResponce,
  ChatItem,
} from '../../types';
import {MessageListData} from '../../config/axios';
import TopBarAssignment from '../../components/top_bar/TopBarAssignment';
import ActivityIndacatorr from '../../components/activity_indicator/ActivityIndacatorr';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type MessageScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'MessageScreen'
>;

type MessageScreenResultRouteProp = RouteProp<
  MainStackParamList,
  'MessageSearch'
>;

const screenWidth = Dimensions.get('window').width;
const scale = screenWidth / 320;

const normalize = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

const ChatListItem: React.FC<{item: ChatItem}> = ({item}) => {
  const navigation = useNavigation<MessageScreenNavigationProp>();
  // console.log(item?.id);
  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${item.id}`;

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ChatScreen', {data: item})}>
      <Image
        source={
          item.id
            ? {uri: imageUrl}
            : require('../../assest/icons/SideBarBg.jpg')
        }
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.fullName}>{item.fullName}</Text>
        <Text style={styles.lastMessage}>
          {item.lastMessage.slice(0, 30)}...
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.date}>{item.lastMessageDate}</Text>
        {item.messageStatus === 0 && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  );
};

const MessageScreen: React.FC = () => {
  const navigation = useNavigation<MessageScreenNavigationProp>();
  const route = useRoute<MessageScreenResultRouteProp>();
  const results = route.params?.results;

  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  console.log(results, messages);

  const loadData = async (page: number, isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else if (page === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const data = await MessageListData(page);
      if (isRefreshing) {
        setMessages(data.messages || []);
      } else {
        setMessages(prevMessages => [
          ...prevMessages,
          ...(data.messages || []),
        ]);
      }
    } catch (error) {
      console.log('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const handleRefreshPress = useCallback(() => {
    setPage(1);
    loadData(1, true);
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    console.log('Search icon pressed');
    navigation.navigate('SearchScreen', {
      students: messages || [],
      sourceScreen: 'MessageScreen',
    });
  }, [navigation, messages]);

  const handleLoadMore = () => {
    if (!isLoadingMore && messages.length > 0) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderContent = () => {
    if (results === undefined) {
      return loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndacatorr />
        </View>
      ) : messages.length === 0 ? (
        <NoDataFound />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <ChatListItem item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
              tintColor="#000000"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator size="small" color="#000000" /> : null
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
          renderItem={({item}) => <ChatListItem item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefreshPress}
              tintColor="#000000"
            />
          }
        />
      );
    }
  };
  return (
    <View style={{flex: 1}}>
      <TopBarAssignment
        style={{backgroundColor: 'red'}}
        title="Messages"
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        handleAddPress={handleSearchPress}
        onRefreshPress={handleRefreshPress}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
  },
  textContainer: {
    flex: 1,
    marginLeft: normalize(10),
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: normalize(15),
    color: 'black',
  },
  lastMessage: {
    color: '#888',
    fontSize: normalize(12),
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  date: {
    color: '#888',
    fontSize: normalize(10),
  },
  unreadIndicator: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: 'red',
    marginTop: normalize(5),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageScreen;
