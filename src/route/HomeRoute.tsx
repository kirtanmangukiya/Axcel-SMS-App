import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const HomeStack = createNativeStackNavigator();

const HomeRoutes: FC = () => {
  const navigation = useNavigation();

  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerStyle: {
            // backgroundColor: '#731182',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{
                marginLeft: 10,
              }}
            >
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeRoutes;