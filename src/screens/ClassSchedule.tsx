import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import TopBar from '../components/TopBar';
import NoDataFound from '../components/no_data_found/NoDataFound';
import {classSchduleData, secitonDaysData} from '../config/axios';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
import {sectionsApiResponce} from '../types';
import {Picker} from '@react-native-picker/picker';
import {Day} from 'react-native-gifted-chat';

interface Section {
  classId: number;
  id: number;
  sectionName: string;
  sectionTitle: string;
  teacherId: any[];
}

interface Teacher {
  id: string;
  name: string;
}

const ClassSchedule: React.FC = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<sectionsApiResponce | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [selectedSectionObject, setSelectedSectionObject] =
    useState<Section | null>(null);
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const [searchStatus, setSearchStatus] = useState<
    'idle' | 'searching' | 'empty' | 'done'
  >('idle');

  useEffect(() => {
    loadData(); // Initial data load
  }, []);

  const loadData = async () => {
    try {
      setLoading(true); // Start loading
      const data = await classSchduleData();
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleMenuPress = useCallback(() => {
    console.log('Menu icon pressed', navigation);
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const searchTeachers = async () => {
    setSearchStatus('searching');
    console.log('Selected Section Object: ', selectedSectionObject);

    try {
      const fetchedData = await secitonDaysData(selectedSectionObject?.id);
      console.log('Fetched Data: ', fetchedData);

      // Check if schedule data is empty for all days
      const isEmpty = Object.values(fetchedData.schedule).every(day => {
        const isDayEmpty =
          day.data.length === 0 && (!day.sub || day.sub.length === 0);
        if (isDayEmpty) {
          console.log('Empty day data:', day);
        }
        return isDayEmpty;
      });

      if (!isEmpty) {
        // Navigate to the desired screen if data is not empty
        navigation.navigate('ClassSchuduleComponent', {
          scheduleData: fetchedData,
        });
        console.log('Data is available, navigate to the next screen');
        setSearchStatus('search');
      } else {
        // Log message if all schedule data arrays are empty
        console.log('Empty result');
        setSearchStatus('empty');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchStatus('idle'); // Reset status if there's an error
    }
  };

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <TopBar title="Class Schedule" onMenuPress={handleMenuPress} />
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndacatorr />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : data && data.classes ? (
            <>
              {/* Class Picker */}
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Year</Text>
                <Picker
                  dropdownIconColor="white"
                  selectedValue={selectedClass}
                  onValueChange={itemValue => {
                    setSelectedClass(itemValue);
                    if (itemValue) {
                      const sections = Object.values(data.sections).flat();
                      const filtered = sections.filter(
                        section => section.classId === parseInt(itemValue),
                      );
                      setFilteredSections(filtered);
                    } else {
                      setFilteredSections([]);
                    }
                    setSelectedSection(''); // Reset selected section
                    setSelectedSectionObject(null); // Reset selected section object
                    setTeacherList([]); // Clear the teacher list
                    setSearchStatus('idle'); // Reset search status
                  }}>
                  <Picker.Item label="Select Year" />
                  {Object.entries(data.classes).map(([key, value]) => (
                    <Picker.Item
                      key={key}
                      label={value}
                      value={key}
                      color="white"
                    />
                  ))}
                </Picker>
              </View>

              {/* Sections Picker */}
              {selectedClass && (
                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>Section</Text>
                  <Picker
                    dropdownIconColor="white"
                    selectedValue={selectedSection}
                    onValueChange={itemValue => {
                      setSelectedSection(itemValue);
                      const selectedSectionObj = filteredSections.find(
                        section => section.sectionName === itemValue,
                      );
                      setSelectedSectionObject(selectedSectionObj || null);
                      setTeacherList([]);
                      setSearchStatus('idle');
                      console.log(
                        'Selected Section Object: ',
                        selectedSectionObj,
                      );
                    }}>
                    <Picker.Item label="Select Section" value="" />
                    {filteredSections.map(section => (
                      <Picker.Item
                        key={section.id}
                        label={section.sectionName}
                        value={section.sectionName}
                        color="white"
                      />
                    ))}
                  </Picker>
                </View>
              )}

              {/* Search Button */}
              <View style={styles.searchButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.searchButton,
                    (!selectedClass || !selectedSection) &&
                      styles.searchButtonDisabled,
                    searchStatus === 'empty' ? {backgroundColor: 'red'} : null,
                  ]}
                  onPress={searchTeachers}
                  disabled={!selectedClass || !selectedSection}>
                  <Text style={styles.buttonText}>
                    {searchStatus === 'idle'
                      ? 'Search'
                      : searchStatus === 'searching'
                      ? 'Searching...'
                      : searchStatus === 'empty'
                      ? 'Empty Result'
                      : 'Search Successfully'}
                  </Text>
                </TouchableOpacity>
              </View>

              {searchStatus === 'empty' && (
                <View style={styles.noDataContainer}>
                  {/* <NoDataFound noFoundTitle="No Data Found" /> */}
                </View>
              )}
            </>
          ) : (
            <View style={styles.noDataContainer}>
              {/* <NoDataFound noFoundTitle="No Data Found" /> */}
            </View>
          )}
        </View>
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
    paddingHorizontal: 16,
    marginBottom: '5%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  pickerContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  searchButtonContainer: {
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  searchButton: {
    marginVertical: 16,
    width: '92%',
    paddingVertical: 8,
    marginLeft: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#2d7ca3',
  },
  searchButtonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noDataContainer: {
    top: 200,
    alignItems: 'center',
  },
});

export default ClassSchedule;
