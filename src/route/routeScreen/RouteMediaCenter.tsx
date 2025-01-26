import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {MediaCenterData} from '../../config/axios';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import MediaCenterScreen from '../../screens/MediaCenterScreen';
import ShowDataScreen from '../../components/show_data_component/ShowDataScreen';
import AlbumsScreen from '../../components/mediaCenterScreens/AlbumsScreen';
import MediaScreen from '../../components/mediaCenterScreens/MediaScreen';

const Stack = createStackNavigator();

const RouteMediaCenter = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Reset the navigation stack to ensure the initial screen is shown
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MediaCenterScreen'}],
        }),
      );
    }, [navigation]),
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MediaCenterScreen"
        component={MediaCenterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NoDataFound"
        component={NoDataFound}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ShowDataScreen"
        component={ShowDataScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AlbumsScreen"
        component={AlbumsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MediaScreen"
        component={MediaScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RouteMediaCenter;
