import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  MainStackParamList,
  StudentApiRespoce,
  studentsItem,
} from '../../../types';
import {StudentsData} from '../../../config/axios';
import TopBar from '../../TopBar';

type SearchScreenRouteProp = RouteProp<MainStackParamList, 'MessageSearch'>;
type SearchScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'MessageSearch'
>;

const MessageSearch = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [data, setData] = useState<StudentApiRespoce | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData(); // Initial data load on component mount
  }, []);

  const loadData = async () => {
    try {
      const response = await StudentsData();
      setData(response);
      console.log('student_screen_data_check ', response);
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (data?.students) {
      const filteredStudents = data.students.filter(
        student =>
          student.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        student.studentRollId
            ?.toLowerCase()
            .includes(searchText.toLowerCase()),
      );
      setSearchResults(filteredStudents);
    }
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../../assest/icons/SideBarBg.jpg')}>
      <TopBar title="Search" />
      <View style={styles.searchContainer}>
        <Text style={styles.label}>Search</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by full name or roll ID"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>SEARCH</Text>
        </TouchableOpacity>
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            console.log(item);

            return (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigation.navigate('ChatScreen', {data: item})}>
                <Text style={styles.resultText}>{item.fullName}</Text>
              <Text style={styles.resultText}>{item.studentRollId}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  searchContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#00AEEF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MessageSearch;
