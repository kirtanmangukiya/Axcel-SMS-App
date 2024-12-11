import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import TeachersScreen from '../../screens/teachers/TeachersScreen';
import GradeLevel from '../../screens/grade_levels/GradeLevel';
import ResourceAndGuide from '../../screens/resource_and_guide/ResourcendGuide';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import PdfShowComponent2 from '../../components/pdf_show_component/PdfShowComponent2';

const Stack = createStackNavigator();

const RouteResourceAndGuideScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'ResourceAndGuide'}],
        }),
      );
    }, [navigation]),
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ResourceAndGuide"
        component={ResourceAndGuide}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PdfShowComponent2"
        component={PdfShowComponent2}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteResourceAndGuideScreen;
