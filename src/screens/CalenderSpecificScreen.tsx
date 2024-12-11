import React, {useState, useEffect} from 'react';
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
import {useNavigation, DrawerActions} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import NoEventComponent from '../components/no_data_event/NoEventComponent';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../types';
import { CalendarData } from '../config/axios';


type studentNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'CalenderScreen'
>;

const CalenderSpecificScreen: React.FC = () => {
  const navigation = useNavigation<studentNavigationProp>();
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appState, setAppState] = useState(AppState.currentState);

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
  }, [appState]);

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
    fetchCalendarEvents();
  };

  const fetchCalendarEvents = async () => {
    try {
      const startDate = '29-05-2020'; // You can adjust these values as needed
      const endDate = '29-05-2020';
      const data = await CalendarData(startDate, endDate); // Call the API function
      setCalendarEvents(data);
      console.log('Fetched calendar events:', data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setLoading(false);
    }
  };

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
      const formattedDate = date.toISOString().split('T')[0];
      console.log('Selected date:', formattedDate);

      navigation.navigate('CalenderSpecificScreen', {
        screenName: formattedDate,
      });
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
              renderItem={({item}) => <NoEventComponent data={item} />}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <View>
                  <Text style={{color: 'white'}}>No  Found</Text>
                </View>
              }
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
});

export default CalenderSpecificScreen;
