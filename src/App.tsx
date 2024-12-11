import {Alert, AppState, AppStateStatus} from 'react-native';
// App.tsx
import React, {useEffect, useRef, useState} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

import {NavigationContainer} from '@react-navigation/native';
import Routes from './route';
import Toast from 'react-native-toast-message';

// Move setBackgroundMessageHandler outside of any component
messaging().setBackgroundMessageHandler(
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    console.log(
      'Background/quit state Notification:',
      JSON.stringify(remoteMessage),
    ); // Log message when app is in background or quit

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher', // Make sure this icon exists in your project
      },
    });
  },
);

const App: React.FC = () => {
  const navigationRef = useRef(null);
  const [appState, setAppState] = useState(AppState.currentState);

  // Create the notification channel
  useEffect(() => {
    const createNotificationChannel = async () => {
      try {
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
        console.log('Notification channel created with ID:', channelId);
      } catch (error) {
        console.error('Error creating notification channel:', error);
      }
    };

    createNotificationChannel();
  }, []);

  // Listen to AppState changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
      console.log('App State:', nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove(); // Clean up listener on unmount
    };
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:::::::::::::::::::::::::::::::::', token);
    };
    getToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  

  // Listen to foreground messages
  useEffect(() => {
    console.log('.........................................................',appState);
    
    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Foreground Notification:', JSON.stringify(remoteMessage)); // Log message when app is in foreground

        if (appState === 'active') {
          try {
            await notifee.displayNotification({
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
              android: {
                channelId: 'default',
                importance: AndroidImportance.HIGH,
                smallIcon: 'ic_launcher', // Ensure this icon exists
              },
            });
            console.log(
              'Foreground notification displayed with default sound.',
            );
          } catch (error) {
            console.error('Error displaying notification:', error);
          }
        }
      }, 
    );

    return unsubscribe; // Clean up the listener on unmount
  }, [appState]);

  // Request notification permission and get FCM token
  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Notification permission granted:', authStatus);

          // Get the FCM device token
          const token = await messaging().getToken();
          console.log('FCM Token:', token);
          // TODO: Send this token to your server for sending notifications
        } else {
          console.log('Notification permission not granted');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestUserPermission();
  }, []);

  return (
    <NavigationContainer>
      <Routes />
      <Toast />
    </NavigationContainer>
  );
};

export default App;
// App.tsx
// import React, {useRef, useEffect, useState} from 'react';
// import {AppState, AppStateStatus, Button, View} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import Routes from './route';
// import Toast from 'react-native-toast-message';
// import messaging, {
//   FirebaseMessagingTypes,
// } from '@react-native-firebase/messaging';
// import notifee, {AndroidImportance} from '@notifee/react-native';

// // Move setBackgroundMessageHandler outside of any component
// messaging().setBackgroundMessageHandler(
//   async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//     console.log(
//       'Background/quit state Notification:',
//       JSON.stringify(remoteMessage),
//     ); // Log message when app is in background or quit

//     // Display a notification
//     await notifee.displayNotification({
//       title: remoteMessage.notification?.title,
//       body: remoteMessage.notification?.body,
//       android: {
//         channelId: 'default',
//         importance: AndroidImportance.HIGH,
//         smallIcon: 'ic_launcher', // Make sure this icon exists in your project
//       },
//     });
//   },
// );

// const App: React.FC = () => {
//   const navigationRef = useRef(null);
//   const [appState, setAppState] = useState(AppState.currentState);

//   // Create the notification channel
//   useEffect(() => {
//     const createNotificationChannel = async () => {
//       try {
//         const channelId = await notifee.createChannel({
//           id: 'default',
//           name: 'Default Channel',
//           importance: AndroidImportance.HIGH,
//         });
//         console.log('Notification channel created with ID:', channelId);
//       } catch (error) {
//         console.error('Error creating notification channel:', error);
//       }
//     };

//     createNotificationChannel();
//   }, []);

//   // Listen to AppState changes
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: AppStateStatus) => {
//       setAppState(nextAppState);
//       console.log('App State:', nextAppState);
//     };

//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );

//     return () => {
//       subscription.remove(); // Clean up listener on unmount
//     };
//   }, []);

//   // Listen to foreground messages
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(
//       async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//         console.log('Foreground Notification:', JSON.stringify(remoteMessage)); // Log message when app is in foreground

//         if (appState === 'active') {
//           try {
//             await notifee.displayNotification({
//               title: remoteMessage.notification?.title,
//               body: remoteMessage.notification?.body,
//               android: {
//                 channelId: 'default',
//                 importance: AndroidImportance.HIGH,
//                 smallIcon: 'ic_launcher', // Ensure this icon exists
//               },
//             });
//             console.log(
//               'Foreground notification displayed with default sound.',
//             );
//           } catch (error) {
//             console.error('Error displaying notification:', error);
//           }
//         }
//       },
//     );

//     return unsubscribe; // Clean up the listener on unmount
//   }, [appState]);

//   // Request notification permission and get FCM token
//   useEffect(() => {
//     const requestUserPermission = async () => {
//       try {
//         const authStatus = await messaging().requestPermission();
//         const enabled =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//         if (enabled) {
//           console.log('Notification permission granted:', authStatus);

//           // Get the FCM device token
//           const token = await messaging().getToken();
//           console.log('FCM Token:', token);
//           // TODO: Send this token to your server for sending notifications
//         } else {
//           console.log('Notification permission not granted');
//         }
//       } catch (error) {
//         console.error('Error requesting notification permission:', error);
//       }
//     };

//     requestUserPermission();
//   }, []);

//   // Manual test function to trigger a test notification
//   const triggerTestNotification = async () => {
//     try {
//       await notifee.displayNotification({
//         title: 'Test Notification',
//         body: 'This is a test notification from the app.',
//         android: {
//           channelId: 'default',
//           importance: AndroidImportance.HIGH,
//           smallIcon: 'ic_launcher',
//         },
//       });
//       console.log('Test notification displayed.');
//     } catch (error) {
//       console.error('Error displaying test notification:', error);
//     }
//   };

//   return (
//     <NavigationContainer>
//       <Routes />
//       <Toast />
//       {/* Button to manually trigger a test notification */}
//       <View style={{padding: 20}}>
//         <Button
//           title="Trigger Test Notification"
//           onPress={triggerTestNotification}
//         />
//       </View>
//     </NavigationContainer>
//   );
// };

// export default App;
