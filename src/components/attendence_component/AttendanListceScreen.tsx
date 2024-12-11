import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AttendanceCard from './AttendanceCard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TopBar from '../TopBar';
import Toast from 'react-native-toast-message';
import {AttendenceData} from '../../config/axios';

interface Student {
  id: number;
  name: string;
  studentRollId: string;
  attendance: string;
  attNotes?: string;
}

interface AttendanceData {
  class: {
    classAcademicYear: number;
    className: string;
    classSubjects: string;
    classTeacher: string;
    dormitoryId: number;
    id: number;
  };
  students: Student[];
  subject: {
    finalGrade: string;
    id: number;
    passGrade: string;
    subjectTitle: string;
    teacherId: string[];
  };
}

const AttendanceListScreen: React.FC = () => {
  const route = useRoute();
  const {
    data,
    attendanceDay,
  }: {data: AttendanceData; attendanceDay: attendanceDay} = route.params;
  const navigation = useNavigation();

  console.log(
    '---------------------------------------------------',
    attendanceDay,
  );

  const [search, setSearch] = useState('');
  const [attendanceData, setAttendanceData] = useState<Student[]>(
    data.students,
  );
  const [filteredData, setFilteredData] = useState<Student[]>(data.students);

  useEffect(() => {
    setAttendanceData(data.students);
    setFilteredData(data.students);
  }, [data]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filteredData = attendanceData.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(attendanceData);
    }
  };

  const handleAttendance = (
    id: number,
    attendance: string,
    attNotes: string,
  ) => {
    const updatedData = attendanceData.map(student =>
      student.id === id ? {...student, attendance, attNotes} : student,
    );
    setAttendanceData(updatedData);
    setFilteredData(updatedData);
  };

  const handleSaveAttendance = async () => {
    const formattedDate = new Date().toLocaleDateString('en-GB');

    const finalData = {
      attendanceDay: attendanceDay,
      classId: data?.class?.id,
      subjectId: data?.class?.classSubjects
        ? Number(JSON.parse(data?.class?.classSubjects)[0]) // Convert the subjectId to a number
        : null,
      stAttendance: attendanceData
        .filter(({attendance, attNotes}) => attendance !== '5' && attNotes) // Filter out '5' attendance and empty 'attNotes'
        .map(({id, attendance, attNotes}) => ({
          id,
          attendance:
            attendance === 'Present'
              ? '0'
              : attendance === 'Absent'
              ? '1'
              : attendance === 'Late'
              ? '2'
              : attendance === 'Late with Excuse'
              ? '3'
              : attendance === 'Early Dismissall'
              ? '4'
              : '5',
          attNotes: attNotes || '', // Pass the attendance notes if available
        })),
    };

    console.log('------------------', finalData);

    try {
      const response = await AttendenceData(finalData);

      if (response) {
        setAttendanceData(
          attendanceData.map(student => ({...student, attendance: 'NA'})),
        );

        Toast.show({
          type: 'success',
          position: 'top',
          topOffset: hp('5%'),
          text1: 'Attendance Saved',
          text2: 'Your attendance data has been saved successfully.',
          visibilityTime: 4000,
        });

        navigation.goBack();
        setSearch('');
        setFilteredData(data.students);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);

      Toast.show({
        type: 'error',
        position: 'top',
        topOffset: hp('5%'),
        text1: 'Error',
        text2: 'Failed to save attendance data. Please try again.',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assest/icons/SideBarBg.jpg')}>
      <TopBar title="Attendance" />
      <View style={styles.container}>
        {filteredData.length === 0 ? (
          <View style={styles.noDataFoundContainer}>
            <Text style={styles.noDataFoundText}>
              No Students in this Class
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({item}) => (
              <AttendanceCard
                student={item}
                onAttendanceSelect={handleAttendance}
              />
            )}
            keyExtractor={item => item.studentRollId}
          />
        )}
        {filteredData.length === 0 ? null : (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveAttendance}>
            <Text style={styles.saveButtonText}>Save Attendance</Text>
          </TouchableOpacity>
        )}
      </View>
      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
  },
  searchBar: {
    padding: wp('2%'),
    marginVertical: hp('2%'),
    borderRadius: wp('2%'),
    backgroundColor: '#fff',
  },
  noDataFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataFoundText: {
    fontSize: wp('4%'),
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    padding: wp('4%'),
    backgroundColor: '#645d5d',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
  },
});

export default AttendanceListScreen;
