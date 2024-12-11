import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; // Adjust the import path as needed

const StateSelectedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleImagePress = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <TouchableOpacity
          // onPress={() => handleImagePress('HomeScreen')}
          style={styles.imageContainer}>
          {/* <View style={styles.redCircle}>
            <Text style={styles.redCircleText}>0</Text>
          </View> */}
          <TouchableOpacity
            style={styles.imageOverlay}
            onPress={() => navigation.navigate('ResourceAndGuide')}>
            <Image
              source={require('../assest/icons/dash_stat_student.png')}
              style={styles.image}
            />
            <Text style={styles.imageText}>Resource & Guide</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleImagePress('NewsBoard')}
          style={styles.imageContainer}>
          <View style={styles.imageOverlay}>
            <Image
              source={require('../assest/icons/dash_stat_teacher.jpg')}
              style={styles.image}
            />
            <Text style={styles.imageText}>News Board</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleImagePress('InvoiceScreen')}
          style={styles.imageContainer}>
          <View style={styles.imageOverlay}>
            <Image
              source={require('../assest/icons/dash_stat_classes.jpg')}
              style={styles.image}
            />
            <Text style={styles.imageText}>Invoice</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StateSelectedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: '#000', // Updated to black background for better visibility of text
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative', // Needed for positioning the red circle and overlay
  },
  redCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: -5,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redCircleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    position: 'absolute',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
