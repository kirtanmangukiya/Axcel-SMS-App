import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InvoiceScreen from '../../screens/Due_Invoices/DueInvoice';
import AssignmentScreen from '../../screens/assigment/AssignmentScreen';
import AttendenceScreen from '../../screens/AttendenceScreen';
import AttendanceListScreen from '../../components/attendence_component/AttendanListceScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const Stack = createStackNavigator();

const RouteAttendenceScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AttendenceScreen'}],
        }),
      );
    }, [navigation]),
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AttendenceScreen"
        component={AttendenceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AttendanceListScreen"
        component={AttendanceListScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteAttendenceScreen;
