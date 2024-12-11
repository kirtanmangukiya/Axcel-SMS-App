// src/route/RouteEventsScreen.tsx
import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect, CommonActions, useNavigation } from '@react-navigation/native';
import EventsScreen from '../../screens/EventsScreen';
import SearchScreen from '../../components/Search_Screen/SearchScreen';
import InsideEventComponent from '../../components/event_component/inside_event_componet';

const Stack = createStackNavigator();

const RouteEventsScreen: React.FC = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'EventsScreen' }],
        })
      );
    }, [navigation])
  );

  return (
    <Stack.Navigator
      initialRouteName="EventsScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="EventsScreen"
        component={EventsScreen}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
      />
      <Stack.Screen
        name="InsideEventComponent"
        component={InsideEventComponent}
      />
    </Stack.Navigator>
  );
};

export default RouteEventsScreen;
