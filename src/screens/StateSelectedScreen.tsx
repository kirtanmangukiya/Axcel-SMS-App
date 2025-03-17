import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationData {
  screen: keyof RootStackParamList;
  params?: any;
  timestamp: number;
  read: boolean;
}

const StateSelectedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [unreadNotifications, setUnreadNotifications] = useState<{
    ResourceAndGuide: boolean;
    NewsBoard: boolean;
    InvoiceScreen: boolean;
  }>({
    ResourceAndGuide: false,
    NewsBoard: false,
    InvoiceScreen: false,
  });

  useEffect(() => {
    loadNotificationStatus();
  }, []);

  const loadNotificationStatus = async () => {
    try {
      const notificationsJson = await AsyncStorage.getItem('notifications');
      if (notificationsJson) {
        const notifications: NotificationData[] = JSON.parse(notificationsJson);
        
        const lastReadJson = await AsyncStorage.getItem('lastReadTimestamps');
        const lastRead = lastReadJson ? JSON.parse(lastReadJson) : {
          ResourceAndGuide: 0,
          NewsBoard: 0,
          InvoiceScreen: 0,
        };
        
        const hasUnread = {
          ResourceAndGuide: false,
          NewsBoard: false,
          InvoiceScreen: false,
        };
        
        notifications.forEach(notification => {
          if (!notification.read && notification.screen) {
            if (notification.timestamp > (lastRead[notification.screen] || 0)) {
              hasUnread[notification.screen] = true;
            }
          }
        });
        
        setUnreadNotifications(hasUnread);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const saveNotificationResponse = async (notificationData: NotificationData) => {
    try {
      const notificationsJson = await AsyncStorage.getItem('notifications');
      const notifications: NotificationData[] = notificationsJson 
        ? JSON.parse(notificationsJson) 
        : [];
      
      notifications.push(notificationData);
      
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
      await loadNotificationStatus();
    } catch (error) {
      // Silent error handling
    }
  };

  const markScreenAsRead = async (screenName: keyof RootStackParamList) => {
    try {
      // Update last read timestamp for this screen
      const lastReadJson = await AsyncStorage.getItem('lastReadTimestamps');
      const lastRead = lastReadJson ? JSON.parse(lastReadJson) : {};
      
      lastRead[screenName] = Date.now();
      await AsyncStorage.setItem('lastReadTimestamps', JSON.stringify(lastRead));
      
      // Mark notifications for this screen as read
      const notificationsJson = await AsyncStorage.getItem('notifications');
      if (notificationsJson) {
        const notifications: NotificationData[] = JSON.parse(notificationsJson);
        let updated = false;
        
        notifications.forEach(notification => {
          if (notification.screen === screenName && !notification.read) {
            notification.read = true;
            updated = true;
          }
        });
        
        if (updated) {
          await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
        }
      }
      
      // Update UI
      setUnreadNotifications(prev => ({
        ...prev,
        [screenName]: false
      }));
    } catch (error) {
      // Silent error handling
    }
  };

  const handleImagePress = (screenName: keyof RootStackParamList) => {
    markScreenAsRead(screenName);
    navigation.navigate(screenName);
  };

  const renderRedDot = (hasUnread: boolean) => {
    if (hasUnread) {
      return <View style={styles.redDot} />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <TouchableOpacity
          onPress={() => handleImagePress('ResourceAndGuide')}
          style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../assest/icons/dash_stat_student.png')}
              style={styles.image}
            />
            <Text style={styles.imageText}>Resource & Guide</Text>
          </View>
          {renderRedDot(unreadNotifications.ResourceAndGuide)}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleImagePress('NewsBoard')}
          style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../assest/icons/dash_stat_teacher.jpg')}
              style={styles.image}
            />
            <Text style={styles.imageText}>News Board</Text>
          </View>
          {renderRedDot(unreadNotifications.NewsBoard)}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleImagePress('InvoiceScreen')}
          style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../assest/icons/dash_stat_classes.jpg')}
              style={styles.image}
            />
            <Text style={styles.imageText}>Invoice</Text>
          </View>
          {renderRedDot(unreadNotifications.InvoiceScreen)}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StateSelectedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    position: 'absolute',
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
