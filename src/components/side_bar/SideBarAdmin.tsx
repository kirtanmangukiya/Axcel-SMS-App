/* eslint-disable prettier/prettier */

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React, {ComponentType, FC, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';
import styled from 'styled-components/native';

// Get screen dimensions
const {width, height} = Dimensions.get('window');

// Define the props for your sidebar component
interface SideBarProps extends DrawerContentComponentProps {
  userData: User;
}

interface User {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    role_perm: number;
    department: number;
    designation: number;
    activated: number;
    studentRollId: string;
    admission_number: string;
    admission_date: number;
    std_category: number;
    auth_session: string;
    birthday: number;
    gender: string;
    sector: string;
    status: string;
    address: string;
    address2: string;
    address3: string;
    phoneNo: string;
    mobileNo: string;
    studentAcademicYear: number;
    studentClass: number;
    studentSection: number;
    religion: string;
    parentProfession: any;
    parentOf: string;
    photo: string;
    isLeaderBoard: string;
    restoreUniqId: string;
    transport: string;
    transport_vehicle: string;
    hostel: string;

    user_position: string;
    defLang: number;
    defTheme: string;
    salary_type: string;
    salary_base_id: number;
    comVia: string[];

    biometric_id: string;
    library_id: string;
    account_active: number;
    updated_at: string;
    customPermissionsType: any;
    customPermissions: string;
    firebase_token: string[];
    point: number;
    lockinfeecode: string;
    otherName: string;
    role2: any;
    demeritPoint: number;
    dateupdatePoint: string;
    attendance: string;
    sportHouse: string;
  };
}

interface MenuItem {
  id: number;
  screenName: string;
  screen?: string;
}

const SideBarAdmin: FC<SideBarProps> = props => {
  const navigation = useNavigation();
  const {userData} = props;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all stored data
      await AsyncStorage.removeItem('savedEmail');
      await AsyncStorage.removeItem('savedPassword');
      Alert.alert('Success', 'Logout Successfully');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while logging out. Please try again.',
      );
    }
  };

  useEffect(() => {
    // Load menu items from AsyncStorage
    const loadMenuItems = async () => {
      try {
        const userScreensJson = await AsyncStorage.getItem('userScreens');
        if (userScreensJson) {
          const userScreens = JSON.parse(userScreensJson);
          setMenuItems(userScreens);
        }
      } catch (error) {
        console.error('Error loading menu items:', error);
      }
    };

    loadMenuItems();
  }, []);

  const isFocused = useIsFocused();
  const refreshRender = (message: string, screen: string) => {
    console.log(message, screen);
    if (isFocused) {
      // Reset the navigation stack to show Dashboard
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: screen}],
        }),
      );
    }
  };

  type IconProps = {
    name: string;
    size: number;
    color: string;
  };

  // Mapping icon types to icon components
  const iconMap: Record<string, ComponentType<IconProps>> = {
    Ionicons: Ionicons as ComponentType<IconProps>,
    AntDesign: AntDesign as ComponentType<IconProps>,
    Entypo: Entypo as ComponentType<IconProps>,
    MaterialIcons: MaterialIcons as ComponentType<IconProps>,
    FontAwesome: FontAwesome as ComponentType<IconProps>,
    FontAwesome5: FontAwesome5 as ComponentType<IconProps>,
    Fontisto: Fontisto as ComponentType<IconProps>,
  };

  // Get icon for a menu item based on screen name
  const getIconForScreen = (screenName: string) => {
    const iconMapping: Record<string, {type: string; name: string}> = {
      Dashboard: {type: 'Ionicons', name: 'home-sharp'},
      'News Board': {type: 'Entypo', name: 'news'},
      Messages: {type: 'Entypo', name: 'chat'},
      'Class Schedule': {type: 'MaterialIcons', name: 'schedule'},
      Calendar: {type: 'AntDesign', name: 'calendar'},
      Events: {type: 'Entypo', name: 'thermometer'},
      'Media Center': {type: 'FontAwesome', name: 'align-center'},
      Students: {type: 'Ionicons', name: 'person-sharp'},
      Invoice: {type: 'FontAwesome5', name: 'file-invoice-dollar'},
      'Due Invoice': {type: 'FontAwesome5', name: 'file-invoice'},
      'Credit Notes': {type: 'AntDesign', name: 'creditcard'},
      Homework: {type: 'FontAwesome', name: 'tachometer'},
      Attendance: {type: 'Entypo', name: 'spreadsheet'},
      Parents: {type: 'Fontisto', name: 'persons'},
      Teachers: {type: 'Ionicons', name: 'people'},
      'Books Library': {type: 'Ionicons', name: 'library'},
      eLibrary: {type: 'FontAwesome', name: 'link'},
      'Exams List': {type: 'Entypo', name: 'list'},
      Class: {type: 'Entypo', name: 'list'},
      'Grade Levels': {type: 'MaterialIcons', name: 'grade'},
      Assignments: {type: 'MaterialIcons', name: 'assignment'},
      Year: {type: 'MaterialIcons', name: 'assignment'},
      Transport: {type: 'MaterialIcons', name: 'emoji-transportation'},
      Hostels: {type: 'FontAwesome', name: 'ioxhost'},
      Subjects: {type: 'MaterialIcons', name: 'subject'},
      'Resource & Guide': {type: 'MaterialIcons', name: 'menu-book'},
      Logout: {type: 'Entypo', name: 'log-out'},
    };

    return iconMapping[screenName] || {type: 'MaterialIcons', name: 'circle'};
  };

  const [imageLoading, setImageLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${userData.user.id}?timestamp=${reloadKey}`;

  const handleReload = () => {
    setReloadKey(Date.now());
    setImageLoading(true);
  };

  useEffect(() => {
    if (isFocused) {
      handleReload();
    }
  }, []);

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.screenName === 'Logout') {
      handleLogout();
      return;
    }

    if (item.screen) {
      if (item.screen === 'WebViewComponent') {
        // Special handling for eLibrary
        const sessionUrl = `https://axcellibrary.schoolmgmtsys.com/`;
        navigation.navigate('WebViewComponent', {url: sessionUrl} as never);
      } else {
        refreshRender(`Navigating to ${item.screen}`, item.screen);
        navigation.navigate(item.screen as never);
      }
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const iconInfo = getIconForScreen(item.screenName);
    const IconComponent = iconMap[iconInfo.type];

    return (
      <MenuItem2 key={item.id} onPress={() => handleMenuItemPress(item)}>
        <View style={{width: '20%'}}>
          <IconComponent name={iconInfo.name} size={30} color="#ffffff" />
        </View>
        <View style={{width: '60%'}}>
          <MenuText style={styles.menuItemText}>{item.screenName}</MenuText>
        </View>
      </MenuItem2>
    );
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={{flex: 1}}>
      <Container>
        <FixedContainer>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AvatarContainer>
              {imageLoading && (
                <ActivityIndicator
                  size="small"
                  color="#333"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    zIndex: 1,
                    transform: [{translateX: -10}, {translateY: -10}],
                  }}
                />
              )}
              <Avatar
                key={reloadKey}
                source={{
                  uri: imageUrl,
                  cache: 'reload',
                  headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                  },
                }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            </AvatarContainer>
            <TouchableOpacity onPress={handleReload} style={{marginLeft: 10}}>
              <MaterialIcons name="refresh" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <UserInfo>
            <UserNameContainer>
              <UserName>{userData.user.fullName}</UserName>
              <TouchableOpacity onPress={() => handleLogout()}>
                <Entypo name="log-out" size={width * 0.05} color="white" />
              </TouchableOpacity>
            </UserNameContainer>
            <NicknameContainer>
              <Nickname>{userData.user.username}</Nickname>
            </NicknameContainer>
          </UserInfo>
          <Divider />
        </FixedContainer>

        <ScrollView style={styles.menuItems}>
          {menuItems.length > 0 ? (
            menuItems.map(item => renderMenuItem(item))
          ) : (
            // Fallback menu items if dynamic list is not available
            <>
              <MenuItem2
                onPress={() => {
                  refreshRender(
                    'Navigating to RouteDashBoardScreen',
                    'Dashboard',
                  );
                  navigation.navigate('RouteDashBoardScreen');
                }}>
                <View style={{width: '20%'}}>
                  <Ionicons name="home-sharp" size={30} color="#ffffff" />
                </View>
                <View style={{width: '60%'}}>
                  <MenuText style={styles.menuItemText}>Dashboard</MenuText>
                </View>
              </MenuItem2>

              <MenuItem2 style={styles.menuItem} onPress={() => handleLogout()}>
                <View style={{width: '20%'}}>
                  <Entypo name="log-out" size={30} color="#ffffff" />
                </View>
                <MenuText style={styles.menuItemText}>Logout</MenuText>
              </MenuItem2>
            </>
          )}
        </ScrollView>
      </Container>
    </ImageBackground>
  );
};

export default SideBarAdmin;

const Container = styled.View`
  flex: 1;
  /* background-color: #ffffff; */
`;

const FixedContainer = styled.View`
  padding: ${height * 0.01}px ${width * 0.05}px 0px ${width * 0.05}px;
  /* background-color: #ffffff; */
`;

const Divider = styled.View`
  width: 100%;
  height: 1.5px;
  margin: ${height * 0.02}px 0;
  background-color: white;
`;

const UserInfo = styled.View`
  margin-top: ${height * 0.01}px;
`;

const UserNameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const NicknameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserName = styled.Text`
  font-size: ${width * 0.04}px;
  color: white;
  font-weight: bold;
`;

const Nickname = styled.Text`
  font-size: ${width * 0.03}px;
  color: white;
`;

const AvatarContainer = styled.View`
  height: ${width * 0.15}px;
  width: ${width * 0.15}px;
  border-radius: ${width * 0.075}px;
  overflow: hidden;
  background-color: #ffffff;
  margin: ${height * 0.01}px 0;
  border: ${width * 0.01}px solid white;
`;

const Avatar = styled.Image`
  height: 100%;
  width: 100%;
`;

const MenuItem2 = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: '100%';

  padding: 15px;
  border-radius: 10px;
  /* background-color: red; */
  margin-bottom: 10px;
`;

const MenuText = styled.Text`
  /* font-size: ${width * 0.1}px; */
  font-weight: bold;
  color: white;
  /* margin-left: ${width * 0.05}px; */
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    // paddingVertical: 15,
    // paddingHorizontal: 10,
    // paddingRight: '20%',
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
  },
});
