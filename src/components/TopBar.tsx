import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

interface TopBarProps {
  title: string;
  onSearchPress?: () => void;
  onRefreshPress?: () => void;
  onAccountPress?: () => void;
  onMenuPress?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  onSearchPress,
  onRefreshPress,
  onAccountPress,
  onMenuPress,
}) => {
  const navigation = useNavigation(); // Use the navigation hook

  const handleMenuPress = useCallback(() => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      navigation.dispatch(DrawerActions.openDrawer()); // Open the drawer
    }
  }, [navigation, onMenuPress]);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={handleMenuPress}
        >
          <Icon name="menu" size={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightIconsContainer}>
        {onSearchPress && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onSearchPress}
          >
            <Icon name="search" size={30} color="white" />
          </TouchableOpacity>
        )}
        {onRefreshPress && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRefreshPress}
          >
            <Icon name="refresh" size={30} color="white" />
          </TouchableOpacity>
        )}
        {onAccountPress && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onAccountPress}
          >
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    // backgroundColor: '#000', // Ensure background color matches design
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginLeft: 8,
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

export default TopBar;
