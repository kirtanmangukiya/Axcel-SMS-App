import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Example: using MaterialIcons

interface TopBarProps {
  title: string;
  onSearchPress?: () => void;
  onRefreshPress?: () => void;
  onMenuPress?: () => void;
  onAccountPress?: () => void; // New prop for account button press
  style?: any; // Additional style prop to inherit parent's background color
}

const StripeTopBar: React.FC<TopBarProps> = ({
  title,
  onSearchPress,
  onRefreshPress,
  onMenuPress,
  onAccountPress, // Destructure the new prop
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightIconsContainer}>
        {onSearchPress && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onSearchPress}>
            <Icon name="search" size={30} color="white" />
          </TouchableOpacity>
        )}
        {onRefreshPress && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRefreshPress}>
            <Icon name="refresh" size={30} color="white" />
          </TouchableOpacity>
        )}
        {onAccountPress && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onAccountPress}>
            <Icon name="account-circle" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 23,
    marginLeft: 8, // Adjust this value to control the spacing between the menu icon and the title
    color: 'white',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 8,
  },
});

export default StripeTopBar;
