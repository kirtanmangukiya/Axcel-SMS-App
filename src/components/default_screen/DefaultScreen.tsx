import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

const DefaultScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const getDeviceToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Device Token:', token);
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      getDeviceToken();

      const timeout = setTimeout(() => {
        navigation.navigate('RouteEventsScreen', {refresh: true});
      }, 1000);

      return () => clearTimeout(timeout); // Cleanup the timeout when component unmounts or navigation focus changes
    });

    return unsubscribe; // Unsubscribe when component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>DefaultScreen</Text>
    </View>
  );
};

export default DefaultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
