import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Calender from 'react-native-vector-icons/AntDesign';

interface TopBarProps {
  title: string;
  onMenuPress?: () => void;
  onCalendarPress?: () => void;
  style?: any;
}

const TopBarCalender: React.FC<TopBarProps> = ({
  title,
  onMenuPress,
  onCalendarPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {onMenuPress && (
          <TouchableOpacity style={styles.iconContainer} onPress={onMenuPress}>
            <Icon name="menu" size={30} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightIconsContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onCalendarPress}>
          <Calender name="calendar" size={30} color="white" />
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

export default TopBarCalender;
