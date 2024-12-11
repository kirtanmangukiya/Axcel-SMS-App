import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import YearScreen from '../../screens/Year/YearScreen';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import SubjectsScreen from '../../screens/subjects/SubjectsScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const Stack = createStackNavigator();

const RouteSubjectsScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'SubjectsScreen'}],
        }),
      );
    }, [navigation]),
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SubjectsScreen"
        component={SubjectsScreen}
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

export default RouteSubjectsScreen;
