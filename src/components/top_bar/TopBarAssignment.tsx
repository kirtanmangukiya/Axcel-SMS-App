import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Example: using MaterialIcons
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook

interface TopBarProps {
  title: string;
  onSearchPress?: () => void;
  onRefreshPress?: () => void;
  onMenuPress?: () => void;
  onAccountPress?: () => void;
  handleAddPress?: () => void;
  style?: any;
}

const TopBarAssignment: React.FC<TopBarProps> = ({
  title,
  onSearchPress,
  onRefreshPress,
  onMenuPress,
  onAccountPress,
  handleAddPress,
  style,
}) => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {onMenuPress ? (
          <TouchableOpacity style={styles.iconContainer} onPress={onMenuPress}>
            <Icon name="menu" size={30} color="white" />
          </TouchableOpacity>
        ) : null}
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
        <TouchableOpacity style={styles.iconContainer} onPress={onRefreshPress}>
          <Icon name="refresh" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={handleAddPress}>
          <Icon name="add" size={30} color="white" />
        </TouchableOpacity>
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    
  
    borderBottomColor: '#cccccc',
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

export default TopBarAssignment;
