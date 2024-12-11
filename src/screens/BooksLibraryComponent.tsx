import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Octicons';
import LottieView from 'lottie-react-native';
import RNFetchBlob from 'rn-fetch-blob';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

const BooksLibraryComponent = ({ data }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const downloadPdf = async () => {
    setIsDownloading(true);
    setShowModal(true);
    try {
      const { dirs } = RNFetchBlob.fs;
      const filePath = `${dirs.DocumentDir}/${data.bookName}.pdf`;

      await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
      })
        .fetch('GET', `https://sms.psleprimary.com/uploads/books/${data.bookFile}`)
        .then(() => {
          setDownloadComplete(true);
        })
        .catch(() => {
          setDownloadComplete(false);
        });
    } catch {
      setDownloadComplete(false);
    } finally {
      setIsDownloading(false);
      setTimeout(() => setShowModal(false), 3000); // Close modal after 3 seconds
    }
  };

  return (
    <Container>
      <View style={styles.headerContainer}>
        <View>
          <HeaderText>{data?.bookName}</HeaderText>
          <SubHeaderText>
            {data?.bookDescription ? data?.bookDescription : 'N/A'}
          </SubHeaderText>
        </View>
        {!data.bookFile || data.bookFile === '' ? null : (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadPdf}
            disabled={isDownloading}
          >
            <Icon name="download" size={screenWidth * 0.05} color="white" />
          </TouchableOpacity>
        )}
        {data?.bookPrice === '' ? null : (
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>Price : {data?.bookPrice ? data?.bookPrice : 'N/A'}</Text>
          </View>
        )}
      </View>
      <Row>
        <ImageView source={require('../assest/icons/icon_pages_date.png')} />
        <DateView>
          <AboveDateText>Book Author</AboveDateText>
          <CurrentDateText>
            {data?.bookAuthor ? data?.bookAuthor : 'N/A'}
          </CurrentDateText>
        </DateView>
      </Row>

      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <LottieView
              source={
                downloadComplete
                  ? require('../assest/Successful.json')
                  : require('../assest/Successful.json')
              }
              autoPlay
              loop={!downloadComplete}
              style={styles.lottieView}
            />
            <Text style={styles.message}>
              {downloadComplete ? 'Download Successful' : 'Downloading...'}
            </Text>
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: screenWidth * 0.8,
    // padding: screenWidth * 0.01,
    backgroundColor: 'white',
    borderRadius: screenWidth * 0.02,
    alignItems: 'center',
  },
  lottieView: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
  },
  message: {
    marginTop: screenHeight * 0.02,
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BooksLibraryComponent;
