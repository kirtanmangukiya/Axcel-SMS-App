import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import InsideNewsComponent from '../../components/news_board_component/inside_newsBoard_component';
import Dashboard from '../../screens/Dashboard';
import EventsScreen from '../../screens/EventsScreen';
import NewsBoard from '../../screens/NewsBoard';
import PdfShowComponent from '../../components/pdf_show_component/PdfShowComponent';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {resourceAndGuideData} from '../../config/axios';
import InvoiceScreen from '../../screens/InvoiceScreen';
import ResourceAndGuide from '../../screens/resource_and_guide/ResourcendGuide';
import InsideEventComponent from '../../components/event_component/inside_event_componet';
import ShowDataScreen from '../../components/show_data_component/ShowDataScreen';
import CalenderScreen from '../../screens/CalenderScreen';
import PdfShowComponent2 from '../../components/pdf_show_component/PdfShowComponent2';
import WebViewComponent from '../../components/web_view/WebViewComponent';

const Stack = createStackNavigator();

const RouteDashBoardScreen = () => {
  const navigation = useNavigation();

  // useFocusEffect(
  //   useCallback(() => {
  //     // Reset the navigation stack to ensure the initial screen is shown
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{name: 'Dashboard'}],
  //       }),
  //     );
  //   }, [navigation]),
  // );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InsideNewsComponent"
        component={InsideNewsComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EventsScreen"
        component={EventsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewsBoard"
        component={NewsBoard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PdfShowComponent"
        component={PdfShowComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResourceAndGuide"
        component={ResourceAndGuide}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InvoiceScreen"
        component={InvoiceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InsideEventComponent"
        component={InsideEventComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CalenderScreen"
        component={CalenderScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PdfShowComponent2"
        component={PdfShowComponent2}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="WebViewComponent"
        component={WebViewComponent}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="ShowDataScreen"
        component={ShowDataScreen}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
  );
};

export default RouteDashBoardScreen;
