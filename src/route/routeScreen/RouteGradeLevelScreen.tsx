import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import TeachersScreen from '../../screens/teachers/TeachersScreen';
import GradeLevel from '../../screens/grade_levels/GradeLevel';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
const Stack = createStackNavigator();

const RouteGradeLevelScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'GradeLevel'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GradeLevel"
        component={GradeLevel}
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

export default RouteGradeLevelScreen;
