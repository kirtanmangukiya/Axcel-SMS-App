import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; // Adjust the import path as needed

const StateSelectedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State for notification counts (replace with your actual data)
  const [notificationCounts, setNotificationCounts] = useState({
    resourceAndGuide: 0,
    newsBoard: 0,
    invoice: 0,
  });

  // Simulating notification count updates (You can replace this with actual logic)
  useEffect(() => {
    // Example: Simulating notification counts for each category
    setNotificationCounts({
      resourceAndGuide: 0,  // 0 notifications for Resource & Guide
      newsBoard: 0,         // No notifications for News Board
      invoice: 2,           // 2 notifications for Invoice
    });
  }, []);

  const handleImagePress = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  const renderRedCircle = (count: number) => {
    if (count > 0) {
      return (
        <View style={styles.redCircle}>
          {/* Ensure the count is wrapped inside a Text component */}
          <Text style={styles.redCircleText}>{count}</Text>
        </View>
      );
    }
    return null; // Do not render red circle if count is 0
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResourceAndGuide')}
          style={styles.imageContainer}>
          <Image
            source={require('../assest/icons/dash_stat_student.png')}
            style={styles.image}
          />
          <Text style={styles.imageText}>Resource & Guide</Text>
          {/* Render the red circle with count */}
          {renderRedCircle(notificationCounts.resourceAndGuide)}
        </TouchableOpacity>

        {/* News Board */}
        <TouchableOpacity
          onPress={() => handleImagePress('NewsBoard')}
          style={styles.imageContainer}>
          <Image
            source={require('../assest/icons/dash_stat_teacher.jpg')}
            style={styles.image}
          />
          <Text style={styles.imageText}>News Board</Text>
          {/* Render the red circle with count */}
          {renderRedCircle(notificationCounts.newsBoard)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleImagePress('InvoiceScreen')}
          style={styles.imageContainer}>
          <Image
            source={require('../assest/icons/dash_stat_classes.jpg')}
            style={styles.image}
          />
          <Text style={styles.imageText}>Invoice</Text>
          {/* Render the red circle with count */}
          {renderRedCircle(notificationCounts.invoice)}
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
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
