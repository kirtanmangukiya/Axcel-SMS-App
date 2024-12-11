import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Octicons';
import RNFetchBlob from 'rn-fetch-blob';
import { bookSlibrarayItem } from '../../types';


interface Data {
  material_file: string
  material_description: string
  material_title: string
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface NewsBoardProps {
  title: string;
  subTitle: string;
  date: string;
  imageUri: string;
}

const Container = styled.View`
  padding: ${screenWidth * 0.05}px;
  background-color: white;
  border-radius: ${screenWidth * 0.03}px;
  margin: ${screenWidth * 0.025}px ${screenWidth * 0.05}px;
`;

const HeaderText = styled.Text`
  font-size: ${screenWidth * 0.055}px;
  font-weight: bold;
  color: black;
  margin-bottom: ${screenHeight * 0.005}px;
  
`;

const SubHeaderText = styled.Text`
  font-size: ${screenWidth * 0.04}px;
  margin-bottom: ${screenHeight * 0.025}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ImageView = styled.Image`
  width: ${screenWidth * 0.1}px;
  height: ${screenHeight * 0.05}px;
  margin-right: ${screenWidth * 0.05}px;
`;

const DateView = styled.View`
  flex-direction: column;
`;

const AboveDateText = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  font-weight: bold;
  color: black;
`;

const CurrentDateText = styled.Text`
  font-size: ${screenWidth * 0.04}px;
`;

interface BooksLibraryDataItem {
  data: bookSlibrarayItem;
}

const ResourceAndGuideComponent: React.FC<{ data: Data }> = ({ data }) => {
  console.log(data);

  const requestExternalStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
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
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const downloadPdf = async () => {
    const hasPermission = await requestExternalStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to download the PDF',
      );
      return;
    }

    const { config, fs } = RNFetchBlob;
    const { dirs } = fs;
    const filePath = `${dirs.DownloadDir}/${data.material_file}.pdf`;

    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'Downloading PDF',
      },
    })
      .fetch(
        'GET',
        'https://sms.psleprimary.com/uploads/books/book_652e1f0a69dfc.pdf',
      )
      .then(res => {
        Alert.alert('Download complete', `PDF downloaded to: ${res.path()}`);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Failed to download PDF');
      });
  };

  console.log('data into the library compoent ', data);

  return (
    <Container>
      <View style={styles.headerContainer}>
        <View style={{ width: '75%' }}>
          <HeaderText>{data?.material_title}</HeaderText>
          <SubHeaderText>
            {data?.material_description ? data?.material_description : 'N/A'}
          </SubHeaderText>
        </View>
        {!data.material_file || data?.material_file == '' ? null : (
          <TouchableOpacity style={styles.downloadButton} onPress={downloadPdf}>
            <Icon name="download" size={screenWidth * 0.05} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <Row>
        <ImageView source={require('../../assest/icons/icon_pages_subjects.png')} />
        <DateView>
          <AboveDateText>Subject</AboveDateText>
          <CurrentDateText>
            {data?.subject ? data?.subject : 'N/A'}

          </CurrentDateText>
        </DateView>
      </Row>
      <View style={{ marginTop: '5%' }}>
        <Row>
          <ImageView source={require('../../assest/icons/icon_pages_class.png')} />
          <DateView>
            <AboveDateText>Year</AboveDateText>
            <CurrentDateText>
              {data?.classes ? data?.classes : 'N/A'}
            </CurrentDateText>
          </DateView>
        </Row>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadButton: {
    height: screenHeight * 0.05,
    paddingHorizontal: screenWidth * 0.035,
    backgroundColor: '#2596be',
    borderRadius: screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    borderRadius: screenWidth * 0.1,
    paddingVertical: screenHeight * 0.005,
    paddingHorizontal: screenWidth * 0.02,
  },
  amount: {
    fontSize: screenWidth * 0.03,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: screenWidth * 0.01,
  },
  amountLabel: {
    fontSize: screenWidth * 0.03,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResourceAndGuideComponent;
