import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import TopBar from '../TopBar';
import {useNavigation, useRoute, DrawerActions} from '@react-navigation/native';
import {AttendenceListData} from '../../config/axios';

interface AttendanceData {
  date: string;
  status: string;
}

const ShowListOfAttendence: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {id} = route.params as {id: number};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AttendenceListData(id);
        setAttendanceData(data.attendance); // Adjust based on your API response structure
        console.log(id, data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const renderItem = ({item}: {item: AttendanceData}) => (
    <View style={styles.container}>
      <Text style={styles.dateText}>{item.date}</Text>
      <View style={styles.row}>
        <Image
          source={{uri: 'https://img.icons8.com/color/48/000000/task.png'}} // Replace with your icon URL or local image source
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Attendance</Text>
          <Text style={styles.statusText}>
            {item.attNotes == '' ? 'N/A' : item.attNotes}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.screenContainer}>
      <TopBar title="Attendance" onMenuPress={handleMenuPress} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={attendanceData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Background color similar to your screenshot
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    color: 'gray',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ShowListOfAttendence;
