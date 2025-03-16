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
  useFocusEffect,
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
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Key for storing last read messages in AsyncStorage
const LAST_READ_MESSAGES_KEY = 'last_read_messages';

// Interface for storing last read message data
interface LastReadMessage {
  messageId: string | number;
  messageText: string;
  timestamp: number; // Store timestamp for potential future use
}

// Type for the record of last read messages by user ID
type LastReadMessagesRecord = Record<string, LastReadMessage>;

const ChatListItem: React.FC<{
  item: ChatItem;
  onPress: (item: ChatItem) => void;
  hasNewMessage: boolean;
}> = ({item, onPress, hasNewMessage}) => {
  const imageUrl = `https://sms.psleprimary.com/uploads/profile/${item.photo}`;

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress(item)}>
      <Image
        source={
          item.photo
            ? {uri: imageUrl}
            : require('../../assest/icons/download.jpg')
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
        {/* Show red dot only if there's a new message */}
        {hasNewMessage && <View style={styles.unreadIndicator} />}
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
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [lastReadMessages, setLastReadMessages] =
    useState<LastReadMessagesRecord>({});

  // Load last read messages from AsyncStorage
  const loadLastReadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(LAST_READ_MESSAGES_KEY);
      if (storedMessages) {
        setLastReadMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load last read messages from storage:', error);
    }
  };

  // Save last read messages to AsyncStorage
  const saveLastReadMessages = async (
    updatedMessages: LastReadMessagesRecord,
  ) => {
    try {
      await AsyncStorage.setItem(
        LAST_READ_MESSAGES_KEY,
        JSON.stringify(updatedMessages),
      );
    } catch (error) {
      console.error('Failed to save last read messages to storage:', error);
    }
  };

  // Update the last read message for a specific user
  const updateLastReadMessage = useCallback(
    (item: ChatItem) => {
      const userId = item.id.toString();

      // Create updated record with the latest message
      const updatedLastReadMessages = {
        ...lastReadMessages,
        [userId]: {
          messageId: item.lastMessageId || 0,
          messageText: item.lastMessage || '',
          timestamp: Date.now(),
        },
      };

      // Update state and save to AsyncStorage
      setLastReadMessages(updatedLastReadMessages);
      saveLastReadMessages(updatedLastReadMessages);
    },
    [lastReadMessages],
  );

  // Check if a chat has a new unread message
  const hasNewMessage = useCallback(
    (item: ChatItem) => {
      const userId = item.id.toString();
      const lastRead = lastReadMessages[userId];

      // If we have no record of last read message, consider it new
      if (!lastRead) {
        return item.messageStatus === 0; // Only show if server says it's unread
      }

      // If the message ID is different or the message text is different, it's a new message
      if (
        (item.lastMessageId && item.lastMessageId !== lastRead.messageId) ||
        (item.lastMessage && item.lastMessage !== lastRead.messageText)
      ) {
        return item.messageStatus === 0; // Only show if server says it's unread
      }

      // Otherwise, it's not a new message
      return false;
    },
    [lastReadMessages],
  );

  const loadData = async (pageNum: number, isRefreshing = false) => {
    if (!hasMore && pageNum > 1) return;

    if (isRefreshing) {
      setRefreshing(true);
    } else if (pageNum === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await MessageListData(pageNum);
      if (response && response.messages) {
        const newMessages = response.messages;

        if (isRefreshing || pageNum === 1) {
          setMessages(newMessages);
        } else {
          setMessages(prevMessages => [...prevMessages, ...newMessages]);
        }

        if (newMessages.length < 10) {
          setHasMore(false);
        }
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
    loadLastReadMessages();
    loadData(1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLastReadMessages();
      setPage(1);
      setHasMore(true);
      loadData(1, true);
    }, []),
  );

  const handleRefreshPress = useCallback(() => {
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('SearchScreen', {
      students: messages || [],
      sourceScreen: 'MessageScreen',
      isAddingNewChat: false,
    });
  }, [navigation, messages]);

  const handleAddChatPress = useCallback(() => {
    navigation.navigate('AddChatScreen');
  }, [navigation]);

  const handleChatPress = useCallback(
    (item: ChatItem) => {
      // Update the last read message when opening a chat
      updateLastReadMessage(item);

      // Navigate to the chat screen
      navigation.navigate('ChatScreen', {data: item});
    },
    [navigation, updateLastReadMessage],
  );

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
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
          renderItem={({item}) => (
            <ChatListItem
              item={item}
              onPress={handleChatPress}
              hasNewMessage={hasNewMessage(item)}
            />
          )}
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
            isLoadingMore ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : null
          }
        />
      );
    } else if (results.length === 0) {
      return <NoDataFound noFoundTitle="No Data Found" textColor="#000000" />;
    } else if (results.length > 0) {
      return (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ChatListItem
              item={item}
              onPress={handleChatPress}
              hasNewMessage={hasNewMessage(item)}
            />
          )}
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
    <View style={{flex: 1, backgroundColor: '#fafafa'}}>
      <TopBarAssignment
        style={{backgroundColor: 'red'}}
        title="Messages"
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        handleAddPress={handleAddChatPress}
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
