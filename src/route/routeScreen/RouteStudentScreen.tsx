import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import YearScreen from '../../screens/Year/YearScreen';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import SubjectsScreen from '../../screens/subjects/SubjectsScreen';
import HostelScreen from '../../screens/hostel/HostelScreen';
import StudentScreen from '../../screens/StudentScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import ShowDataScreen from '../../components/show_data_component/ShowDataScreen';
import PdfShowComponent from '../../components/pdf_show_component/PdfShowComponent';
import ShowListOfAttendence from '../../components/show_data_component/ShowListOfAttendence';

const Stack = createStackNavigator();

const RouteStudentScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'StudentScreen'}],
        }),
      );
    }, [navigation]),
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudentScreen"
        component={StudentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowDataScreen"
        component={ShowDataScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PdfShowComponent"
        component={PdfShowComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowListOfAttendence"
        component={ShowListOfAttendence}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteStudentScreen;
