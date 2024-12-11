import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {LeaderBoardData, profileImageData} from '../config/axios';
import React, {useEffect, useState} from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import {MainStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const Container = styled.View`
  background-color: white;
  border-radius: 10px;
  padding: ${screenWidth * 0.03}px;
  width: 100%; /* Adjust width to be responsive */
  align-self: center; /* Center the container */
`;

const ProfileContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-bottom: ${screenHeight * 0.02}px;
  margin-top: ${screenHeight * 0.01}px;
  justify-content: space-evenly;
`;

const ProfileImage = styled.Image`
  width: ${screenWidth * 0.18}px;
  height: ${screenHeight * 0.09}px;
  border-radius: ${Math.min(screenWidth * 0.18, screenHeight * 0.09) / 2}px;
`;

const ProfileImage2 = styled.Image`
  width: ${screenWidth * 0.07}px;
  height: ${screenHeight * 0.035}px;
  margin-right: ${screenWidth * 0.03}px;
  border-radius: ${Math.min(screenWidth * 0.07, screenHeight * 0.035) / 2}px;
`;

const NameText = styled.Text`
  margin-bottom: 10px;
  font-size: ${screenWidth * 0.045}px;
  color: black;
  font-weight: bold;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  margin-left: ${screenWidth * 0.02}px;
  margin-top: ${screenHeight * 0.01}px;
  margin-bottom: ${screenHeight * 0.01}px;
`;

const ProfileDocButton = styled(TouchableOpacity)`
  width: ${screenWidth * 0.21}px;
  padding-vertical: ${screenHeight * 0.01}px;
  background-color: #f32e2e;
  border-radius: 20px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin-top: 5px;
  margin-left: 10px;
`;

const InfoTextContainer = styled.View`
  flex-direction: column;
`;

const InfoText = styled.Text`
  font-size: ${screenWidth * 0.04}px;
  font-weight: bold;
  color: black;
`;

const SubText = styled.Text`
  font-size: ${screenWidth * 0.035}px;
  color: gray;
`;

const ChildComponent = styled.View`
  flex-direction: column;
  justify-content: space-evenly;
`;

interface StudentProfileProps {
  studentRollId: string;
  userRole: string;
  name: string;
  id: number;
  username: string;
  email: string;
  profileImageUri: string;
  docs: Array<{file_name: string; file_title: string; id: number}>;
}

type studentNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'StudentProfileComponent'
>;

const StudentProfileComponent: React.FC<StudentProfileProps> = ({
  name,
  username,
  email,
  profileImageUri,
  docs,
  studentRollId,
  userRole,
  id,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaderboardMessage, setLeaderboardMessage] = useState('');
  const [showLottie, setShowLottie] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation<studentNavigationProp>();
  // console.log(
  //   'check the test student ---------------------------------------------',
  //   // id,
  //   // docs,
  //   userRole,
  // );

  const openPdf = (url: string) => {
    console.log('show the url', url);

    navigation.navigate('PdfShowComponent', {
      pdfUrl: '764_66a35647f3f4b.pdf',
      routeScreen: 'StudentProfileComponent',
    });
  };

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleOkClick = () => {
    setIsModalVisible(false);
    setShowLottie(true);
    LeaderBoardData();
    setTimeout(() => setShowLottie(false), 3000); // Hide Lottie after 3 seconds
  };

  console.log('check the profile picture ');

  // useEffect(() => {
  //   const fetchProfileImage = async () => {
  //     try {
  //       const data = await profileImageData(id);
  //       // setProfileImage(data);
  //       console.log('-----------------------------------------------', data);
  //     } catch (error) {
  //       console.error('Error fetching profile image data:', error);
  //     }
  //   };

  //   fetchProfileImage();
  // }, [id]);
  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${id}`;
  return (
    <Container>
      <ProfileContainer>
        <ProfileImage
          source={
            id ? {uri: imageUrl} : require('../assest/icons/download.jpg')
          }
        />
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <NameText>{name || username}</NameText>
          {userRole === 'admin' ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate('ShowListOfAttendence', {
                    id,
                  })
                }>
                <Image
                  source={require('../assest/icons/menu_user.png')}
                  style={styles.iconImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  navigation.navigate('ShowDataScreen', {
                    screenName: 'MarkSheet',
                  })
                }>
                <Image
                  source={require('../assest/icons/A.png')}
                  style={{
                    width: screenWidth * 0.066,
                    height: screenHeight * 0.03,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleButtonClick}>
                <Image
                  source={require('../assest/icons/3rd.png')}
                  style={styles.iconImage}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{marginBottom: '40%'}}></View>
          )}
        </View>
      </ProfileContainer>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 1, paddingRight: '30%'}}>
          <InfoContainer>
            <ProfileImage2
              source={require('../assest/icons/icon_pages_user.png')}
            />
            <InfoTextContainer>
              <InfoText>Username</InfoText>
              <SubText>{studentRollId}</SubText>
            </InfoTextContainer>
          </InfoContainer>
          <InfoContainer>
            <ProfileImage2
              source={require('../assest/icons/icon_pages_email.png')}
            />
            <InfoTextContainer>
              <InfoText>Email Address</InfoText>
              <SubText>{email}</SubText>
            </InfoTextContainer>
          </InfoContainer>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          {/* {userRole === 'admin' || userRole === 'parent'
            ? docs?.map(doc => (
                <ProfileDocButton
                  key={doc.id}
                  onPress={() => openPdf(doc.file_name)}>
                  <Text style={styles.docButtonText}>View Doc</Text>
                </ProfileDocButton>
              ))
            : null} */}
        </View>
      </View>
      {userRole === 'admin' || userRole === 'parent'
        ? docs?.map(doc => (
            <TouchableOpacity
              key={doc.id}
              style={styles.docContainer}
              onPress={() => openPdf(doc.file_name)}>
              <SubText>{doc?.file_title ? doc?.file_title : 'View Doc'}</SubText>
              <Icon name="download-outline" size={20} color="black" />
            </TouchableOpacity>
          ))
        : null}

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Please Enter Leaderboard Message
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Please Enter Leaderboard Message"
              value={leaderboardMessage}
              onChangeText={setLeaderboardMessage}
            />
            <TouchableOpacity onPress={handleOkClick}>
              <Text style={styles.okButton}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal for LottieView */}
      <Modal visible={showLottie} transparent={true} animationType="fade">
        <View style={styles.modalBackground2}>
          <View style={styles.lottieModalContainer2}>
            <LottieView
              source={require('../assest/Successful.json')}
              autoPlay
              loop={false}
              style={styles.lottieView2}
            />
            <Text style={styles.message2}>Update Saved</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: screenWidth * 0.8,
    padding: screenWidth * 0.05,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.02,
  },
  textInput: {
    width: '100%',
    height: screenHeight * 0.06,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: screenWidth * 0.02,
    marginBottom: screenHeight * 0.02,
  },
  okButton: {
    fontSize: screenWidth * 0.04,
    color: '#007BFF',
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lottieModalContainer2: {
    width: screenWidth * 0.8,
    padding: screenWidth * 0.05,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  docContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: screenWidth * 0.025,
    backgroundColor: '#f0f0f0',
    marginVertical: screenHeight * 0.005,
    borderRadius: screenWidth * 0.02,
  },
  lottieView2: {
    width: screenWidth * 0.5,
    height: screenHeight * 0.3,
  },
  message2: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    marginTop: screenHeight * 0.02,
  },
  iconButton: {
    marginHorizontal: screenWidth * 0.01,
    backgroundColor: '#2d7ca3',
    padding: '4%',
    borderRadius: 20,
  },
  iconImage: {
    width: screenWidth * 0.06,
    height: screenHeight * 0.03,
  },
  docButtonText: {
    color: 'white',
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
  },
});

export default StudentProfileComponent;
