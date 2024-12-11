import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ActivityIndacatorr from '../activity_indicator/ActivityIndacatorr';
import {MainStackParamList} from '../../types';

const baseUrlforNewsPdf = 'https://sms.psleprimary.com/uploads/news/';
const baseUrlforStudentPdf =
  'https://sms.psleprimary.com/uploads/student_docs/';

type PDFViewerProps = NativeStackScreenProps<
  MainStackParamList,
  'PdfShowComponent'
>;

const PdfShowComponent: React.FC<PDFViewerProps> = ({route, navigation}) => {
  const {pdfUrl} = route.params;

  const fullPdfUrl =
    route?.params?.routeScreen === 'StudentProfileComponent'
      ? `${baseUrlforStudentPdf}${pdfUrl}`
      : `${baseUrlforNewsPdf}${pdfUrl}`;
  const [isDownloading, setIsDownloading] = useState(true);

  console.log('pdf show url in pdf show compoent ', fullPdfUrl);

  const downloadAndOpenPdf = async () => {
    const {fs} = RNFetchBlob;
    const {dirs} = fs;
    const fileName = pdfUrl.split('/').pop() || 'downloaded.pdf';
    const filePath = `${dirs.DocumentDir}/${fileName}`;

    try {
      const res = await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
      }).fetch('GET', fullPdfUrl);

      await FileViewer.open(res.path(), {showOpenWithDialog: true});
      navigation.goBack();
    } catch (error) {
      console.error('Download and Open error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to download and open PDF',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    downloadAndOpenPdf();
  }, []);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.container}
      resizeMode="cover">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FETCHING PDF</Text>
      </View>

      <View style={styles.content}>
        {isDownloading ? (
          <>
            <ActivityIndacatorr />
            <Text style={styles.fetchingText}>FETCHING DATA</Text>
          </>
        ) : (
          <TouchableOpacity
            style={styles.pdfContainer}
            onPress={downloadAndOpenPdf}>
            <Text style={styles.pdfText}>Tap to retry opening PDF</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fetchingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  pdfContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfText: {
    fontSize: 18,
    color: 'black',
  },
});

export default PdfShowComponent;
