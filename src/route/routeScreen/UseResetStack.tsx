import {useEffect} from 'react';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';

const UseResetStack = (routeName: string) => {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    // Check if the current route name matches the route we want to reset
    if (route.name === routeName) {
      // Reset the stack to the initial route
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Dashboard'}],
        }),
      );
    }
  }, [route.name, navigation, routeName]);
};

export default UseResetStack;
