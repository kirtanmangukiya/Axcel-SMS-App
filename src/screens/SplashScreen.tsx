import {
  BackHandler,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { MainStackParamList } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { deviceToken } from '../config/axios';
import messaging from '@react-native-firebase/messaging'; // Ensure you have this installed
import { useFocusEffect } from '@react-navigation/native';

const SplashScreen: React.FC = React.memo(() => {
  type StackScreenNavigate = NativeStackNavigationProp<
    MainStackParamList,
    'Splash'
  >;

  type SplashResultRouteProp = RouteProp<MainStackParamList, 'Splash'>;
  const navigation = useNavigation<StackScreenNavigate>();
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  console.log(route.params);

  const checkInternetAndFetchToken = useCallback(async () => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Bad network connection',
      });
      setIsLoading(false);
      return;
    }

    try {
      const tokenString = await AsyncStorage.getItem('loginData');
      console.log(tokenString);

      if (tokenString) {
        const token = JSON.parse(tokenString);
        if (token.user && token.user.role) {
          navigation.navigate('DrawerRoutes', {
            moduleType: token?.user?.role,
            userData: token,
          });
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error retrieving or parsing token:', error);
      navigation.navigate('Login');
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      checkInternetAndFetchToken();

      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => {
        backHandler.remove();
      };
    }, [checkInternetAndFetchToken]),
  );

  useEffect(() => {
    const getDeviceToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Device Token:', token);
        const response = await deviceToken({ deviceToken: token });
        console.log('Device token update response:', response);
      } catch (error) {
        console.error('Failed to get FCM token000000000000000000000000:', error);
      }
    };

    getDeviceToken();
  }, []);

  if (isLoading) {
    return (
      <ImageBackground
        style={styles.loadingContainer}
        source={require('../assest/icons/SideBarBg.jpg')}>
        <ActivityIndacatorr />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assest/icons/transparentlogo-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.schoolName}>Axcel International School</Text>
      </View>
      <LottieView
        source={require('../assest/splashWave.json')}
        autoPlay
        loop={true}
        style={styles.lottie}
      />
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 110,
  },
  schoolName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
  },
  lottie: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 100,
    height: 100,
  },
});

export default SplashScreen;
