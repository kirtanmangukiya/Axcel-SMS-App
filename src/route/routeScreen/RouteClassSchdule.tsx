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
import ClassSchuduleComponent from '../../components/class_schdule/ClassSchuduleComponent';
import ClassSchedule from '../../screens/ClassSchedule';

const Stack = createStackNavigator();

const RouteClassSchdule = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'ClassSchedule'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClassSchedule"
        component={ClassSchedule}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClassSchuduleComponent"
        component={ClassSchuduleComponent}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteClassSchdule;
