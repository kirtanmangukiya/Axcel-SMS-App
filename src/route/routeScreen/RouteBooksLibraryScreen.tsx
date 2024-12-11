import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InvoiceScreen from '../../screens/Due_Invoices/DueInvoice';
import AssignmentScreen from '../../screens/assigment/AssignmentScreen';
import BooksLibraryScreen from '../../screens/BooksLibraryScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const Stack = createStackNavigator();

const RouteBooksLibraryScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'BooksLibraryScreen'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BooksLibraryScreen"
        component={BooksLibraryScreen}
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

export default RouteBooksLibraryScreen;
