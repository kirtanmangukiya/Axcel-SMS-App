import {
  AppState,
  AppStateStatus,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './route';
import {NotificationProvider} from './utils/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {
  const navigationRef = useRef(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [hasPermission, setHasPermission] = useState(false);

  const saveNotificationToStorage = async data => {
    try {
      if (!data || !data.screen) return;

      const notificationsJson = await AsyncStorage.getItem('notifications');
      const notifications = notificationsJson
        ? JSON.parse(notificationsJson)
        : [];

      // Add new notification
      notifications.push({
        screen: data.screen,
        params: data.params,
        timestamp: Date.now(),
        read: false,
      });

      // Keep only the last 50 notifications to prevent storage bloat
      if (notifications.length > 50) {
        notifications.splice(0, notifications.length - 50);
      }

      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(notifications),
      );
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  const checkAndRequestPermissions = async () => {
    // For Android 13 (API level 33) and above
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const androidPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (androidPermission === PermissionsAndroid.RESULTS.DENIED) {
        return false;
      }
    }

    // For iOS and Android Firebase Messaging permissions
    const authStatus = await messaging().requestPermission({
      sound: true,
      alert: true,
      badge: true,
      provisional: true, // Enable provisional authorization for iOS
    });

    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  useEffect(() => {
    const setupNotifications = async () => {
      const permissionGranted = await checkAndRequestPermissions();
      setHasPermission(permissionGranted);

      if (permissionGranted) {
        if (Platform.OS === 'android') {
          await messaging().createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
          });
        }

        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      }
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        // Check if physical device
        const authStatus = await messaging().requestPermission({
          sound: true,
          alert: true,
          badge: true,
        });

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        setHasPermission(enabled);

        if (enabled) {
          // Create notification channel for Android
          if (Platform.OS === 'android') {
            await messaging().createChannel({
              id: 'default',
              name: 'Default Channel',
              importance: messaging.Android.Importance.HIGH,
              sound: 'default',
              vibration: true,
            });
          }

          const token = await messaging().getToken();
          // Store token in your backend here
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  // Enhanced app state handling
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
      if (nextAppState === 'active' && Platform.OS === 'ios') {
        messaging().setBadgeCount(0); // Only for iOS
      }
    });

    return () => subscription.remove();
  }, []);

  // Enhanced foreground notification handling
  useEffect(() => {
    if (!hasPermission) return;

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {notification, data} = remoteMessage;

      // Log the entire notification payload
      console.log(
        'Foreground Notification Received:',
        JSON.stringify(remoteMessage),
      );
      console.log('Notification Title:', notification?.title);
      console.log('Notification Body:', notification?.body);
      console.log('Notification Data:', JSON.stringify(data));

      // Save notification to AsyncStorage
      if (data) {
        await saveNotificationToStorage(data);
      }

      // Update notification count based on notification type
      if (data?.notificationType) {
        updateCount(data.notificationType, 1);
      }

      if (appState === 'active') {
        Toast.show({
          type: data?.type || 'info',
          text1: notification?.title || '',
          text2: notification?.body || '',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          onPress: () => {
            if (data?.screen) {
              console.log(
                'Navigating to screen:',
                data.screen,
                'with params:',
                data.params,
              );

              // Parse the params if they're a string
              let params = data.params;
              if (typeof params === 'string') {
                try {
                  params = JSON.parse(params);
                } catch (e) {
                  console.log('Error parsing params:', e);
                }
              }

              // Navigate to DrawerRoutes first if needed
              if (data.screen.startsWith('Route')) {
                navigationRef.current?.navigate('DrawerRoutes', {
                  screen: data.screen,
                  params: params,
                });
              } else {
                navigationRef.current?.navigate(data.screen, params);
              }

              // Reset count when notification is pressed
              resetCount(data.notificationType);
            }
          },
        });
      }
    });

    return unsubscribe;
  }, [appState, hasPermission]);

  // Enhanced background notification handling
  useEffect(() => {
    if (!hasPermission) return;

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const {notification, data} = remoteMessage;

      console.log(
        'Background Notification Received:',
        JSON.stringify(remoteMessage),
      );
      console.log('Background Notification Data:', JSON.stringify(data));

      // Save notification to AsyncStorage
      if (data) {
        await saveNotificationToStorage(data);
      }

      await messaging().displayNotification({
        title: notification?.title,
        body: notification?.body,
        android: {
          channelId: 'default',
          importance: messaging.Android.Importance.HIGH,
          priority: messaging.Android.Importance.HIGH,
          smallIcon: 'ic_notification',
          largeIcon: data?.largeIcon,
          sound: 'default',
          vibrate: true,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
        data: data,
      });
    });

    // Handle notification open event
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', JSON.stringify(remoteMessage));
      console.log(
        'Notification opened app data:',
        JSON.stringify(remoteMessage.data),
      );

      if (remoteMessage.data?.screen) {
        console.log(
          'Navigating to screen from opened notification:',
          remoteMessage.data.screen,
        );

        // Parse the params if they're a string
        let params = remoteMessage.data.params;
        if (typeof params === 'string') {
          try {
            params = JSON.parse(params);
          } catch (e) {
            console.log('Error parsing params:', e);
          }
        }

        // Navigate to DrawerRoutes first if needed
        if (remoteMessage.data.screen.startsWith('Route')) {
          navigationRef.current?.navigate('DrawerRoutes', {
            screen: remoteMessage.data.screen,
            params: params,
          });
        } else {
          navigationRef.current?.navigate(remoteMessage.data.screen, params);
        }
      }
    });

    // Check initial notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'App opened from quit state notification:',
            JSON.stringify(remoteMessage),
          );
          console.log(
            'Initial notification data:',
            JSON.stringify(remoteMessage.data),
          );

          if (remoteMessage.data?.screen) {
            console.log(
              'Navigating to initial screen:',
              remoteMessage.data.screen,
            );

            // Parse the params if they're a string
            let params = remoteMessage.data.params;
            if (typeof params === 'string') {
              try {
                params = JSON.parse(params);
              } catch (e) {
                console.log('Error parsing params:', e);
              }
            }

            // Navigate to DrawerRoutes first if needed
            if (remoteMessage.data.screen.startsWith('Route')) {
              navigationRef.current?.navigate('DrawerRoutes', {
                screen: remoteMessage.data.screen,
                params: params,
              });
            } else {
              navigationRef.current?.navigate(
                remoteMessage.data.screen,
                params,
              );
            }
          }
        }
      });
  }, [hasPermission]);

  return (
    <NotificationProvider>
      <NavigationContainer ref={navigationRef}>
        <Routes />
        <Toast />
      </NavigationContainer>
    </NotificationProvider>
  );
};

export default App;
