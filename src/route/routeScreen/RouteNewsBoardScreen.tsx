import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import YearScreen from '../../screens/Year/YearScreen';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import SubjectsScreen from '../../screens/subjects/SubjectsScreen';
import HostelScreen from '../../screens/hostel/HostelScreen';
import NewsBoard from '../../screens/NewsBoard';
import InsideNewsComponent from '../../components/news_board_component/inside_newsBoard_component';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import PdfShowComponent from '../../components/pdf_show_component/PdfShowComponent';

const Stack = createStackNavigator();

const RouteNewsBoardScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'NewsBoard'}],
        }),
      );
    }, [navigation]),
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewsBoard"
        component={NewsBoard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InsideNewsComponent"
        component={InsideNewsComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PdfShowComponent"
        component={PdfShowComponent}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteNewsBoardScreen;
