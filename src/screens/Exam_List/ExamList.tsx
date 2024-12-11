import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import TopBar from '../../components/TopBar';
import NoDataFound from '../../components/no_data_found/NoDataFound';

const ExamList: React.FC = () => {
  const navigation = useNavigation();

  const handleSearchPress = React.useCallback(() => {
    console.log('Search icon pressed');
  }, []);

  const handleRefreshPress = React.useCallback(() => {
    console.log('Refresh icon pressed');
  }, []);

  const handleMenuPress = React.useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Exam List"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress} // Add the menu press handler here
        />
        <View style={styles.content}>
          <NoDataFound noFoundTitle="NO DATA FOUND" />
          {/* Add your specific content here */}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' as per your preference
  },
  container: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)' // Optional: Add opacity to overlay
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExamList;
