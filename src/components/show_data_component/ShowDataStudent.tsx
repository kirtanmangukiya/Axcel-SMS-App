import React, {useState, useCallback} from 'react';
import {ImageBackground, StyleSheet, View, BackHandler} from 'react-native';
import TopBar from '../TopBar';
import {
  DrawerActions,
  RouteProp,
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../types';
import TeacherApprove from '../teacher_component/TeacherApprove';

type ShowDataStudentRouteProp = RouteProp<
  MainStackParamList,
  'ShowDataStudent'
>;
type ShowDataStudentNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'ShowDataStudent'
>;

const ShowDataStudent = () => {
  const route = useRoute<ShowDataStudentRouteProp>();
  const navigation = useNavigation<ShowDataStudentNavigationProp>();
  const {students, sourceScreen} = route.params;
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleSearchPress = useCallback(() => {
    console.log('Search icon pressed');
    navigation.navigate('SearchScreen', {
      students: students || [],
      sourceScreen: sourceScreen,
    });
  }, [navigation, students]);

  const handleRefreshPress = useCallback(() => {
    console.log('Refresh icon pressed');
    // refreshData();
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        {
          sourceScreen === 'TeachersScreen'
            ? navigation.navigate('TeachersScreen')
            : sourceScreen === 'ParentsScreen'
            ? navigation.navigate('ParentsScreen')
            : sourceScreen === 'StudentScreen'
            ? navigation.navigate('StudentScreen')
            : null;
        }
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assest/icons/x_login_back.png')}>
      <TopBar
        title={sourceScreen === 'TeachersScreen' ? 'Teacher' : 'Student'}
        onSearchPress={handleSearchPress}
        onMenuPress={handleMenuPress}
        onRefreshPress={handleRefreshPress}
      />
      <View style={{marginHorizontal: '5%', marginTop: '5%'}}>
        <TeacherApprove />
      </View>
    </ImageBackground>
  );
};

export default ShowDataStudent;

const styles = StyleSheet.create({});
