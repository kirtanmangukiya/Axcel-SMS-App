import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InvoiceScreen from '../../screens/InvoiceScreen';
import WebViewComponent from '../../components/web_view/WebViewComponent';
import PdfShowComponent2 from '../../components/pdf_show_component/PdfShowComponent2';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import PdfShowComponent from '../../components/pdf_show_component/PdfShowComponent';
import WebViewComponent2 from '../../components/web_view/WebViewComponent2';

const Stack = createStackNavigator();

const RouteInvoiceScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'InvoiceScreen'}],
        }),
      );
    }, [navigation]),
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InvoiceScreen"
        component={InvoiceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WebViewComponent"
        component={WebViewComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WebViewComponent2"
        component={WebViewComponent2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PdfShowComponent2"
        component={PdfShowComponent2}
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

export default RouteInvoiceScreen;
