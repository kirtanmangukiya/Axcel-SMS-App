import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  AppState,
  Platform,
  Text,
} from 'react-native';
import TopBarCalender from '../components/TopBarCalender';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarNewData } from '../config/axios';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarEvent, MainStackParamList } from '../types';

type studentNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'CalenderScreen'
>;

// Create a new file src/utils/calendarUtils.ts
export const fetchCalendarEvents = async (startDate: Date, endDate: Date) => {
  try {
    const data = await CalendarNewData();
    return generateDateCards(startDate, endDate, data);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

export const generateDateCards = (startDate: Date, endDate: Date, eventData: any) => {
  const cards = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-');

    const isToday = new Date().toISOString().split('T')[0] === currentDate.toISOString().split('T')[0];
    const dayData = eventData.find((item: any) => item.date === dateStr);

    const dayEvents = {
      id: dateStr,
      date: new Date(currentDate),
      isToday,
      label: isToday ? 'Today' : currentDate.toLocaleDateString('en-US', {weekday: 'long'}),
      events: [
        ...(dayData?.newsEvents || []),
        ...(dayData?.assignments || []),
        ...(dayData?.homeworks || [])
      ]
    };

    cards.push(dayEvents);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return cards;
};

const CalenderScreen: React.FC = () => {
  const navigation = useNavigation<studentNavigationProp>();
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appState, setAppState] = useState(AppState.currentState);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    checkInternetAndFetchData();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkInternetAndFetchData();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, currentMonth, checkInternetAndFetchData]);

  const checkInternetAndFetchData = async () => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Bad network connection',
      });
      setLoading(false);
      return;
    }
    handleFetchCalendarEvents();
  };

  const handleFetchCalendarEvents = async () => {
    try {
      const startDate = new Date(currentMonth);
      const endDate = new Date(currentMonth);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      const processedData = await fetchCalendarEvents(startDate, endDate);

      setCalendarEvents(prevEvents =>
        isLoadingMore ? [...prevEvents, ...processedData] : processedData
      );

      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const renderEventCard = ({ item }: { item: any }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.dateLabel}>{item.label}</Text>
      <Text style={styles.dateText}>
        {item.date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      {item.events.length > 0 ? (
        item.events.map((event: CalendarEvent) => (
          <View key={event.id} style={styles.eventItem}>
            <Text style={styles.eventText}>{event.title}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noEventText}>No events</Text>
      )}
    </View>
  );

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCalendarPress = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setCurrentMonth(date);
      setLoading(true);
    }
  };

  const onEndReached = () => {
    if (!isLoadingMore) {
      setIsLoadingMore(true);
      const nextMonth = new Date(currentMonth); 
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentMonth(nextMonth);
    }
  };

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBarCalender
          title="Calendar"
          onMenuPress={handleMenuPress}
          onCalendarPress={handleCalendarPress}
        />
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingWrapper}>
              <Text style={{color: 'white'}}>Loading ...</Text>
            </View>
          ) : (
            <FlatList
              data={calendarEvents}
              renderItem={renderEventCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  loadingWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  dateLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  noEventText: {
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center',
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

export default CalenderScreen;