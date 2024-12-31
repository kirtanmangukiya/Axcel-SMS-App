import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  StripeStatusData,
  deleteInvoiceDoc,
  invoiceUploadData,
} from '../config/axios';

import ActivityIndicatorComponent from '../components/activity_indicator/ActivityIndacatorr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MD5 from 'react-native-md5';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';

const InvoiceComponent = ({data, onInvoiceChange}) => {
  const [loading, setLoading] = useState(false);
  const [sessionUrl, setSessionUrl] = useState(null);
  const [stripeStatus, setStripeStatus] = useState(null);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // console.log('invoice data compoent ', data);

  const handleViewDoc = useCallback(
    async fileName => {
      try {
        console.log(fileName);

        // Get the file extension
        const fileExtension = fileName.split('.').pop().toLowerCase();

        if (fileExtension === 'pdf') {
          // If it's a PDF, log it
          // console.log('This is a PDF file:', fileName);
          navigation.navigate('PdfShowComponent', {
            pdfUrl: '661c9af674843.pdf',
          });
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          // If it's an image, show it in full-screen
          const base_url = 'https://sms.psleprimary.com/uploads/user_receipts';
          const imagePath = `${base_url}/${fileName}`;

          // Check if the file exists before trying to display it
          // const fileExists = await RNFetchBlob.fs.exists(imagePath);
          navigation.navigate('WebViewComponent2', {url: imagePath});
        } else {
          console.log('Unsupported file type:', fileName);
        }
      } catch (error) {
        console.error('Error handling file:', error);
      }
    },
    [navigation],
  );

  // const handleViewDoc = useCallback(
  //   async fileName => {
  //     navigation.navigate('PdfShowComponent', {pdfUrl: '661c9af674843.pdf'});
  //   },
  //   [navigation],
  // );

  const handleFullView = useCallback(
    async fileName => {
      const id = data?.id;
      if (id) {
        const generatedHash = MD5.hex_md5(
          data?.invoicePyaments?.[0]?.paymentTitle,
        ); // Generate the MD5 hash from the id
        console.log('---------------------', generatedHash);

        const googleDriveUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=`;
        const pdfFileUrl = `https://axcel.schoolmgmtsys.com/getpdf.php?getInv=${generatedHash}`;

        // Combine googleDriveUrl with the pdfFileUrl to get the complete URL
        const pdfUrl = `${googleDriveUrl}${pdfFileUrl}`;

        // Navigate to PdfShowComponent2 with the PDF URL
        navigation.navigate('PdfShowComponent2', {
          pdfUrl, // Pass the pdfUrl
        });
      } else {
        console.log('ID is missing.');
      }
    },
    [navigation, data],
  );

  useEffect(() => {
    loadStripeStatus(); // Initial data load
  }, []);

  const loadStripeStatus = useCallback(async () => {
    setLoading(true);
    try {
      const stripeData = await StripeStatusData(); // Replace with actual API call
      setStripeStatus(stripeData); // Set stripeStatus data
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePayBill = useCallback(async () => {
    console.log('handlePayBill called');
    setLoading(true);

    try {
      // Log before making the API call
      console.log('Preparing request with data:', {
        // parentId: 770,
        studentId: data?.studentId,
        invoiceId: data?.id,
      });

      const response = await fetch(
        'https://sms.psleprimary.com/api/process-payment',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            // parentId: 770,
            studentId: data?.studentId,
            invoiceId: data?.id, // or another relevant ID
          }),
        },
      );

      console.log('API request sent. Awaiting response...');

      const responseData = await response.json();

      // Log the response data
      console.log('Response received:', responseData);

      setLoading(false);

      if (responseData.sessionUrl) {
        console.log(
          'Navigating to WebViewComponent with URL:',
          responseData.sessionUrl,
        );
        navigation.navigate('WebViewComponent', {url: responseData.sessionUrl});
      } else {
        console.log(
          'No sessionUrl in response. Showing alert with response data.',
        );
        Alert.alert(
          'Payment Processed',
          `Response: ${JSON.stringify(responseData)}`,
        );
      }
    } catch (error) {
      setLoading(false);
      // Log the error if any
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to process payment');
    }
  }, [navigation]);

  const handleDeleteDoc = useCallback(async () => {
    if (!selectedDocId) return;
    setIsDeleting(true);
    setLoading(true);
    try {
      await deleteInvoiceDoc(selectedDocId);
      onInvoiceChange(); // Notify parent to refresh data
      Toast.show({
        type: 'success',
        text1: 'Document Deleted',
        text2: 'Document deleted successfully',
      });
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to delete document:', error);
      Alert.alert('Error', 'Failed to delete document');
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  }, [selectedDocId, onInvoiceChange]);

  const handlePickImage = useCallback(async () => {
    try {
      const tokenString = await AsyncStorage.getItem('loginData');
      if (!tokenString) {
        throw new Error('No token found');
      }

      const loginData = JSON.parse(tokenString);
      const firebaseToken = loginData?.user?.firebase_token;

      if (!firebaseToken) {
        throw new Error('No Firebase token found');
      }

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (res && res.length > 0) {
        const {uri, name, type} = res[0];
        const base64Data = await RNFS.readFile(uri, 'base64');

        try {
          await invoiceUploadData({
            fileName: name,
            fileMimetype: type,
            fileExtension: name.split('.').pop(),
            fileData: base64Data,
            firebaseToken: firebaseToken,
            paymentId: data?.invoicePyaments?.[0]?.id || 'defaultPaymentId',
          });

          onInvoiceChange(); // Notify parent to refresh data
        } catch (uploadError) {
          console.error('Upload error: ', uploadError);
          Alert.alert('Error', 'Failed to upload the invoice');
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error('Image pick error:', err);
        Alert.alert('Error', 'Failed to pick the image');
      }
    }
  }, [data, onInvoiceChange]);

  if (sessionUrl) {
    return (
      <View style={styles.webviewContainer}>
        <WebView source={{uri: sessionUrl}} />
      </View>
    );
  }

  const funcConsole = () => {
    console.log('Hello', data);
  };

  // console.log(data?.id);
  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${data?.id}`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleFullView('receipt_660e4a0a6cd2b.jpeg')}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicatorComponent />
        </View>
      )}
      <View style={styles.leftSection}>
        <Text style={styles.invoiceNumber}>
          {data?.invoicePyaments?.[0]?.paymentTitle || 'N/A'}
        </Text>
        <Text style={styles.description}>
          {data?.invoicePyaments?.[0]?.paymentDescription || 'N/A'}
        </Text>
        <View style={styles.studentSection}>
          <Image
            // source={require('../assest/icons/download.jpg')}
            source={
              data?.id
                ? {uri: imageUrl}
                : require('../assest/icons/SideBarBg.jpg')
            }
            style={styles.avatar}
          />
          <View style={styles.studentInfo}>
            <Text style={styles.studentLabel}>Student</Text>
            <Text style={styles.studentName}>{data?.fullName || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.dueDateSection}>
          <Image
            source={require('../assest/icons/icon_pages_date.png')}
            style={styles.calendarIcon}
          />
          <View style={styles.dueDateInfo}>
            <Text style={styles.dueDateLabel}>Due Date</Text>
            <Text style={styles.dueDate}>{data?.dueDate}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.amountContainer}>
          <TouchableOpacity
            onPress={() => handleFullView()}
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginBottom: '4%',
              borderRadius: 20,
              backgroundColor: '#d9534f',
            }}>
            <Text style={styles.paid}>Amount:</Text>
            <Text style={styles.amount}>
              {data?.invoicePyaments?.[0]?.paymentAmount
                ? data.invoicePyaments[0].paymentAmount.toFixed(2)
                : 'N/A'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.paidContainer}>
          <Text style={styles.paidLabel}>PAID:</Text>
          <Text style={styles.paid}>
            {data?.invoicePyaments?.[0]?.paidAmount}
          </Text>
        </View> */}
        <View style={styles.amountContainer}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: '#d9534f',
            }}>
            <Text style={styles.paid}>PAID:</Text>
            <Text style={styles.paid}>
              {data?.invoicePyaments?.[0]?.paymentStatus === 1
                ? data.invoicePyaments[0].paymentAmount.toFixed(2)
                : '0'}
            </Text>
          </View>
        </View>
        <Text style={styles.paymentStatus}>
          {data?.invoicePyaments?.[0]?.paymentStatus === 1 ? 'PAID' : data?.invoicePyaments?.[0]?.paymentStatus === 2 ? 'PARTIALLY PAID' : 'UNPAID'}
        </Text>
        <TouchableOpacity
          style={[styles.button, {marginLeft: '10%'}]}
          onPress={handlePickImage}>
          <Text style={styles.buttonText}>Upload Receipt</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          {data?.receipt?.map((item, index) => (
            <View key={index} style={styles.docContainer}>
              <TouchableOpacity
                style={styles.viewDocButton}
                onPress={() => handleViewDoc(item.file_name)}
                disabled={isDeleting}>
                <Text style={styles.viewDocButtonText}>View Doc</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteDocButton}
                onPress={() => {
                  setSelectedDocId(item.id);
                  setModalVisible(true);
                }}>
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {data?.invoicePyaments?.[0]?.paymentStatus === 1 ? null : (
            <TouchableOpacity style={styles.button} onPress={handlePayBill}>
              <Text style={styles.buttonText}>PAY BILL</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Document</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this document?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={handleDeleteDoc}>
                {isDeleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

// Define styles outside the component

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    marginVertical: 8,
    elevation: 2,
    flex: 1,
  },
  leftSection: {
    flex: 4, // 30% width
    paddingHorizontal: 10,
  },
  invoiceNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  description: {
    color: '#555',
    marginBottom: 16,
  },
  studentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  studentInfo: {
    marginLeft: 8,
    flex: 1,
  },
  studentLabel: {
    fontSize: 12,
    color: '#555',
  },
  studentName: {
    fontWeight: 'bold',
    color: '#555',
  },
  dueDateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  dueDateInfo: {
    marginLeft: 8,
  },
  dueDateLabel: {
    fontSize: 12,
    color: '#555',
  },
  dueDate: {
    fontWeight: 'bold',
    color:'#555'
  },
  rightSection: {
    flex: 6, // 70% width
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    // borderRadius: 10,
    // marginBottom: 5,
    // padding: 8,
  },
  amountText: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1, // Allows text to shrink if needed
    textAlign: 'center', // Centers text within the container
  },
  amount: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  paidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d9534f',
    width: '50%',
    borderRadius: 20,
    padding: 8, // This will make sure there is space inside around the text
  },
  paidLabel: {
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
  paid: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  paymentStatus: {
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#d9534f',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    // paddingHorizontal: 1,
    borderRadius: 17,
    marginTop: 10,
    width: '75%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  docContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  viewDocButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 8,
  },
  viewDocButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteDocButton: {
    backgroundColor: '#d9534f',
    padding: 6,
    borderRadius: 17,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonDelete: {
    backgroundColor: '#d9534f',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default memo(InvoiceComponent);
