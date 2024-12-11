import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const NoDataFound: React.FC<{
  noFoundTitle?: string;
  onRefreshPress?: () => void;
}> = ({ noFoundTitle = 'Data Not Found', onRefreshPress }) => {
  return (
    <View style={styles.noDataContainer}>
      <Image
        source={require('../../assest/icons/failed.png')}
        style={styles.noDataImage}
        accessibilityLabel="No data found icon"
      />
      <Text style={styles.noDataText}>{noFoundTitle}</Text>
      {onRefreshPress ? (
        <TouchableOpacity onPress={onRefreshPress} accessibilityLabel="Try to reload">
          <Text style={styles.reloadText}>Try to reload</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000', // Uncomment if a background is required
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
