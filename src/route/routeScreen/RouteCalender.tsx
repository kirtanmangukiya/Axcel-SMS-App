import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import CalenderScreen from '../../screens/CalenderScreen';
import ShowDataScreen from '../../components/show_data_component/ShowDataScreen';
import TopBarCalender from '../../components/TopBarCalender';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import ShowDataStudent from '../../components/show_data_component/ShowDataStudent';
import CalenderSpecificScreen from '../../screens/CalenderSpecificScreen';

const Stack = createStackNavigator();

const RouteCalender = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'CalenderScreen'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CalenderScreen"
        component={CalenderScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowDataScreen"
        component={ShowDataScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="CalenderSpecificScreen"
        component={CalenderSpecificScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteCalender;
