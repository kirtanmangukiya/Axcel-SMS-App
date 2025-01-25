/* eslint-disable prettier/prettier */

import {
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
import React, {ComponentType, FC} from 'react';
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

const SideBarAdmin: FC<SideBarProps> = props => {
  const navigation = useNavigation();
  const {userData} = props;
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

  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${userData?.user?.photo}`;
  console.log('check the image ', userData.user.photo);
  // const imageUrl = 'https://axcel.schoolmgmtsys.com/dashboard/profileImage/1';
  const ExternalUrlScreen = () => (
    <WebView source={{ uri: 'https://axcellibrary.schoolmgmtsys.com' }} />
  );

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={{flex: 1}}>
      <Container>
        <FixedContainer>
          <AvatarContainer>
            <Avatar
              source={{uri: imageUrl}}
            />
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
            <View style={{width: '60%'}}>
              <MenuText style={styles.menuItemText}>Dashboard</MenuText>
            </View>
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
            onPress={() => {
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'CalenderScreen',
              );
              navigation.navigate('RouteCalender');
            }}>
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
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'MediaCenterScreen',
              );
            }}>
            <View style={{width: '20%'}}>
              <FontAwesome name="align-center" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Media Center</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'InvoiceScreen',
              );
              navigation.navigate('RouteInvoiceScreen');
            }}>
            <View style={{width: '20%'}}>
              <FontAwesome5
                name="file-invoice-dollar"
                size={30}
                color="#ffffff"
              />
            </View>
            <MenuText style={styles.menuItemText}>Invoice</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'DueInvoice',
              );
              navigation.navigate('RouteDueInvoiceScreen');
            }}>
            <View style={{width: '20%'}}>
              <FontAwesome5 name="file-invoice" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Due Invoice</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteCreditNotesScreen');
              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'CredentialsNotesScreen',
              );
            }}>
            <View style={{width: '20%'}}>
              <AntDesign name="creditcard" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Credit Notes</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteHomeworkScreen');

              refreshRender(
                'Navigating to RouteDashBoardScreen 1 2 4',
                'HomeWork',
              );
            }}>
            <View style={{width: '20%'}}>
              <FontAwesome name="tachometer" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Homework</MenuText>
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
              navigation.navigate('RouteParentsScreen');
              refreshRender('Navigating to  1 2 4', 'ParentsScreen');
            }}>
            <View style={{width: '20%'}}>
              <Fontisto name="persons" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Parents</MenuText>
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
              navigation.navigate('RouteBooksLibraryScreen');
              refreshRender('Navigating to  1 2 4', 'BooksLibraryScreen');
            }}>
            <View style={{width: '20%'}}>
              <Ionicons name="library" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Books Library</MenuText>
          </MenuItem2>
          <MenuItem2
  style={styles.menuItem}
  onPress={async () => {
    try {
      const token1 = await AsyncStorage.getItem('token1');
      const sessionUrl = `https://axcellibrary.schoolmgmtsys.com/`;

      console.log('Navigating to WebViewComponent with URL:', sessionUrl);
      
      // Correct navigation call
      navigation.navigate('WebViewComponent', { url: sessionUrl });
      
      // Optional debug statement or function call
      refreshRender(
        'Navigating to external website inside the app',
        'WebViewScreen'
      );
    } catch (error) {
      console.error('Error navigating to WebView:', error);
      Alert.alert(
        'Error',
        'Unable to open eLibrary. Please try again.'
      );
    }
  }}
>
  <View style={{ width: '20%' }}>
    <FontAwesome name="link" size={30} color="#ffffff" />
  </View>
  <MenuText style={styles.menuItemText}>eLibrary</MenuText>
</MenuItem2>

          <MenuItem2
            style={styles.menuItem}
            onPress={() => navigation.navigate('ExamList')}>
            <View style={{width: '20%'}}>
              <Entypo name="list" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Exams List</MenuText>
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
              refreshRender('Navigating to  1 2 4', 'GradeLevel');
              navigation.navigate('RouteGradeLevelScreen');
            }}>
            <View style={{width: '20%'}}>
              <MaterialIcons name="grade" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Grade Levels</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => navigation.navigate('RouteAssigmentScreen')}>
            <View style={{width: '20%'}}>
              <MaterialIcons name="assignment" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Assignments</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteYearScreen');
              refreshRender('Navigating to  1 2 4', 'YearScreen');
            }}>
            <View style={{width: '20%'}}>
              <MaterialIcons name="assignment" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Year</MenuText>
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
            <MenuText style={styles.menuItemText}>Transport</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RouteHostelScreen');
              refreshRender('Navigating to  1 2 4', 'HostelScreen');
            }}>
            <View style={{width: '20%'}}>
              <FontAwesome name="ioxhost" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Hostels</MenuText>
          </MenuItem2>
          <MenuItem2
            style={styles.menuItem}
            onPress={() => {
              refreshRender('Navigating to  1 2 4', 'SubjectsScreen');
              navigation.navigate('RouteSubjectsScreen');
            }}>
            <View style={{width: '20%'}}>
              <MaterialIcons name="subject" size={30} color="#ffffff" />
            </View>
            <MenuText style={styles.menuItemText}>Subjects</MenuText>
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
