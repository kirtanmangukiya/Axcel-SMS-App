import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  AssignmentApiResponce,
  NewsBoardResponse,
  SubjectApiResponse,
} from '../types';
import {AssignmentsData, InvoiceData, NewsBoardData, SubjectsData} from '../config/axios';
import ActivityIndacatorr from '../components/activity_indicator/ActivityIndacatorr';
// Adjust the import path as necessary

const ApiTesting: React.FC = () => {
  const [subjects, setSubjects] = useState<NewsBoardResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //   console.log('dataaaaaaaaaaaaaaaaaaaaaaaaa vvvvv------------', subjects);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await InvoiceData();

        // setSubjects(data);
        // console.log('-----------------------', data);
      } catch (err) {
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
           <ActivityIndacatorr />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={subjects}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});

export default ApiTesting;
