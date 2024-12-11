import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import YearScreen from '../../screens/Year/YearScreen';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import CredentialsNotesScreen from '../../screens/CrediantsNotesScreen';
import PdfShowComponent2 from '../../components/pdf_show_component/PdfShowComponent2';
import PdfShowComponent from '../../components/pdf_show_component/PdfShowComponent';

const Stack = createStackNavigator();

const RouteCreditNotesScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'CredentialsNotesScreen'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CredentialsNotesScreen"
        component={CredentialsNotesScreen}
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

export default RouteCreditNotesScreen;
