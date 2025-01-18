import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TopBar from '../TopBar';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'react-native-blob-util';
import {homeworksViewData, StatusAppliedAddData} from '../../config/axios';

export interface Homework {
  classes: string;
  homeworkDate: string;
  homeworkDescription: string;
  homeworkEvaluationDate: string;
  homeworkFile: string;
  homeworkSubmissionDate: string;
  homeworkTitle: string;
  id: number;
  sections: string;
  subject: string;
  subjectId: number;
}

interface Student {
  id: string;
  name: string;
  applied: boolean;
  imageUri: string;
}

const HomeWorkInsideComponent: React.FC = () => {
  const route = useRoute();
  const {data} = route.params as {data: Homework};
  const [homework, setHomeworkData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${data?.id}`;

  const handleStatusChange = async (
    homeworkId: number,
    studentId: number,
    status: number,
  ) => {
    setLoading(true);
    try {
      const response = await StatusAppliedAddData(
        homeworkId,
        studentId,
        status,
      );
      await fetchHomeworkData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Unable to update status',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeworkData = async () => {
    setLoading(true);
    try {
      const response = await homeworksViewData(data.id);
      setHomeworkData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Fetch Failed',
        text2: 'Unable to fetch homework data',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworkData();
  }, []);

  const handleDownload = async () => {
    const fileUrl = 'https://sms.psleprimary.com/uploads/homeworks/';
    const fileName = data.homeworkFile;

    try {
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
      }).fetch('GET', fileUrl);

      const filePath = `${res.path()}/${fileName}`;

      Toast.show({
        type: 'success',
        text1: 'Download Complete',
        text2: `File saved to $src\components\homework_component\HomeWorkInsideComponent.tsx`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: 'Something went wrong!',
      });
    }
  };

  const renderItem = ({item}: {item: {id: number; name: string}}) => {
    const imageUrl2 = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${item?.id}`;
    return (
      <View style={styles.studentContainer}>
        <View style={styles.studentInfo}>
          <Image
            source={
              item?.id
                ? {uri: imageUrl2}
                : require('../../assest/icons/SideBarBg.jpg')
            }
            style={styles.studentImage}
          />
          <View style={{width: '65%'}}>
            <Text style={styles.studentName}>{item.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.statusContainer}
          onPress={() => handleStatusChange(data.id, item.id, 0)}>
          <Image
            source={require('../../assest/icons/delete.png')}
            style={{width: 15, height: 15}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItemNotApplied = ({item}: {item: {id: number; name: string}}) => {
    const imageUrl3 = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${item?.id}`;
    return (
      <View style={styles.studentContainer}>
        <View style={styles.studentInfo}>
          <Image
            source={
              item?.id
                ? {uri: imageUrl3}
                : require('../../assest/icons/SideBarBg.jpg')
            }
            style={styles.studentImage}
          />
          <View style={{width: '65%'}}>
            <Text style={styles.studentName}>{item.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.statusContainer}
          onPress={() => handleStatusChange(data.id, item.id, 1)}>
          <Image
            source={require('../../assest/icons/icon_pages_pass.png')}
            style={{width: 15, height: 15}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const transformedData = Object.entries(
    homework?.student_not_applied || {},
  ).map(([id, name]) => ({
    id,
    name,
  }));
  const transformedData2 = Object.entries(homework?.student_applied || {}).map(
    ([id, name]) => ({
      id,
      name,
    }),
  );

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.container}>
      <TopBar title="Homework" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header2}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{data.homeworkTitle}</Text>
            <Text style={styles.description}>{data.homeworkDescription}</Text>
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownload}>
            <Icon name="download" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Image
              source={
                data?.id
                  ? {uri: imageUrl}
                  : require('../../assest/icons/download.jpg')
              }
              style={{width: 45, height: 45}}
            />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Teacher</Text>
              <Text style={styles.value}>Admin</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Image
              source={require('../../assest/icons/icon_pages_end_time.png')}
              style={{width: 30, height: 30}}
            />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{data.homeworkDate}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Image
              source={require('../../assest/icons/icon_pages_start_time.png')}
              style={{width: 30, height: 30}}
            />
            <View style={styles.textContainer}>
              <Text style={styles.label}>
                Submission Date - Evaluation Date
              </Text>
              <Text
                style={
                  styles.value
                }>{`${data.homeworkSubmissionDate} - ${data.homeworkEvaluationDate}`}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Image
              source={require('../../assest/icons/icon_pages_class.png')}
              style={{width: 30, height: 30}}
            />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Year</Text>
              <Text style={styles.value}>7</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Image
              source={require('../../assest/icons/icon_pages_subjects.png')}
              style={{width: 25, height: 25}}
            />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Class</Text>
              <Text style={styles.value}>{data.classes}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Image
              source={require('../../assest/icons/icon_pages_subjects.png')}
              style={{width: 25, height: 25}}
            />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Subjects</Text>
              <Text style={styles.value}>{data.subject}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View>
            <Text style={styles.sectionHeader}>Answers</Text>
          </View>
          <View style={styles.container2}>
            <View style={styles.answersContainer}>
              <View style={styles.rowContainer}>
                <View style={styles.section}>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.appliedTitle}>Applied</Text>
                  </View>
                  <FlatList
                    data={transformedData2}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.flatList}
                  />
                </View>
                <View style={styles.section}>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.notAppliedTitle}>Not Yet Applied</Text>
                  </View>
                  <FlatList
                    data={transformedData}
                    renderItem={renderItemNotApplied}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.flatList}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header2: {
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  headerContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#fff',
  },
  downloadButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#666666',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  container2: {
    backgroundColor: '#ffffff',
  },
  answersContainer: {
    marginTop: 15,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  sectionTitleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  appliedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1bd62a',
  },
  notAppliedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#eb3616',
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginRight: '20%',
    borderRadius: 10,
    padding: 8,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  statusContainer: {
    paddingVertical: 4,
    borderRadius: 4,
  },
  flatList: {
    paddingBottom: 10,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeWorkInsideComponent;