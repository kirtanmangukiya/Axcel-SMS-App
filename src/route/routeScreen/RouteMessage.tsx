import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import YearScreen from '../../screens/Year/YearScreen';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import MessageScreen from '../../screens/message_screens/MessageScreen';
import ChatScreen from '../../screens/message_screens/ChatScreen';

const Stack = createStackNavigator();

const RouteMessage = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MessageScreen'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteMessage;
