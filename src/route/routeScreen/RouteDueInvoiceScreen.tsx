import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InvoiceScreen from '../../screens/Due_Invoices/DueInvoice';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import DueInvoice from '../../screens/Due_Invoices/DueInvoice';
import PdfShowComponent2 from '../../components/pdf_show_component/PdfShowComponent2';
import PdfShowComponent from '../../components/pdf_show_component/PdfShowComponent';

const Stack = createStackNavigator();

const RouteDueInvoiceScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'DueInvoice'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DueInvoice"
        component={DueInvoice}
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
      <Stack.Screen
        name="PdfShowComponent"
        component={PdfShowComponent}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteDueInvoiceScreen;
