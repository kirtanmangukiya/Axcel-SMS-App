/* eslint-disable prettier/prettier */
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React, {ComponentType, FC} from 'react';
import {
  Alert,
  View,
  Dimensions,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';

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

const SideBarAdmin: FC<SideBarProps> = props => {
  const {userData} = props;
  const navigation = useNavigation();
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loginData');
      Alert.alert('Success', 'User successfully logged out');
      props.navigation.navigate('Login'); // Navigate to login screen after logout
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while logging out. Please try again.',
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
      name: 'Calendar',
      iconType: 'AntDesign',
      icon: 'calendar',
      screen: 'CalenderScreen',
      params: {view: 'month'},
    },
    {
      name: 'Class Schedule',
      iconType: 'MaterialIcons',
      icon: 'schedule',
      screen: 'ClassSchedule',
      params: {scheduleId: 2},
    },
    {
      name: 'Message',
      iconType: 'Entypo',
      icon: 'chat',
      screen: 'MessageScreen',
      params: {conversationId: 42},
    },

    {
      name: 'Events',
      iconType: 'Entypo',
      icon: 'thermometer',
      screen: 'RouteEventsScreen',
      params: {type: 'upcoming'},
    },
    {
      name: 'Media Center',
      iconType: 'FontAwesome',
      icon: 'align-center',
      screen: 'MediaCenterScreen',
      params: {mediaType: 'video'},
    },
    {
      name: 'Students',
      iconType: 'Ionicons',
      icon: 'person-sharp',
      screen: 'RouteStudentScreen',
      params: {mediaType: 'video'},
    },
    {
      name: 'Attendence',
      iconType: 'Entypo',
      icon: 'spreadsheet',
      screen: 'AttendenceScreen',
      params: {noteId: 5},
    },
    {
      name: 'Teachers',
      iconType: 'Ionicons',
      icon: 'people',
      screen: 'RouteTeachersScreen',
      params: {libraryId: 3},
    },
    {
      name: 'Year',
      iconType: 'Entypo',
      icon: 'time-slot',
      screen: 'RouteYearScreen',
      params: {libraryId: 3},
    },
    {
      name: 'Class',
      iconType: 'Entypo',
      icon: 'time-slot',
      screen: 'ClassScreen',
      params: {libraryId: 3},
    },

    {
      name: 'Transport',
      iconType: 'MaterialIcons',
      icon: 'emoji-transportation',
      screen: 'RouteTransportScreen',
      params: {libraryId: 3},
    },
    {
      name: 'Resource / Guide',
      iconType: 'FontAwesome5',
      icon: 'vector-square',
      screen: 'RouteResourceAndGuideScreen',
      params: {libraryId: 3},
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
            onPress={() => {
              navigation.navigate('RouteClassSchdule');
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'RouteClassSchdule',
              );
            }}>
            <View style={{width: '20%'}}>
              <MaterialIcons name="schedule" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Class Schedule</MenuText>
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
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteMediaCenter');
            }}>
            <View style={{width: '20%'}}>
              <FontAwesome name="align-center" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Media Center</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteStudentScreen');
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'StudentScreen',
              );
            }}>
            <View style={{width: '20%'}}>
              <Ionicons name="person-sharp" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Students</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteAttendenceScreen');
              refreshRender('Navigating to  1 2 4', 'AttendenceScreen');
            }}>
            <View style={{width: '20%'}}>
              <Entypo name="spreadsheet" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Attendence</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteTeachersScreen');
              refreshRender('Navigating to  1 2 4', 'TeachersScreen');
            }}>
            <View style={{width: '20%'}}>
              <Ionicons name="people" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Teachers</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender('Navigating to  1 2 4', 'YearScreen');
              navigation.navigate('RouteYearScreen');
            }}>
            <View style={{width: '20%'}}>
              <Fontisto name="persons" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Year</MenuText>
          </MenuItem2>

          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender('Navigating to  1 2 4', 'ClassScreen');
              navigation.navigate('RouteClassScreen');
            }}>
            <View style={{width: '20%'}}>
              <Entypo name="list" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Class</MenuText>
          </MenuItem2>

          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender('Navigating to  1 2 4', 'TransportScreen');
              navigation.navigate('RouteTransportScreen');
            }}>
            <View style={{width: '20%'}}>
              <MaterialIcons
                name="emoji-transportation"
                size={30}
                color="#ffffff"
              />
            </View>
            <MenuText style={styles.menuItemText}>Transportation</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'ResourceAndGuide',
              );
              navigation.navigate('RouteResourceAndGuideScreen');
            }}>
            <View style={{width: '20%'}}>
              <FontAwesome5 name="vector-square" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Resource / Guide</MenuText>
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

const Avatar = styled.Image`
  height: 100%;
  width: 100%;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${height * 0.01}px;
  margin-bottom: ${height * 0.015}px;
`;

const MenuText = styled.Text`
  font-size: ${width * 0.05}px;
  font-weight: bold;
  color: white;
  margin-left: ${width * 0.05}px;
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
