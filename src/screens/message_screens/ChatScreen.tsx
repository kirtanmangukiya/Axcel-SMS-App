import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  InputToolbarProps,
  SendProps,
  Day,
} from 'react-native-gifted-chat';
import styled from 'styled-components/native';
import {RouteProp, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types';
import {listBeforeMessages, newMessageCreateAddData} from '../../config/axios';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Message {
  _id: number | string;
  text: string;
  createdAt: Date;
  user: {
    _id: number | string;
    name?: string;
    avatar?: string;
  };
  dateSentH?: string;
}

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

const Header = styled.View`
  background-color: #0074a6;
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${props =>
    props.theme.mode === 'dark' ? '#121212' : '#f5f5f5'};
`;

// Key for storing last read messages in AsyncStorage
const LAST_READ_MESSAGES_KEY = 'last_read_messages';

// Interface for storing last read message data
interface LastReadMessage {
  messageId: string | number;
  messageText: string;
  timestamp: number;
  sentByMe: boolean; // Add this field to track if the current user sent the message
}

export function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const route = useRoute<ChatScreenRouteProp>();
  const {data} = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | number | null>(null);
  const navigation = useNavigation();

  // Update the last read message in AsyncStorage

  const updateLastReadMessage = async (
    messageText: string,
    sentByMe: boolean = false,
  ) => {
    try {
      if (!data?.userId) return;

      const userId = data.userId.toString();

      // Get current stored messages
      const storedMessages = await AsyncStorage.getItem(LAST_READ_MESSAGES_KEY);
      let lastReadMessages = storedMessages ? JSON.parse(storedMessages) : {};

      // Update the record for this user
      lastReadMessages[userId] = {
        messageId: Date.now(),
        messageText: messageText,
        timestamp: Date.now(),
        sentByMe: sentByMe, // Store whether the current user sent this message
      };

      // Save back to AsyncStorage
      await AsyncStorage.setItem(
        LAST_READ_MESSAGES_KEY,
        JSON.stringify(lastReadMessages),
      );
    } catch (error) {
      console.error('Failed to update last read message:', error);
    }
  };

  // When component mounts, mark the conversation as read
  useEffect(() => {
    const markConversationAsRead = async () => {
      try {
        if (data?.lastMessage) {
          // We don't know who sent the last message here, so we'll use false as default
          await updateLastReadMessage(data.lastMessage, false);
        }
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    };

    markConversationAsRead();
  }, [data]);

  const loadData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('loginData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserId(userData.user.id);

        // Check if we have a valid userId from the data
        if (data?.userId) {
          const messages = await listBeforeMessages(
            userData.user.id,
            data.userId,
          );

          setMessages(messages);

          // If there are messages, mark the latest one as read
          if (messages.length > 0) {
            await updateLastReadMessage(messages[0].text);
          }
        } else {
          // If no userId is provided, set empty messages
          setMessages([]);
        }
      }
    } catch (error) {
      console.log('Error loading chat data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (newMessages: IMessage[] = []) => {
    if (newMessages.length > 0) {
      try {
        const messageText = newMessages[0].text;
        const requestBody = {
          recipients: [{id: data?.userId}],
          message: messageText,
        };

        console.log('Message Request Body:', requestBody);

        await newMessageCreateAddData([{id: data?.userId}], messageText);

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessages),
        );

        // Update the last read message when sending a new message

        // Mark it as sent by the current user (true)
        await updateLastReadMessage(messageText, true);

        loadData();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={[
          styles.inputToolbar,
          isDarkMode && {backgroundColor: '#333333', borderTopColor: '#444444'},
        ]}
      />
    );
  };

  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send {...props}>
        <View style={styles.sendContainer}>
          <Text style={[styles.sendText, isDarkMode && {color: '#4a9eff'}]}>
            Send
          </Text>
        </View>
      </Send>
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="small" color="#0074A6" />
      </View>
    );
  }

  console.log('Data:', data);
  const renderDay = props => {
    return (
      <Day
        {...props}
        textStyle={{
          color: '#000000',
          fontWeight: '600',
        }}
      />
    );
  };
  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View>
            <AntDesign
              name="arrowleft"
              size={24}
              color="#ffffff"
              style={{marginRight: 10}}
            />
          </View>
        </TouchableOpacity>
        <Image
          source={
            data?.photo
              ? {
                  uri: `https://sms.psleprimary.com/uploads/profile/${data.photo}`,
                }
              : require('../../assest/icons/download.jpg')
          }
          style={styles.avatar}
        />
        <HeaderText>{data?.fullName}</HeaderText>
      </Header>
      <GiftedChat
        messages={messages}
        onSend={newMessages => sendMessage(newMessages)}
        user={{_id: userId || ''}}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        onRefresh={onRefresh}
        renderDay={renderDay}
        isLoadingEarlier={refreshing}
        textStyle={{color: isDarkMode ? '#ffffff' : '#000000'}}
        timeTextStyle={{color: isDarkMode ? '#cccccc' : '#666666'}}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  inputToolbar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sendText: {
    color: '#0074A6',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
