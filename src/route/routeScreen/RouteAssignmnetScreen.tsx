import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InvoiceScreen from '../../screens/Due_Invoices/DueInvoice';
import AssignmentScreen from '../../screens/assigment/AssignmentScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import AddAssignmentScreen from '../../components/assigment_add/AddAssignmentScreen';

import ShowDataScreen from '../../components/show_data_component/ShowDataScreen';
import AssignemntUploadList from '../../components/assignment_component/AssignemntUploadList';

const Stack = createStackNavigator();

const RouteAssigmentScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AssignmentScreen'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AssignmentScreen"
        component={AssignmentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddAssignmentScreen"
        component={AddAssignmentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowDataScreen"
        component={ShowDataScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AssignemntUploadList"
        component={AssignemntUploadList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteAssigmentScreen;
