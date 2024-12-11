// src/route/MainRoute.tsx

import DrawerRoutes from './DrawerRoutes';
import LoginScreen from '../screens/Login';
import {MainStackParamList} from '../types';
import React from 'react';
import SplashScreen from '../screens/SplashScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainRoutes: React.FC = () => {
  return (
    <MainStack.Navigator initialRouteName="Splash">
      <MainStack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="DrawerRoutes"
        component={DrawerRoutes}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

export default MainRoutes;
