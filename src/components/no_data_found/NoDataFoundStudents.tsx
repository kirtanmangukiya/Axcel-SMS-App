import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const NoDataFoundStudents: React.FC<{noFoundTitle: string}> = ({
  noFoundTitle,
}) => {
  const navigation = useNavigation();
  const [data, setData] = useState<any[]>([]); // Replace 'any' with the appropriate type of your data

  const handleReloadPress = React.useCallback(() => {
    // console.log('Reload pressed');
    // Add your reload logic here
  }, []);
  return (
    <View style={styles.noDataContainer}>
      <Image
        source={require('../../assest/icons/failed.png')} // Replace with your "no events" image path
        style={styles.noDataImage}
      />
      <Text style={styles.noDataText}>{noFoundTitle}</Text>
      <TouchableOpacity onPress={handleReloadPress}>
        <Text style={styles.reloadText}>Try to reload</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoDataFoundStudents;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    // or 'stretch' as per your preference
  },
  container: {
    flex: 1,
    // // backgroundColor: 'rgba(0, 0, 0, 0.3)'', // Optional: Add opacity to overlay
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataImage: {
    width: 170,
    height: 145,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  reloadText: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
