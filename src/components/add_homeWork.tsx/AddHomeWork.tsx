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
  homeworkAddData,
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

const AddHomeWork = () => {
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [data, setData] = useState<sectionsApiResponce | null>(null);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [homeworkDescription, setHomeworkDescription] = useState('');
  const [submissionDate, setSubmissionDate] = useState(new Date());
  const [evaluationDate, setEvaluationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState<
    'submission' | 'evaluation' | null
  >(null);
  const [file, setFile] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [subject, setSubject] = useState('ENGLISH');
  const [loading, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState<boolean>(false);
  const navigation = useNavigation();
  const [subjectData, setsubjectData] = useState<any>();

  useEffect(() => {
    loadData(); // Initial data load
  }, []);

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

  useEffect(() => {
    if (data) {
      // Extract sections data and filter sections with classId 48
      const sections = Object.values(data.sections).flat();
      const filtered = sections.filter(section => section.classId === 48);
      setFilteredSections(filtered);
    }
  }, [data]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (showDatePicker === 'submission') {
      setSubmissionDate(selectedDate || submissionDate);
    } else if (showDatePicker === 'evaluation') {
      setEvaluationDate(selectedDate || evaluationDate);
    }
    setShowDatePicker(null);
  };

  const addAssignment = async () => {
    if (!homeworkTitle || !homeworkDescription || !file) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill out all fields and attach a file.',
      });
      return;
    }

    try {
      const homeworkParams = {
        classId: [selectedClass],
        sectionId: [selectedSection.toString()],
        subjectId: subject,
        homeworkTitle: homeworkTitle,
        homeworkDescription: homeworkDescription,
        homeworkSubmissionDate: submissionDate.toLocaleDateString(),
        homeworkEvaluationDate: evaluationDate.toLocaleDateString(),
      };
      console.log('chcket the complete ', homeworkParams);

      const response = await homeworkAddData(homeworkParams);
      console.log('response ', response);
      setLoading2(true);

      if (response?.message === 'Assignment created successfully') {
        Toast.show({
          type: 'success',
          text1: 'Homework Added',
          text2: 'Homework created successfully',
        });
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add assignment',
      });
    } finally {
      setLoading2(false);
    }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(res);
      console.log(res?.[0].name);
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
        title="Add Homework"
        //    onMenuPress={handleMenuPress}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Homework Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            placeholderTextColor="#999"
            value={homeworkTitle}
            onChangeText={setHomeworkTitle}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Homework Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter Description"
            placeholderTextColor="#999"
            value={homeworkDescription}
            onChangeText={setHomeworkDescription}
            multiline
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Submission Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker('submission')}
            style={styles.datePicker}>
            <Text style={styles.dateText}>
              {submissionDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker === 'submission' && (
            <DateTimePicker
              value={submissionDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Evaluation Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker('evaluation')}
            style={styles.datePicker}>
            <Text style={styles.dateText}>
              {evaluationDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker === 'evaluation' && (
            <DateTimePicker
              value={evaluationDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Homework File</Text>
          <TouchableOpacity onPress={selectFile} style={styles.fileButton}>
            <Text style={styles.fileButtonText}>Attachment</Text>
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
                <Picker.Item
                  color="black"
                  key={key}
                  label={value}
                  value={key}
                />
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
              <Picker.Item label="Select Class" />
              {filteredSections.map(section => (
                <Picker.Item
                  color="black"
                  key={section.id}
                  label={section.sectionName}
                  value={section.id}
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
        <TouchableOpacity style={styles.addButton} onPress={addAssignment}>
          {loading2 ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.addButtonText}>Add Homework</Text>
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
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // width: width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    // borderRadius: 20,
    // marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    color: '#333',
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
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
    fontWeight: 'bold',
  },
  fileName: {
    marginTop: 8,
    fontSize: 16,
    color: 'black',
  },
  picker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHomeWork;
