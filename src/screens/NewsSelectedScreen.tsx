import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewsComponent from './NewsComponent';
import {MainStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {CalendarNewData, DailyAssignmentHomeworkData} from '../config/axios';
import NoEventComponent from '../components/no_data_event/NoEventComponent';

interface NewsItem {
  id: number;
  start: string;
  title: string;
  type: string;
}

interface NewsSelectedScreenProps {
  newsData: NewsItem[] | undefined;
}

type NewsNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'NewsSelectedScreen'
>;

const NewsSelectedScreen: React.FC<NewsSelectedScreenProps> = ({newsData}) => {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation<NewsNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);

  const fetchTodayEvents = async () => {
    try {
      const data = await DailyAssignmentHomeworkData();
      const calendarData = await CalendarNewData(); // Added calendar data fetch
      return generateTodayCards({
        assignments: data?.assignments || [],
        homeworks: data?.homeworks || [],
        newsEvents: calendarData || [], // Include calendar events
      });
    } catch (error) {
      console.error('Error fetching today events:', error);
      throw error;
    }
  };

  const generateTodayCards = (eventData: any) => {
    const today = new Date();
    const dateStr = today
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-');

    const todayEvents = {
      id: dateStr,
      date: today,
      label: 'Today',
      events: [
        ...(eventData?.newsEvents || []),
        ...(eventData?.assignments || []),
        ...(eventData?.homeworks || []),
      ].filter(event => {
        const eventDate = new Date(event.date.split('-').reverse().join('-'));
        return eventDate.toDateString() === today.toDateString();
      }),
    };

    console.log('Today Events Data:', JSON.stringify(todayEvents, null, 2));
    console.log('Today Events Count:', todayEvents.events.length);
    console.log(
      'Today Events Details:',
      JSON.stringify(todayEvents.events, null, 2),
    );

    return todayEvents;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const todayEvents = await fetchTodayEvents();
      console.log('Today Events Data:', todayEvents);
      setAssignments(todayEvents.events);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTryAgainPress = () => {
    setLoading(true);
    setTimeout(() => {
      loadData();
    }, 1000);
  };

  const renderEventCard = ({item}: {item: any}) => {
    console.log('Event Item:', JSON.stringify(item, null, 2));

    // Check if the item has newsEvents and iterate over them
    const newsEventTitles =
      item.newsEvents?.map((event: {title: any}) => event.title).join(', ') ||
      'No News Events';

    return (
      <View style={styles.cardContainer}>
        <Text style={styles.dateLabel}>Today</Text>
        <Text style={styles.eventText}>{newsEventTitles}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.calendar}>
          <View style={styles.calendarInnerView}>
            <Text style={styles.title}>Upcoming Today</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CalenderScreen')}
              style={[styles.btn, {backgroundColor: '#EF4C3F'}]}>
              <Text style={styles.btnText}>Calendar</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.calendarContent}>
              <Icon name="calendar" size={screenWidth * 0.3} color="white" />
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading</Text>
              </View>
            ) : assignments.length > 0 ? (
              <FlatList
                data={assignments}
                renderItem={renderEventCard}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <TouchableOpacity onPress={handleTryAgainPress}>
                <View style={styles.noDataContainer}>
                  <Text style={styles.dateText}>No Events Today</Text>
                  <Text style={styles.tryAgainText}>Tap to Try Again</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.newsContainer}>
          <View style={styles.newsHeader}>
            <Text style={styles.title}>News and Events</Text>
            <View style={styles.btnView}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  {backgroundColor: '#4981A9', marginRight: screenWidth * 0.02},
                ]}
                onPress={() => navigation.navigate('EventsScreen')}>
                <Text style={styles.btnText}>Events</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, {backgroundColor: '#EF4C3F'}]}
                onPress={() => navigation.navigate('NewsBoard')}>
                <Text style={styles.btnText}>List News</Text>
              </TouchableOpacity>
            </View>
          </View>
          {newsData &&
            [...newsData]
              .sort((a, b) => {
                const dateA = new Date(a.start.split('/').reverse().join('-'));
                const dateB = new Date(b.start.split('/').reverse().join('-'));
                return dateB.getTime() - dateA.getTime();
              })
              .map(item => <NewsComponent key={item.id} data={item} />)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingVertical: '2%',
  },
  calendarInnerView: {
    padding: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  btn: {
    paddingVertical: '1%',
    paddingHorizontal: '4%',
    borderRadius: 20,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  calendarContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '5%',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
    marginTop: '2%',
  },
  tryAgainText: {
    fontSize: 14,
    color: 'white',
    marginTop: '2%',
  },
  newsContainer: {
    width: '95%',
    marginTop: '3%',
    paddingHorizontal: '3%',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '3%',
  },
  btnView: {
    flexDirection: 'row',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
  },
  dateLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  eventText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default NewsSelectedScreen;
