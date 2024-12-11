import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  InputToolbarProps,
  SendProps,
} from 'react-native-gifted-chat';
import styled from 'styled-components/native';
import {RouteProp, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ChatItem, RootStackParamList} from '../../types';
import {listBeforeMessages, newMessageCreateAddData} from '../../config/axios';

interface User {
  _id: string | number;
  name?: string;
  avatar?: string | number | (() => JSX.Element);
}

interface Message extends IMessage {
  user: User;
}

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

const Header = styled.View`
  background-color: #0074a6;
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

export function ChatScreen() {
  const route = useRoute<ChatScreenRouteProp>();
  const {data} = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | number | null>(null);
  console.log('check the route ', data);

  const loadData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('loginData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserId(userData.user.id);

        const previousMessages = await listBeforeMessages(
          userData.user.id,
          data?.userId,
          data.lastMessageTimestamp,
        );

        if (previousMessages) {
          const formattedMessages = previousMessages.map(msg => ({
            _id: msg.id,
            text: msg.messageText,
            createdAt: msg.dateSent
              ? new Date(msg.dateSent * 1000) // Assuming dateSent is a Unix timestamp
              : new Date(),
            user: {
              _id: msg.fromId, // Ensure this is the ID of the message sender
              name: msg.fullName,
              avatar: msg.photo ? `path_to_images/${msg.photo}` : undefined,
            },
            dateSentH: msg.dateSentH, // Include the human-readable date from the backend
          }));
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.log(error);
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
      const userDataString = await AsyncStorage.getItem('loginData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const currentUserId = userData.user.id;

        const newMessage = newMessages[0];
        try {
          await newMessageCreateAddData(
            [{id: currentUserId}, {id: data?.userId}],
            newMessage.text,
          );

          const formattedMessages: Message[] = newMessages.map(msg => ({
            ...msg,
            _id: msg._id || new Date().getTime(),
            createdAt: new Date(),
            user: {
              ...msg.user,
              _id: currentUserId, // Ensure this is the ID of the current user
              avatar:
                typeof msg.user.avatar === 'string'
                  ? msg.user.avatar
                  : undefined,
            },
          }));

          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, formattedMessages),
          );
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return <InputToolbar {...props} containerStyle={styles.inputToolbar} />;
  };

  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send {...props}>
        <View style={styles.sendContainer}>
          <Text style={styles.sendText}>Send</Text>
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

  return (
    <Container>
      <Header>
        <Image
          source={require('../../assest/icons/download.jpg')}
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
        isLoadingEarlier={refreshing}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
