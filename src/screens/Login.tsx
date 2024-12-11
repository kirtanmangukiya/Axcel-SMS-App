import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {LoginResponse, MainStackParamList} from '../types';
import React, {useCallback, useEffect, useState} from 'react';
import {
  deviceToken,
  initializeAuthToken,
  login,
  notificationData,
} from '../config/axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'Login'
>;

interface Account {
  username: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [storedAccounts, setStoredAccounts] = useState<Account[]>([]);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible(prevState => !prevState);
  }, []);

  useEffect(() => {
    const getDeviceToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Device Token:', token);
        setFcmToken(token);
        // const response = await deviceToken({deviceToken: token});
        // setFcmToken(response);
        // console.log('Device token update response:', response);
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    };

    getDeviceToken();
  }, []);

  // console.log('check the token ----------------', fcmToken);

  useEffect(() => {
    requestUserPermission();

    loadStoredAccounts();

    // return messaging().onTokenRefresh(token => {
    //   setFcmToken(token);
    // });
  }, []);
  const openPrivacyPolicy = () => {
    Linking.openURL('https://axcel.schoolmgmtsys.com/policyAxcel.html');
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const loadStoredAccounts = async () => {
    const storedData = await AsyncStorage.getItem('loginAccounts');
    if (storedData) {
      setStoredAccounts(JSON.parse(storedData));
      // Show the modal only if there are stored accounts
      if (JSON.parse(storedData).length > 0) {
        setShowModal(true);
      }
    }
  };

  const saveAccount = async (account: Account) => {
    let accounts = storedAccounts;

    // Remove duplicate entries
    accounts = accounts.filter(acc => acc.username !== account.username);

    // Add the new account at the start
    accounts.unshift(account);

    // Keep only the last 3 accounts
    if (accounts.length > 3) {
      accounts = accounts.slice(0, 3);
    }

    setStoredAccounts(accounts);
    await AsyncStorage.setItem('loginAccounts', JSON.stringify(accounts));
  };

  const handleLoginPress = async () => {
    setLoading(true);

    try {
      const response = await login(
        username.toLowerCase(),
        password.toLowerCase(),
        fcmToken,
      );

      await AsyncStorage.setItem('loginData', JSON.stringify(response));
      saveAccount({username, password});

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Login Successful',
        text2: 'You have successfully logged in.',
        visibilityTime: 4000,
      });
      notificationData();

      await initializeAuthToken();
      navigation.navigate('Splash');

      setUsername('');
      setPassword('');
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Login Failed',
        text2:
          error instanceof Error ? error.message : 'An unknown error occurred',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSelect = (account: Account) => {
    setUsername(account.username);
    setPassword(account.password);
    setShowModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground
          source={require('../assest/icons/background.jpg')}
          style={styles.backgroundImage}>
          <View style={styles.overlay}>
            <Image
              source={require('../assest/icons/transparentlogo-removebg-preview.png')}
              style={styles.logo}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Axcel International School</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="person-outline"
                size={24}
                color="white"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Username / Admission No"
                placeholderTextColor="white"
                onFocus={() => setShowModal(true)}
                onChangeText={setUsername}
                value={username}
              />
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon
                  name={
                    isPasswordVisible
                      ? 'lock-open-outline'
                      : 'lock-closed-outline'
                  }
                  size={24}
                  color="white"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="white"
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
                value={password}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginPress}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.footer}
            onPress={() => openPrivacyPolicy()}>
            <Text style={styles.footerText}>Privacy Policy</Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>

      {/* Show modal only if there are stored accounts */}
      {storedAccounts.length > 0 && (
        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={storedAccounts}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleAccountSelect(item)}>
                    <Image
                      source={require('../assest/icons/transparentlogo-removebg-preview.png')}
                      style={styles.dropdownIcon}
                    />
                    <View style={styles.dropdownTextContainer}>
                      <Text style={styles.dropdownText}>{item.username}</Text>
                      <Text style={styles.dropdownText}>••••••••</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    paddingVertical: windowHeight * 0.15,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  titleContainer: {
    marginVertical: 20,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: windowWidth < 400 ? 24 : 25,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    padding: 4,
    marginBottom: 15,
    borderRadius: 10,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: 'white',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  dropdownIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  dropdownTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownText: {
    color: 'black',
    fontSize: 16,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    padding: 9,
    backgroundColor: '#2d7ca3',
    // borderRadius: 10,
    marginTop: '5%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    maxHeight: 300,
    padding: 20,
  },
});

export default LoginScreen;
