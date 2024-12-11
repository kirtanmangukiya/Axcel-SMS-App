import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {ImageBackground} from 'react-native';
import {RootStackParamList} from '../../types';
import NoDataFound from '../no_data_found/NoDataFound';
import TopBar from '../TopBar';
// Adjust the path as necessary

type Props = NativeStackScreenProps<RootStackParamList, 'ShowDataScreen'>;

const ShowDataScreen: React.FC<Props> = ({route}) => {
  // Access the passed parameter
  const {screenName} = route.params || {screenName: 'NoData'};

  // const refresherData = () => {
  //   console.log('Helloooo');
  // };

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assest/icons/SideBarBg.jpg')} // Ensure the correct path
    >
      <TopBar
        title={screenName}
        onRefreshPress={() => console.log('Helloooo')}
      />
      <NoDataFound noFoundTitle={`No ${screenName} Available To Show`} />
    </ImageBackground>
  );
};

export default ShowDataScreen;
