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
import {DailyAssignmentHomeworkData} from '../config/axios';
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

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedData = await DailyAssignmentHomeworkData();
      console.log('Fetched assignment and homework data222222222222222222:', fetchedData);

      // Update state with the fetched data
      setAssignments(fetchedData.assignments);
      setHomeworks(fetchedData.homeworks);
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
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white'}}>Loading</Text>
              </View>
            ) : assignments.length === 0 && homeworks.length === 0 ? (
              <TouchableOpacity onPress={handleTryAgainPress}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Text style={styles.dateText}>No Data Available</Text>
                  <Text style={styles.tryAgainText}>Tap to Try Again</Text>
                  {/* <NoEventComponent /> */}
                </View>
              </TouchableOpacity>
            ) : (
              <>
                {assignments.length > 0 && (
                  <FlatList
                    data={assignments}
                    renderItem={({item}) => <NoEventComponent data={item} />}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
                {/* {homeworks.length > 0 && (
                  <FlatList
                    data={homeworks}
                    renderItem={({item}) => <NoEventComponent data={item} />}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  />
                )} */}
              </>
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
            newsData.map(item => <NewsComponent key={item.id} data={item} />)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default NewsSelectedScreen;
