import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import TopBar from '../../components/TopBar';
import {
  AssigmentAddData,
  sectionsData,
  SubjectAndTeacherData,
} from '../../config/axios';
import Toast from 'react-native-toast-message';
import {sectionsApiResponce} from '../../types';
import NoDataFound from '../no_data_found/NoDataFound';
import {DrawerActions, useNavigation} from '@react-navigation/native';

interface Section {
  classId: number;
  id: number;
  sectionName: string;
  sectionTitle: string;
  teacherId: any[];
}

const {width} = Dimensions.get('window');

const AddAssignmentScreen = () => {
  const [title, setTitle] = useState('');
  const [data, setData] = useState<sectionsApiResponce | null>(null);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [subjectData, setsubjectData] = useState<any>();
  // console.log(subjectData);

  const navigation = useNavigation();

  useEffect(() => {
    loadData(); // Initial data load
  }, []);

  useEffect(() => {
    if (data) {
      // Extract sections data and filter sections with classId 48
      const sections = Object.values(data.sections).flat();
      const filtered = sections.filter(section => section.classId === 48);
      setFilteredSections(filtered);
    }
  }, [data]);

  const loadData = async () => {
    try {
      const response = await SubjectAndTeacherData();
      setsubjectData(response.subjects || []);

      const data = await sectionsData();
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(false);
    setDeadline(currentDate);
  };

  const addAssignment = async () => {
    if (!title || !description || !file) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill out all fields and attach a file.',
      });
      return;
    }

    setLoading(true); // Show the loader

    const date = new Date(deadline);

    // Extract the year, month, and day directly to avoid time zone issues
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year}`;
    console.log(formattedDate);
    try {
      const assignmentData = {
        classId: [selectedClass],
        sectionId: [selectedSection.toString()],
        subjectId: subject,
        teacherId: 1,
        AssignTitle: title,
        AssignDescription: description,
        AssignDeadLine: formattedDate,
      };

      const data = await AssigmentAddData(assignmentData);
      console.log('data ', data);

      if (data?.message === 'Assignment created successfully') {
        Toast.show({
          type: 'success',
          text1: 'Assignment Added',
          text2: 'Assignment created successfully',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add assignment',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };
  const handleMenuPress = React.useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../assest/icons/SideBarBg.jpg')}>
      <TopBar
        title="Assignment"
        // onMenuPress={handleMenuPress}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Assignment Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Assignment Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter Description"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Deadline</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePicker}>
            <Text style={styles.dateText}>{deadline.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <View style={styles.datePickerContainer}>
            {showDatePicker && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={onDateChange}
                textColor="black"
              />
            )}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Assignment File</Text>
          <TouchableOpacity onPress={selectFile} style={styles.fileButton}>
            <Text style={styles.fileButtonText}>Select File</Text>
          </TouchableOpacity>
          <View style={{}}>
            {file ? (
              <Text style={styles.fileName}>{file?.[0]?.name}</Text>
            ) : (
              <Text style={styles.fileName}>No File</Text>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Year</Text>
          <Picker
            selectedValue={selectedClass}
            onValueChange={itemValue => {
              setSelectedClass(itemValue);
              // Filter sections based on selected class
              const sections = Object.values(data.sections).flat();
              const filtered = sections.filter(
                section => section.classId === parseInt(itemValue),
              );
              setFilteredSections(filtered);
              setSelectedSection(''); // Reset selected section
            }}
            style={styles.picker}>
            <Picker.Item label="Select Year" />
            {data &&
              Object.entries(data.classes).map(([key, value]) => (
                <Picker.Item key={key} label={value} value={key} />
              ))}
          </Picker>
        </View>
        {selectedClass && filteredSections.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Class</Text>
            <Picker
              selectedValue={selectedSection}
              onValueChange={itemValue => setSelectedSection(itemValue)}
              style={styles.picker}>
              {filteredSections.map(section => (
                <Picker.Item
                  key={section.id}
                  label={section.sectionName}
                  value={section.classId}
                />
              ))}
            </Picker>
          </View>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Subjects</Text>
          <Picker
            selectedValue={subject}
            onValueChange={itemValue => setSubject(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Select Subject" />
            {subjectData?.map((sub: any, index: number) => (
              <Picker.Item
                label={sub.subjectTitle}
                value={sub.id}
                key={index}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addAssignment}
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Assignment</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  input: {
    // other styles you might have
    backgroundColor: 'white', // Remove background color
    borderBottomWidth: 1, // Optional: adds a border below the input field
    borderBottomColor: '#ccc', // Optional: color of the border
    color: '#fffff', // Optional: text color
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top', // Ensures text starts at the top of the TextInput
  },
  datePicker: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateText: {
    color: 'black',
  },
  fileButton: {
    backgroundColor: '#f80d0d',
    padding: 12,
    width: '40%',
    borderRadius: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fileButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fileName: {
    color: '#ffffff',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#2d7ca3',
    padding: 16,
    paddingVertical: 10,
    borderRadius: 3,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddAssignmentScreen;
