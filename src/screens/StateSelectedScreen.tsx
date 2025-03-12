import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../types'; // Adjust the import path as needed
import {useNotifications} from '../utils/NotificationContext';

const StateSelectedScreen: React.FC = () => {
  const {counts, resetCount} = useNotifications();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleImagePress = (screenName: keyof RootStackParamList) => {
    // Reset notification count when entering screen
    switch (screenName) {
      case 'ResourceAndGuide':
        resetCount('resourceAndGuide');
        break;
      case 'NewsBoard':
        resetCount('newsBoard');
        break;
      case 'InvoiceScreen':
        resetCount('invoice');
        break;
    }
    navigation.navigate(screenName);
  };

  const renderRedCircle = (count: number) => {
    if (count > 0) {
      return (
        <View style={styles.redCircle}>
          <Text style={styles.redCircleText}>{count}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <TouchableOpacity
          onPress={() => handleImagePress('ResourceAndGuide')}
          style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../assest/icons/dash_stat_student.png')}
              style={styles.image}
            />
            <Text style={styles.imageText}>Resource & Guide</Text>
          </View>
          {renderRedCircle(counts.resourceAndGuide)}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleImagePress('NewsBoard')}
          style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../assest/icons/dash_stat_teacher.jpg')}
              style={styles.image}
            />
            <Text style={styles.imageText}>News Board</Text>
          </View>
          {renderRedCircle(counts.newsBoard)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleImagePress('InvoiceScreen')}
          style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require('../assest/icons/dash_stat_classes.jpg')}
              style={styles.image}
            />
            <Text style={styles.imageText}>Invoice</Text>
          </View>
          {renderRedCircle(counts.invoice)}
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
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    position: 'absolute',
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
