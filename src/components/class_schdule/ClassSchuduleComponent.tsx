import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Image} from 'react-native-animatable';
import TopBar from '../TopBar';

const ClassSchuduleComponent = ({route}) => {
  const {scheduleData} = route.params;

  const [selectedDay, setSelectedDay] = useState('Monday');

  const renderDayHeader = () => {
    return Object.values(scheduleData.schedule).map(day => (
      <TouchableOpacity
        key={day.dayName}
        style={[
          styles.dayButton,
          selectedDay === day.dayName && styles.selectedDayButton,
        ]}
        onPress={() => setSelectedDay(day.dayName)}>
        <Text style={styles.dayText}>{day.dayName.toUpperCase()}</Text>
      </TouchableOpacity>
    ));
  };

  const renderSchedule = () => {
    const daySchedule = Object.values(scheduleData.schedule).find(
      day => day.dayName === selectedDay,
    );
    if (!daySchedule.sub || daySchedule.sub.length === 0) {
      return <Text style={styles.noScheduleText}>No Schedule Available</Text>;
    }

    return daySchedule.sub.map(subject => (
      <View key={subject.id} style={styles.scheduleItem}>
        <View>
          <Text style={styles.subjectText}>{subject.subjectId}</Text>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.timeSection}>
            <Image
              source={require('../../assest/icons/icon_pages_start_time.png')}
              style={{width: 35, height: 35, marginRight: 10}}
            />
            <View>
              <Text style={styles.timeLabel}>Start Time</Text>
              <Text style={styles.timeText}>{subject.start}</Text>
            </View>
          </View>
          <View style={styles.timeSection}>
            <Image
              source={require('../../assest/icons/icon_pages_end_time.png')}
              style={{width: 36, height: 35, marginRight: 10}}
            />
            <View>
              <Text style={styles.timeLabel}>End Time</Text>
              <Text style={styles.timeText}>{subject.end}</Text>
            </View>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.container}>
      <TopBar title="Class Schdule" />
      <View style={styles.innerContainer}>
        <ScrollView horizontal style={styles.dayHeaderContainer}>
          {renderDayHeader()}
        </ScrollView>
        <ScrollView contentContainerStyle={styles.scheduleContainer}>
          {renderSchedule()}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    // flex: 1, // Ensures that the content inside takes up the whole screen
    paddingHorizontal: 15,
    // paddingTop: 10,
  },
  dayHeaderContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedDayButton: {
    borderBottomWidth: 4,
    borderBottomColor: 'yellow',
  },
  dayText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scheduleContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  subjectText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '4%',
  },
  timeSection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timeLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noScheduleText: {
    fontSize: 18,
    color: '#f00',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ClassSchuduleComponent;
