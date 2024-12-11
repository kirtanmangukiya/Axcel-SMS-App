import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  FlatList,
} from 'react-native';

interface Assignment {
  id: number;
  classId: string;
  sectionId: string;
  subjectId: number;
  teacherId: number;
  AssignTitle: string;
  AssignDescription: string;
  AssignFile: string;
  AssignDeadLine: string;
}

interface Homework {
  id: number;
  classId: string;
  sectionId: string;
  subjectId: number;
  teacherId: number;
  homeworkTitle: string;
  homeworkDescription: string;
  homeworkFile: string;
  homeworkDate: string;
  homeworkSubmissionDate: string;
}

interface CalendarEvent {
  assignments: Assignment[];
  date: string;
  homeworks: Homework[];
  newsEvents: { eventTitle?: string }[];
}

interface NoEventComponentProps {
  data: CalendarEvent;
}

const NoEventComponent: React.FC<NoEventComponentProps> = ({data}) => {
  const {width} = useWindowDimensions();

  // Safeguard against undefined values
  const assignments = data?.assignments ?? [];
  const homeworks = data?.homeworks ?? [];
  const newsEvents = data?.newsEvents ?? [];

  const hasAssignments = assignments.length > 0;
  const hasHomeworks = homeworks.length > 0;
  const hasNewsEvents = newsEvents.length > 0;

  const noEvents = !hasAssignments && !hasHomeworks && !hasNewsEvents;

  const EventIcon = () => (
    <View style={{width: '15%'}}>
      <Image
        source={require('../../assest/icons/date.png')}
        style={{height: 30, width: 30}}
      />
    </View>
  );

  const renderAssignmentItem = ({item}: {item: Assignment}) => (
    <View style={styles.eventsContainer}>
      <EventIcon />
      <Text style={styles.noEventsText}>
        {item.AssignTitle || 'No Description Available'}
      </Text>
    </View>
  );

  const renderHomeworkItem = ({item}: {item: Homework}) => (
    <View style={styles.eventsContainer}>
      <EventIcon />
      <Text style={styles.noEventsText}>
        {item.homeworkTitle || 'No Description Available'}
      </Text>
    </View>
  );

  const renderNewsEventItem = ({item}: {item: {eventTitle?: string}}) => (
    <View style={styles.eventsContainer}>
      <EventIcon />
      <Text style={styles.noEventsText}>
        {item.eventTitle || 'News Events Available'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, {marginHorizontal: width * 0.02}]}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{data?.date || 'No Date Available'}</Text>
      </View>

      {noEvents ? (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>No Events Available</Text>
        </View>
      ) : (
        <>
          {hasAssignments && (
            <FlatList
              data={assignments}
              renderItem={renderAssignmentItem}
              keyExtractor={item => `assignment-${item.id}`}
              removeClippedSubviews={false} // prevent clipping issue
            />
          )}

          {hasHomeworks && (
            <FlatList
              data={homeworks}
              renderItem={renderHomeworkItem}
              keyExtractor={item => `homework-${item.id}`}
              removeClippedSubviews={false} // prevent clipping issue
            />
          )}

          {hasNewsEvents && (
            <FlatList
              data={newsEvents}
              renderItem={renderNewsEventItem}
              keyExtractor={(_, index) => `newsEvent-${index}`}
              removeClippedSubviews={false} // prevent clipping issue
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderRadius: 5,
    overflow: 'hidden',
  },
  dateContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A9A9A9',
  },
  eventsContainer: {
    alignItems: 'center',
    backgroundColor: '#eb5050',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginBottom: 10,
  },
  noEventsContainer: {
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingVertical: 15,
    borderRadius: 5,
  },
  noEventsText: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default NoEventComponent;
