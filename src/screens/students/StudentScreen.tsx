import React from 'react';
import { View, FlatList, StyleSheet, ImageBackground } from 'react-native';

import { useNavigation, DrawerActions } from '@react-navigation/native';
import TopBar from '../../components/TopBar';
import StudentProfileComponent from '../../components/StudentProfileComponent';


const data = [
  {
    id: '1',
    name: 'Test Student Dilawar',
  username: 'johndoe1',
    email: 'johndoe1@example.com',
    profileImageUri: 'https://via.placeholder.com/100',
  }
  // {
  //   id: '2',
  //   name: 'Test Student Ahmed',
  //   username: 'johndoe2',
  //   email: 'johndoe2@example.com',
  //   profileImageUri: 'https://via.placeholder.com/100',
  // },
  // {
  //   id: '3',
  //   name: 'Test Student Sara',
  //   username: 'johndoe3',
  //   email: 'johndoe3@example.com',
  //   profileImageUri: 'https://via.placeholder.com/100',
  // },
  // Add more items as needed
];

const StudentScreen: React.FC = () => {
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
      style={styles.background}
    >
      <View style={styles.container}>
        <TopBar
          title="Student"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        />
        <View style={{ marginHorizontal: '5%' }}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StudentProfileComponent
                name={item.name}
                username={item.username}
                email={item.email}
                profileImageUri={item.profileImageUri}
              />
            )}
            contentContainerStyle={styles.contentContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
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
    // backgroundColor: 'rgba(0, 0, 0, 0.3)'', // Optional: Add opacity to overlay
  },
  contentContainer: {
    paddingVertical: 10,
  },
  separator: {
    height: 10, // Adjust the height to increase/decrease the space between items
  },
});

export default StudentScreen;
