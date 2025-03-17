import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
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

const LoginScreen: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

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
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    };

    getDeviceToken();
  }, []);

  useEffect(() => {
    requestUserPermission();
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

  const handleLoginPress = async () => {
    setLoading(true);

    try {
      const response = await login(
        username.toLowerCase(),
        password.toLowerCase(),
        fcmToken,
      );

      // Generate screen list here where response is available
      const userScreens = getScreenList(
        response?.user?.customPermissions || [],
        response?.user?.role?.toLowerCase() || 'student'
      );

      console.log('getMenuTitles screens', userScreens);
      console.log(
        'Available Screen Names:',
        userScreens.map(screen => screen.screenName)
      );

      // Store the screen list for use in the sidebar
      await AsyncStorage.setItem('userScreens', JSON.stringify(userScreens));

      // Set the token1 and level values
      const randomNum =
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      const token = `XYZGHIJKJHHHHH${randomNum}XYZGHIJKJHHHHH`;
      await AsyncStorage.setItem('token1', token);

      let userLevel = 'B'; // Default value
      if (response?.user?.sector?.toLowerCase() === 'secondary') {
        userLevel = 'S';
      } else if (response?.user?.sector?.toLowerCase() === 'primary') {
        userLevel = 'P';
      }
      await AsyncStorage.setItem('lev', userLevel);
      console.log('loginData-->', JSON.stringify(response));

      // Store login data for use in other screens
      await AsyncStorage.setItem('loginData', JSON.stringify(response));

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

  function getScreenList(role_permissions: string | string[], role: string) {
    const menuArray = [];

    // Default screens (no condition, always append)
    menuArray.push({
      id: 1,
      screenName: 'Dashboard',
      screen: 'RouteDashBoardScreen',
    });

    // Check for role permissions and add corresponding screens
    if (
      role_permissions.includes('newsboard.list') ||
      role_permissions.includes('newsboard.View')
    ) {
      menuArray.push({
        id: 2,
        screenName: 'News Board',
        screen: 'RouteNewsBoardScreen',
      });
    }

    menuArray.push({
      id: 47,
      screenName: 'Messages',
      screen: 'RouteMessage',
    });

    if (role_permissions.includes('classSch.list')) {
      menuArray.push({
        id: 4,
        screenName: 'Class Schedule',
        screen: 'RouteClassSchdule',
      });
    }

    menuArray.push({
      id: 66,
      screenName: 'Calendar',
      screen: 'RouteCalender',
    });

    if (
      role_permissions.includes('events.list') ||
      role_permissions.includes('events.View')
    ) {
      menuArray.push({
        id: 3,
        screenName: 'Events',
        screen: 'RouteEventsScreen',
      });
    }

    if (role_permissions.includes('mediaCenter.View')) {
      menuArray.push({
        id: 22,
        screenName: 'Media Center',
        screen: 'RouteMediaCenter',
      });
    }

    // Check for Student Role
    if (role !== 'student') {
      menuArray.push({
        id: 17,
        screenName: 'Students',
        screen: 'RouteStudentScreen',
      });
    }

    if (
      role_permissions.includes('Invoices.list') ||
      role_permissions.includes('Invoices.View')
    ) {
      menuArray.push({
        id: 19,
        screenName: 'Invoices',
        screen: 'RouteInvoiceScreen',
      });
    }

    if (role_permissions.includes('Invoices.dueInvoices')) {
      menuArray.push({
        id: 19,
        screenName: 'Due Invoices',
        screen: 'RouteDueInvoiceScreen',
      });
    }

    if (
      role_permissions.includes('Invoices2.list') ||
      role_permissions.includes('Invoices2.View')
    ) {
      menuArray.push({
        id: 51,
        screenName: 'Credit Notes',
        screen: 'RouteCreditNotesScreen',
      });
    }

    // Role-specific Attendance logic
    if (role === 'student') {
      if (
        role_permissions.includes('myAttendance.myAttendance') ||
        role_permissions.includes('students.Attendance')
      ) {
        menuArray.push({
          id: 6,
          screenName: 'Attendance',
          screen: 'RouteAttendenceScreen',
        });
      }
    } else if (role_permissions.includes('parent')) {
      if (
        role_permissions.includes('myAttendance.myAttendance') ||
        role_permissions.includes('students.Attendance')
      ) {
        menuArray.push({
          id: 7,
          screenName: 'Attendance',
          screen: 'RouteAttendenceScreen',
        });
      }
    } else {
      if (role_permissions.includes('Attendance.takeAttendance')) {
        menuArray.push({
          id: 8,
          screenName: 'Attendance',
          screen: 'RouteAttendenceScreen',
        });
      }
    }

    // Admin-specific
    if (role === 'admin') {
      menuArray.push({
        id: 9,
        screenName: 'Staff Attendance',
        screen: 'RouteAttendenceScreen', // Assuming this uses the same screen
      });
    }

    if (role_permissions.includes('parents.list')) {
      menuArray.push({
        id: 18,
        screenName: 'Parents',
        screen: 'RouteParentsScreen',
      });
    }

    if (role_permissions.includes('teachers.list')) {
      menuArray.push({
        id: 16,
        screenName: 'Teachers',
        screen: 'RouteTeachersScreen',
      });
    }

    if (role_permissions.includes('Library.list')) {
      menuArray.push({
        id: 10,
        screenName: 'Books Library',
        screen: 'RouteBooksLibraryScreen',
      });
    }

    if (role_permissions.includes('staticPages.list')) {
      menuArray.push({
        id: 5,
        screenName: 'Static Pages',
        screen: 'RouteResourceAndGuideScreen', // Assuming this is the equivalent
      });
    }

    if (
      role_permissions.includes('Homework.list') ||
      role_permissions.includes('Homework.View')
    ) {
      menuArray.push({
        id: 40,
        screenName: 'Homework',
        screen: 'RouteHomeworkScreen',
      });
    }

    if (role_permissions.includes('Assignments.list')) {
      menuArray.push({
        id: 11,
        screenName: 'Assignments',
        screen: 'RouteAssigmentScreen',
      });
    }

    if (role_permissions.includes('studyMaterial.list')) {
      menuArray.push({
        id: 12,
        screenName: 'Study Material',
        screen: 'RouteResourceAndGuideScreen', // Assuming this is the equivalent
      });
    }

    if (
      role_permissions.includes('examsList.list') ||
      role_permissions.includes('examsList.View')
    ) {
      menuArray.push({
        id: 13,
        screenName: 'Exams List',
        screen: 'ExamList',
      });
    }

    if (role_permissions.includes('onlineExams.list')) {
      menuArray.push({
        id: 15,
        screenName: 'Online Exams',
        screen: 'OnlineExam',
      });
    }

    if (role_permissions.includes('Hostel.list')) {
      menuArray.push({
        id: 21,
        screenName: 'Hostel',
        screen: 'RouteHostelScreen',
      });
    }

    if (role_permissions.includes('classes.list')) {
      menuArray.push({
        id: 23,
        screenName: 'Classes',
        screen: 'RouteGradeLevelScreen', // Based on DrawerRoutes.tsx
      });
      menuArray.push({
        id: 48,
        screenName: 'Class',
        screen: 'RouteClassScreen',
      });
    }

    if (role_permissions.includes('Transportation.list')) {
      menuArray.push({
        id: 20,
        screenName: 'Transportation',
        screen: 'RouteTransportScreen',
      });
    }

    if (role_permissions.includes('Subjects.list')) {
      menuArray.push({
        id: 24,
        screenName: 'Subjects',
        screen: 'RouteSubjectsScreen',
      });
    }

    // Add Year screen for admin
    if (role === 'admin') {
      menuArray.push({
        id: 50,
        screenName: 'Year',
        screen: 'RouteYearScreen',
      });
    }

    // Add Resource & Guide for all
    menuArray.push({
      id: 25,
      screenName: 'Resource & Guide',
      screen: 'RouteResourceAndGuideScreen',
    });

    // Always include the Logout option
    menuArray.push({
      id: 26,
      screenName: 'Logout',
      screen: 'Logout', // Special handling in the sidebar
    });

    console.log('Menu Array List:', menuArray);
    return menuArray;
  }

  // const userScreens = getScreenList(
  //   response?.roles[0].role_permissions,
  //   response?.roles[0].def_for,
  // );

  // console.log('getMenuTitles screens', userScreens);
  // console.log(
  //   'Available Screen Names:',
  //   userScreens.map(screen => screen.screenName),
  // );

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
  button: {
    width: '100%',
    maxWidth: 400,
    padding: 9,
    backgroundColor: '#2d7ca3',
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
});

export default LoginScreen;
