import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InvoiceScreen from '../../screens/InvoiceScreen';
import ParentsScreen from '../../screens/parents/ParentsScreen';
import TeachersScreen from '../../screens/teachers/TeachersScreen';
import {CommonActions, useFocusEffect, useNavigation} from '@react-navigation/native';

const Stack = createStackNavigator();

const RouteTeachersScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'TeachersScreen'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TeachersScreen"
        component={TeachersScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteTeachersScreen;
