import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import RNFS from 'react-native-fs'; // Import react-native-fs
import TopBar from '../TopBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AssignUploadListData} from '../../config/axios';
import {useRoute} from '@react-navigation/native';
import NoDataFound from '../no_data_found/NoDataFound';

const AssignmentUploadList = () => {
  const [assignmentData, setAssignmentData] = useState([]);
  const route = useRoute();
  const {id} = route.params || {};

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const data = await AssignUploadListData(id);
        console.log('Fetched assignment upload list data:', data);
        setAssignmentData(data);
      } catch (error) {
        console.error('Error fetching assignment upload list data:', error);
      }
    };

    fetchAssignmentData();
  }, [id]);

  const handleDownload = async fileUrl => {
    try {
      // Request storage permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show(
            'Storage permission is required to download files.',
            ToastAndroid.LONG,
          );
          return;
        }
      }

      // Prepend base URL if fileUrl is relative
      const BASE_URL = 'https://sms.psleprimary.com/'; // Adjust this to your base URL
      const fullUrl = fileUrl.startsWith('http')
        ? fileUrl
        : `${BASE_URL}/${fileUrl}`;

      const downloadDest = `${RNFS.DownloadDirectoryPath}/${fullUrl
        .split('/')
        .pop()}`;

      const options = {
        fromUrl: fullUrl,
        toFile: downloadDest,
        background: true,
        begin: res => {
          console.log('Download started');
        },
        progress: res => {
          let progressPercent = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${Math.floor(progressPercent)}%`);
        },
      };

      const result = await RNFS.downloadFile(options).promise;

      if (result.statusCode === 200) {
        ToastAndroid.show(
          `File downloaded to: ${downloadDest}`,
          ToastAndroid.LONG,
        );
      } else {
        ToastAndroid.show(
          'There was an error downloading the file.',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      ToastAndroid.show(
        'There was an error downloading the file.',
        ToastAndroid.LONG,
      );
    }
  };

  const renderItem = ({item}) => {
    const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${item?.id}`;
    return (
      <View style={styles.card}>
        <View style={styles.header2}>
          <Image source={{uri: imageUrl}} style={styles.profileImage} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>{item.fullName || 'N/A'}</Text>
            <Text style={styles.subtitle}>Admin</Text>
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownload(item.AssignFile)}>
            <Icon name="download" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../assest/icons/icon_pages_class.png')}
            style={{width: 30, height: 30}}
          />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Class</Text>
            <Text style={styles.value}>{item.className || 'NA'}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Image
            source={require('../../assest/icons/icon_pages_date.png')}
            style={{width: 30, height: 30}}
          />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Time Applied</Text>
            <Text style={styles.value}>{item.userTime}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Image
            source={require('../../assest/icons/icon_pages_notes.png')}
            style={{width: 30, height: 30}}
          />
          <View style={styles.textContainer}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{item.userNotes}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.container}>
      <TopBar title="Assignment" />
      {assignmentData.length > 0 ? (
        <FlatList
          data={assignmentData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <NoDataFound noFoundTitle="NO DATA FOUND" />
        </View>
      )}
    </ImageBackground>
  );
};

export default AssignmentUploadList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    fontSize: 14,
    color: 'black',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 50,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  textContainer: {
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
  },
});
