import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InvoiceScreen from '../../screens/InvoiceScreen';
import HomeWork from '../../screens/Home_Work/HomeWork';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import InsideHomework from '../../screens/Home_Work/InsideHomework';
import HomeWorkInsideComponent from '../../components/homework_component/HomeWorkInsideComponent';
import AddHomeWork from '../../components/add_homeWork.tsx/AddHomeWork';

const Stack = createStackNavigator();

const RouteHomeworkScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeWork'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeWork"
        component={HomeWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeWorkInsideComponent"
        component={HomeWorkInsideComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddHomeWork"
        component={AddHomeWork}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteHomeworkScreen;
