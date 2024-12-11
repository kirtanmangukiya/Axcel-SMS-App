// src/route/DrawerRoutes.tsx

import {RouteProp, useNavigation} from '@react-navigation/native';

import ClassScreen from '../screens/class/ClassScreen';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import ExamList from '../screens/Exam_List/ExamList';
import LoginScreen from '../screens/Login';
import {MainStackParamList} from '../types';
import MediaCenterScreen from '../screens/MediaCenterScreen';
import OnlineExam from '../screens/online_exam/OnlineExam';
import PdfShowComponent2 from '../components/pdf_show_component/PdfShowComponent2';
import React from 'react';
import RouteAssigmentScreen from './routeScreen/RouteAssignmnetScreen';
import RouteAttendenceScreen from './routeScreen/RouteAttendenceScreen';
import RouteBooksLibraryScreen from './routeScreen/RouteBooksLibraryScreen';
import RouteCalender from './routeScreen/RouteCalender';
import RouteClassSchdule from './routeScreen/RouteClassSchdule';
import RouteClassScreen from './routeScreen/RoutClassScreen';
import RouteCreditNotesScreen from './routeScreen/RouteCreditNotesScreen';
import RouteDashBoardScreen from './routeScreen/RouteDashBoardScreen';
import RouteDueInvoiceScreen from './routeScreen/RouteDueInvoiceScreen';
import RouteEventsScreen from './routeScreen/RouteEventsScreen';
import RouteExternalUrlScreen from './routeScreen/RouteExternalUrlScreen';
import RouteGradeLevelScreen from './routeScreen/RouteGradeLevelScreen';
import RouteHomeworkScreen from './routeScreen/RouteHomeworkScreen';
import RouteHostelScreen from './routeScreen/RouteHostelScreen';
import RouteInvoiceScreen from './routeScreen/RouteInvoiceScreen';
import RouteMediaCenter from './routeScreen/RouteMediaCenter';
import RouteMessage from './routeScreen/RouteMessage';
import RouteNewsBoardScreen from './routeScreen/RouteNewsBoardScreen';
import RouteParentsScreen from './routeScreen/RouteParentsScreen';
import RouteResourceAndGuideScreen from './routeScreen/RouteResourceAndGuideScreen';
import RouteStudentScreen from './routeScreen/RouteStudentScreen';
import RouteSubjectsScreen from './routeScreen/RouteSubjectsScreen';
import RouteTeachersScreen from './routeScreen/RouteTeachersScreen';
import RouteTransportScreen from './routeScreen/RouteTransportScreen';
import RouteYearScreen from './routeScreen/RouteYearScreen';
import SideBarAdmin from '../components/side_bar/SideBarAdmin';
import SideBarEmployee from '../components/side_bar/SideBarEmployee';
import SideBarParent from '../components/side_bar/SideBarParent';
import SideBarStudent from '../components/side_bar/SideBarStudent';
import SideBarTeacher from '../components/side_bar/SideBarTeacher';
import SplashScreen from '../screens/SplashScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator<MainStackParamList>();

type DrawerRoutesProps = {
  route: RouteProp<MainStackParamList, 'DrawerRoutes'>;
  navigation: DrawerNavigationProp<MainStackParamList, 'DrawerRoutes'>;
};

const DrawerRoutes: React.FC<DrawerRoutesProps> = ({route}) => {
  const moduleType = route?.params?.moduleType || 'default';
  const userData = route?.params?.userData || {};

  return (
    <Drawer.Navigator
      name="MainStack"
      initialRouteName="RouteDashBoardScreen"
      drawerContent={props => {
        switch (moduleType) {
          case 'student':
            return <SideBarStudent {...props} userData={userData} />;
          case 'parent':
            return <SideBarParent {...props} userData={userData} />;
          case 'teacher':
            return <SideBarTeacher {...props} userData={userData} />;
          case 'admin':
            return <SideBarAdmin {...props} userData={userData} />;
          case 'employee':
            return <SideBarEmployee {...props} userData={userData} />;
          default:
            return null;
        }
      }}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Drawer.Screen
        name="RouteDashBoardScreen"
        component={RouteDashBoardScreen}
      />
      <Drawer.Screen
        name="RouteNewsBoardScreen"
        component={RouteNewsBoardScreen}
      />

      <Drawer.Screen name="RouteEventsScreen" component={RouteEventsScreen} />
      <Drawer.Screen name="RouteClassSchdule" component={RouteClassSchdule} />

      <Drawer.Screen name="RouteStudentScreen" component={RouteStudentScreen} />
      <Drawer.Screen name="RouteInvoiceScreen" component={RouteInvoiceScreen} />
      <Drawer.Screen name="RouteMessage" component={RouteMessage} />
      <Drawer.Screen
        name="RouteDueInvoiceScreen"
        component={RouteDueInvoiceScreen}
      />
      <Drawer.Screen
        name="RouteHomeworkScreen"
        component={RouteHomeworkScreen}
      />
      <Drawer.Screen
        name="RouteAttendenceScreen"
        component={RouteAttendenceScreen}
      />
      <Drawer.Screen name="RouteParentsScreen" component={RouteParentsScreen} />
      <Drawer.Screen
        name="RouteTeachersScreen"
        component={RouteTeachersScreen}
      />
      <Drawer.Screen
        name="RouteBooksLibraryScreen"
        component={RouteBooksLibraryScreen}
      />
      <Drawer.Screen
        name="RouteExternalUrlScreen"
        component={RouteExternalUrlScreen}
      />
      <Drawer.Screen name="RouteYearScreen" component={RouteYearScreen} />
      <Drawer.Screen
        name="RouteGradeLevelScreen"
        component={RouteGradeLevelScreen}
      />
      <Drawer.Screen
        name="RouteAssigmentScreen"
        component={RouteAssigmentScreen}
      />
      <Drawer.Screen
        name="RouteTransportScreen"
        component={RouteTransportScreen}
      />
      <Drawer.Screen name="RouteHostelScreen" component={RouteHostelScreen} />
      <Drawer.Screen
        name="RouteSubjectsScreen"
        component={RouteSubjectsScreen}
      />
      <Drawer.Screen name="ExamList" component={ExamList} />
      <Drawer.Screen name="OnlineExam" component={OnlineExam} />
      <Drawer.Screen name="RouteClassScreen" component={RouteClassScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />

      <Drawer.Screen name="Splash" component={SplashScreen} />
      
      <Drawer.Screen
        name="RouteResourceAndGuideScreen"
        component={RouteResourceAndGuideScreen}
      />
      <Drawer.Screen
        name="RouteCreditNotesScreen"
        component={RouteCreditNotesScreen}
      />
      {/* <Drawer.Screen name="ShowDataScreen" component={ShowDataScreen} /> */}
      <Drawer.Screen name="RouteCalender" component={RouteCalender} />
      <Drawer.Screen name="RouteMediaCenter" component={RouteMediaCenter} />
     
    </Drawer.Navigator>
  );
};

export default DrawerRoutes;
