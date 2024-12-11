import React, {useState} from 'react';
import {View, Modal, StyleSheet, ToastAndroid, Platform} from 'react-native';

import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import FontAwesome5 from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import {AssigmentAddData, studentAssignmentAddedData} from '../../config/axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NewsBoardProps {
  data: any;
}
const Container = styled.View`
  padding: 20px;
  flex-direction: row;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin: 15px 20px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
`;

const HeaderText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const SubHeaderText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
`;

const Row = styled.View`
  justify-content: space-between;
  align-items: center;
`;

const ImageView = styled.Image`
  width: 40px;
  height: 40px;
  margin-right: 15px;
`;

const DateView = styled.View`
  flex-direction: column;
`;

const AboveDateText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #555;
`;

const CurrentDateText = styled.Text`
  font-size: 14px;
  color: #888;
`;

const Button = styled.TouchableOpacity`
  background-color: #4a82aa;
  padding: 12px;
  margin-bottom: 12px;
  width: 65%;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
`;

const ButtonIcon = styled.Image`
  width: 22px;
  height: 22px;
`;

const AssignmentComponent: React.FC<NewsBoardProps> = ({data}) => {
  console.log(data);

  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleDownload = async () => {
    const dummyImageUrl = 'https://via.placeholder.com/150';
    const fileName = dummyImageUrl.split('/').pop();
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    setModalVisible(true); // Show modal when download starts

    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: dummyImageUrl,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        // Hide the modal after 1 second upon successful download
        setTimeout(() => {
          setModalVisible(false);
        }, 1000);

        Toast.show({
          type: 'success',
          text1: 'Download Complete',
          text2: `The image has been successfully downloaded to ${filePath}.`,
          position: 'top',
        });
      } else {
        setModalVisible(false); // Hide modal if download fails
        Toast.show({
          type: 'error',
          text1: 'Download Failed',
          text2: `Failed with status code ${downloadResult.statusCode}.`,
          position: 'top',
        });
      }
    } catch (error) {
      setModalVisible(false); // Hide modal if an error occurs
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: 'There was an error downloading the image.',
        position: 'top',
      });
    }
  };
  const handleCheckDeadline = async () => {
    console.log('Deadline Check Triggered:', data);

    const deadline = data?.AssignDeadLine;
    if (deadline) {
      const [day, month, year] = deadline.split('/').map(Number);
      const deadlineDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate <= deadlineDate) {
        console.log('Assignment added.');

        const tokenString = await AsyncStorage.getItem('loginData');
        if (tokenString) {
          try {
            const parsedToken = JSON.parse(tokenString);
            console.log(parsedToken.user.id);

            const fetchAssignmentData = async () => {
              const tokenString = await AsyncStorage.getItem('loginData');
              if (tokenString) {
                try {
                  const parsedToken = JSON.parse(tokenString);
                  const userId = parsedToken?.user?.id;
                  if (userId) {
                    const assignmentData = await studentAssignmentAddedData(
                      userId,
                    );
                    // console.log('Assignment Data:', assignmentData);
                    const assignmentResponceMessage = assignmentData.message;

                    if (Platform.OS === 'android') {
                      ToastAndroid.showWithGravity(
                        assignmentResponceMessage,
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM, // Set to BOTTOM to display at the bottom
                      );
                    }
                  } else {
                    console.log('User ID is not available.');
                  }
                } catch (error) {
                  console.error('Error parsing JSON:', error);
                }
              }
            };

            fetchAssignmentData();
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        }

        // Show a simple Android toast at the bottom of the screen
      } else {
        console.log('Deadline has passed.');

        // Show a simple Android toast at the bottom of the screen
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(
            'You cannot add the assignment as the deadline has passed.',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM, // Set to BOTTOM to display at the bottom
          );
        }
      }
    }
  };
  return (
    <Container>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View>
          <HeaderText>{data?.AssignTitle}</HeaderText>
          <SubHeaderText>{data?.AssignDescription}</SubHeaderText>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ImageView
            source={require('../../assest/icons/icon_pages_date.png')}
          />
          <DateView>
            <AboveDateText>Assignment</AboveDateText>
            <CurrentDateText>{data?.AssignDeadLine}</CurrentDateText>
          </DateView>
        </View>
      </View>
      <View style={{width: '25%', alignItems: 'center'}}>
        <Row>
          {data?.AssignFile && (
            <Button onPress={handleDownload}>
              <FontAwesome5 name="download" size={20} color="#ffffff" />
            </Button>
          )}
          <Button
            onPress={() =>
              navigation.navigate('AssignemntUploadList', {id: data.id})
            }>
            <ButtonIcon
              source={require('../../assest/icons/menu_answer.png')}
            />
          </Button>
          <Button onPress={handleCheckDeadline}>
            <ButtonIcon
              source={require('../../assest/icons/menu_answer.png')}
            />
          </Button>
        </Row>
      </View>
      <Toast />

      {/* Modal for Lottie Animation */}
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <LottieView
              source={require('../../assest/Successful.json')}
              autoPlay
              loop={false}
              style={{width: 100, height: 100}}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '25%',
    paddingVertical: '10%',
    borderRadius: 10,
    backgroundColor: '#ffffff', // White background for the modal content
  },
});

export default AssignmentComponent;
