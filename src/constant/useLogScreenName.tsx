import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const useLogScreenName = (screenName: string) => {
  useFocusEffect(
    useCallback(() => {
      console.log(`Navigated to ${screenName}`);
      return () => console.log(`Left ${screenName}`);
    }, [screenName]),
  );
};

export default useLogScreenName;
