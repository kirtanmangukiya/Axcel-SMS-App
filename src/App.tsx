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

const App: React.FC = () => {
  const navigationRef = useRef(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [hasPermission, setHasPermission] = useState(false);

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

      if (appState === 'active') {
        Toast.show({
          type: data?.type || 'info',
          text1: notification?.title || '',
          text2: notification?.body || '',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          onPress: () => {
            // Handle notification tap
            if (data?.screen) {
              navigationRef.current?.navigate(data.screen, data.params);
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
      if (remoteMessage.data?.screen) {
        navigationRef.current?.navigate(
          remoteMessage.data.screen,
          remoteMessage.data.params,
        );
      }
    });

    // Check initial notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen) {
          navigationRef.current?.navigate(
            remoteMessage.data.screen,
            remoteMessage.data.params,
          );
        }
      });
  }, [hasPermission]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Routes />
      <Toast />
    </NavigationContainer>
  );
};

export default App;
