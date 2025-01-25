import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface Student {
  id: number;
  name: string;
  admissionNumber: string;
  attendance: number;
  attNotes?: string;
}

interface AttendanceCardProps {
  student: Student;
  onAttendanceSelect: (
    id: number,
    attendance: number,
    attNotes: string,
  ) => void;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  student,
  onAttendanceSelect,
}) => {
  const [selectedAttendance, setSelectedAttendance] = useState(student.attendance);
  const [selectedAttNotes, setSelectedAttNotes] = useState(student.attNotes || '');

  useEffect(() => {
    setSelectedAttendance(student.attendance);
    setSelectedAttNotes(student.attNotes || '');
  }, [student.attendance, student.attNotes]);

  const handleAttendanceSelect = (status: string, index: number) => {
    setSelectedAttendance(index);
    setSelectedAttNotes(status);
    const notes = status !== 'N/A' ? status : 'No attendance selected';
    onAttendanceSelect(student.id, index, notes);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.admissionNumber}>{student.admissionNumber}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.attendanceLabel}>Attendance </Text>
        <Text style={styles.attendanceValue}>{selectedAttNotes}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonRow}>
          {['Present', 'Absent', 'Late'].map((status, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                selectedAttendance === index && styles.selectedButton,
              ]}
              onPress={() => handleAttendanceSelect(status, index)}>
              <Text
                style={[
                  styles.buttonText,
                  selectedAttendance === index && styles.selectedButtonText,
                ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.buttonRow}>
          {['Late With Excuse', 'Early Dismissal'].map((status, index) => (
            <TouchableOpacity
              key={index + 3} // Adding 3 to avoid key duplication
              style={[
                styles.button,
                selectedAttendance === index + 3 && styles.selectedButton,
              ]}
              onPress={() => handleAttendanceSelect(status, index + 3)}>
              <Text
                style={[
                  styles.buttonText,
                  selectedAttendance === index + 3 && styles.selectedButtonText,
                ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  name: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#000',
  },
  admissionNumber: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#000',
  },
  body: {
    marginBottom: hp('2%'),
  },
  attendanceLabel: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#000',
  },
  attendanceValue: {
    fontSize: wp('3.5%'),
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'column',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  button: {
    flex: 1,
    margin: wp('1%'),
    padding: wp('2%'),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: wp('2%'),
  },
  selectedButton: {
    backgroundColor: '#212463',
  },
  buttonText: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#000',
  },
  selectedButtonText: {
    color: '#fff',
  },
});

export default AttendanceCard;