/* eslint-disable prettier/prettier */
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React, {ComponentType, FC} from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {MainStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
const {width, height} = Dimensions.get('window');

// Define the props for your sidebar component
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
    medical: MedicalInfo;
    user_position: string;
    defLang: number;
    defTheme: string;
    salary_type: string;
    salary_base_id: number;
    comVia: string[];
    father_info: FatherInfo;
    mother_info: MotherInfo;
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

interface FatherInfo {
  name: string;
  mobile: string;
  job: string;
  notes: string;
  email: string;
  emergency: string;
}

interface MedicalInfo {
  inspol: string;
  blood_group: string;
  weight: string;
  height: string;
  disab: string;
  contact: string;
}

interface MotherInfo {
  name: string;
  mobile: string;
  job: string;
  notes: string;
  email: string;
  erelationship: string;
}

// Define the props for your sidebar component
interface SideBarProps extends DrawerContentComponentProps {
  userData: User;
}

const SideBarEmployee: FC<SideBarProps> = props => {
  type StackScreenNavigate = NativeStackNavigationProp<
    MainStackParamList,
    'SideBarEmployee'
  >;
  const navigation = useNavigation<StackScreenNavigate>();
  const {userData} = props;

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all data from AsyncStorage
      // AUTH_TOKEN = null; // Clear the in-memory token
      Alert.alert('Success', 'Logout successfully');
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      console.error('Failed to clear AsyncStorage on logout:', error);
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

  const menuItems = [
    {
      name: 'Dashboard',
      iconType: 'Ionicons',
      icon: 'home-sharp',
      screen: 'RouteDashBoardScreen',
      params: {userId: 1},
    },
    {
      name: 'News Board',
      iconType: 'Entypo',
      icon: 'news',
      screen: 'RouteNewsBoardScreen',
      params: {category: 'news'},
    },
    {
      name: 'Message',
      iconType: 'Entypo',
      icon: 'chat',
      screen: 'MessageScreen',
      params: {conversationId: 42},
    },
    {
      name: 'Calendar',
      iconType: 'AntDesign',
      icon: 'calendar',
      screen: 'CalenderScreen',
      params: {view: 'month'},
    },
    {
      name: 'Events',
      iconType: 'Entypo',
      icon: 'thermometer',
      screen: 'RouteEventsScreen',
      params: {type: 'upcoming'},
    },
    {
      name: 'Logout',
      iconType: 'MaterialIcons',
      icon: 'logout',
      screen: 'LogoutScreen',
      params: {confirmation: true},
      onPress: handleLogout,
    },
  ];

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

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={{flex: 1}}>
      <Container>
        <FixedContainer>
          <AvatarContainer>
            <Avatar source={require('../../assest/icons/download.jpg')} />
          </AvatarContainer>
          <UserInfo>
            <UserNameContainer>
              <UserName>{userData.user.username}</UserName>
              {/* <Icon name="md-person" size={20} color="#f00a0a" /> */}
            </UserNameContainer>
            <NicknameContainer>
              <Nickname>{userData.user.username}</Nickname>
              {/* <Icon name="md-log-out" size={20} color="#f00a0a" /> */}
            </NicknameContainer>
          </UserInfo>
          <Divider />
        </FixedContainer>
        <ScrollView style={styles.menuItems}>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'Dashboard',
              );
              navigation.navigate('RouteDashBoardScreen');
            }}>
            <View style={{width: '20%'}}>
              <Ionicons name="home-sharp" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Dashboard</MenuText>
          </MenuItem2>

          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'NewsBoard',
              );
              navigation.navigate('RouteNewsBoardScreen');
            }}>
            <View style={{width: '20%'}}>
              <Entypo name="news" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>News Board</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteMessage');
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'MessageScreen',
              );
            }}>
            <View style={{width: '20%'}}>
              <Entypo name="chat" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Messages</MenuText>
          </MenuItem2>

          <MenuItem2
            style={styles.menuItem}
            onPress={() => navigation.navigate('CalenderScreen')}>
            <View style={{width: '20%'}}>
              <AntDesign name="calendar" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Calender</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteEventsScreen');
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'EventsScreen',
              );
            }}>
            <View style={{width: '20%'}}>
              <Entypo name="thermometer" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Events</MenuText>
          </MenuItem2>
          <MenuItem2 style={styles.menuItem} onPress={() => handleLogout()}>
            <View style={{width: '20%'}}>
              <MaterialIcons name="subject" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Logout</MenuText>
          </MenuItem2>
        </ScrollView>
      </Container>
    </ImageBackground>
  );
};

export default SideBarEmployee;
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    paddingRight: '20%',
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

const Container = styled.View`
  flex: 1;
  /* background-color: #ffffff; */
`;
const MenuItem2 = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  /* background-color: #ffffff; */
  margin-bottom: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const MenuText = styled.Text`
  /* font-size: ${width * 0.1}px; */
  font-weight: bold;
  color: white;
  margin-left: ${width * 0.05}px;
`;

const FixedContainer = styled.View`
  padding: 10px 20px 0px 20px;
  /* background-color: #ffffff; */
`;

const Divider = styled.View`
  width: 100%;
  height: 1.5px;
  margin: 15px 0;
  background-color: white;
`;

const UserInfo = styled.View`
  margin-top: 10px;
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

const Button = styled.TouchableOpacity`
  padding: 2px;
  margin-bottom: 5px;
`;

const UserName = styled.Text`
  font-size: 16px;
  color: white;
  font-weight: bold;
`;

const Nickname = styled.Text`
  font-size: 12px;
  color: white;
`;

const AvatarContainer = styled.View`
  height: 56px;
  width: 56px;
  border-radius: 28px;
  overflow: hidden;
  background-color: #ffffff;
  margin: 10px 0;
  border: 5px solid white;
`;

const Avatar = styled.Image`
  height: 100%;
  width: 100%;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  margin-bottom: 15px; /* Increased vertical space between items */
`;
