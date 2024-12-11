import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  AppState,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import TopBar from '../components/TopBar';
import {AttendenceAddData, sectionsData} from '../config/axios';
import {MainStackParamList, sectionsApiResponce} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import NoDataFound from '../components/no_data_found/NoDataFound';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');

type AttendeNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'StudentProfileComponent'
>;

interface Section {
  classId: number;
  id: number;
  sectionName: string;
  sectionTitle: string;
  teacherId: any[];
}

const AttendenceScreen = () => {
  const [year, setYear] = useState<string>('5');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation<AttendeNavigationProp>();
  const [data, setData] = useState<sectionsApiResponce | null>(null);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<string>(''); // Initialize as empty string
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [appState, setAppState] = useState(AppState.currentState);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const checkInternetAndLoadData = async () => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'No internet connection available.',
      });
      setLoading(false);
      return;
    }
    loadData2();
  };

  const loadData = async (
    classId: number,
    sectionId: number,
    attendanceDay: string,
  ) => {
    try {
      const data = await AttendenceAddData(classId, sectionId, attendanceDay);
      console.log('Attendance API Response ', data);
      if (data) {
        navigation.navigate('AttendanceListScreen', {
          data: data,
          attendanceDay: attendanceDay,
        });
      } else {
        Alert.alert('Error', 'No data available.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkInternetAndLoadData();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkInternetAndLoadData();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    if (data) {
      const sections = Object.values(data.sections).flat();
      const filtered = sections.filter(
        section => section.classId === parseInt(selectedClass),
      );
      setFilteredSections(filtered);
    }
  }, [data, selectedClass]);

  const loadData2 = async () => {
    try {
      const data = await sectionsData();
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    console.log('Year:', year);
    console.log('Class:', selectedClass);
    console.log('Section:', selectedSection);
    console.log('Date:', date.toLocaleDateString());

    const classId = parseInt(selectedClass, 10);
    const sectionId =
      filteredSections.find(section => section.sectionName === selectedSection)
        ?.id || 0;
    const attendanceDay = date.toLocaleDateString();

    if (!classId || !sectionId) {
      Alert.alert('Error', 'Please select all required inputs.');
      return;
    }

    loadData(classId, sectionId, attendanceDay);
  };

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={{flex: 1}}>
      <TopBar title="Students Attendance" onMenuPress={handleMenuPress} />
      <View style={styles.container}>
        {loading ? (
          <Text style={{color: 'white'}}>Loading...</Text>
        ) : data && data.classes ? (
          <>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Class:</Text>
              <Picker
                selectedValue={selectedClass}
                onValueChange={itemValue => {
                  setSelectedClass(itemValue);
                  setSelectedSection(''); // Reset selected section when class changes
                  console.log('Selected Class:', itemValue);
                }}
                style={styles.picker}>
                {/* Default option */}
                <Picker.Item label="Select Class" value="" />

                {/* Map through classes */}
                {Object.entries(data.classes).map(([key, value]) => (
                  <Picker.Item key={key} label={value} value={key} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Section:</Text>
              <Picker
                selectedValue={selectedSection}
                onValueChange={itemValue => {
                  setSelectedSection(itemValue);
                  console.log('Selected Section:', itemValue);
                }}
                style={styles.picker}>
                <Picker.Item label="Select Section" value="" />
                {filteredSections.map(section => (
                  <Picker.Item
                    key={section.id}
                    label={section.sectionName}
                    value={section.sectionName}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePicker}>
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}>
              <Text style={styles.searchButtonText}>SEARCH</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <NoDataFound noFoundTitle="No Data Found" />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
    alignItems: 'center',
  },
  label: {
    width: '100%',
    color: '#fff', // Change text color to white
    marginBottom: 8,
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#000', // Ensure text color is visible
    backgroundColor: '#fff', // Ensure background color is visible
    marginBottom: 12,
    borderRadius: 5,
  },
  datePicker: {
    width: '100%',
    marginBottom: 12,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dateText: {
    color: '#000',
  },
  searchButton: {
    width: '100%',
    backgroundColor: '#2d7ca3',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    fontWeight: 'bold',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 12,
  },
  pickerLabel: {
    marginBottom: 4,
    color: '#fff', // Change text color to white
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AttendenceScreen;
