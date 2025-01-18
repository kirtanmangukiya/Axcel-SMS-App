import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const Container = styled.View`
  background-color: white;
  border-radius: ${screenWidth * 0.03}px;
  width: ${screenWidth * 0.9}px;
  align-self: center;
  margin-vertical: ${screenHeight * 0.01}px;
`;

const ProfileContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-bottom: ${screenHeight * 0.02}px;
  padding-left: ${screenWidth * 0.04}px;
  margin-top: ${screenHeight * 0.01}px;
  justify-content: space-evenly;
`;

const ProfileImage = styled.Image`
  width: ${screenWidth * 0.18}px;
  height: ${screenWidth * 0.18}px;
  border-radius: ${screenWidth * 0.09}px;
  margin-bottom: ${screenHeight * 0.01}px;
`;

const ProfileImage2 = styled.Image`
  width: ${screenWidth * 0.07}px;
  height: ${screenWidth * 0.07}px;
  margin-right: ${screenWidth * 0.03}px;
  border-radius: ${screenWidth * 0.035}px;
  margin-bottom: ${screenHeight * 0.01}px;
`;

const NameText = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: black;
  font-weight: bold;
`;

const ProfileIcon = styled(Icon).attrs({
  name: 'person',
  size: screenWidth * 0.05,
})`
  margin-top: ${screenHeight * 0.005}px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  margin-left: ${screenWidth * 0.04}px;
  margin-bottom: ${screenHeight * 0.02}px;
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

interface TeacherProfileProps {
  data: object;
}

const TeacherComponent: React.FC<TeacherProfileProps> = ({data, userRole}) => {
  console.log('teacher component Data', data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaderboardMessage, setLeaderboardMessage] = useState('');
  const [showLottie, setShowLottie] = useState(false);

  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${data?.id}`;

  console.log('check the data ------------------------------------', data?.id);

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleOkClick = () => {
    setIsModalVisible(false);
    setShowLottie(true);
    setTimeout(() => setShowLottie(false), 3000); // Hide Lottie after 3 seconds
  };

  return (
    <Container>
      {/* First View */}
      {/* <ProfileContainer>
        <ProfileImage source={require('../assest/icons/download.jpg')} />
        <ChildComponent>
          <NameText>{name ? name : 'UnKnown'}</NameText>
          <View
            style={{
              flexDirection: 'row',
              width: '70%',
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                padding: '5%',
                backgroundColor: 'orange',
                borderRadius: 30,
              }}>
              <ProfileIcon name="person" color={'red'} />
            </View>
            <ProfileIcon name="person" color={'red'} />
            <ProfileIcon name="person" color={'red'} />
          </View>
        </ChildComponent>
      </ProfileContainer> */}
      <View
        style={{
          width: '90%',
          // backgroundColor: 'red',
          marginBottom: '4%',
          marginTop: '4%',
          marginLeft: '5%',

          flexDirection: 'row',
        }}>
        <Image
          source={
            data?.id ? {uri: imageUrl} : require('../../assest/icons/download.jpg')
          }
          style={styles.profileImage}
        />
        <View style={styles.profileInfoContainer}>
          <NameText>{data?.fullName ? data?.fullName : 'N/A'}</NameText>
          <View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleButtonClick}>
              <Image
                source={require('../../assest/icons/3rd.png')}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Second View */}
      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_user.png')}
        />

        <InfoTextContainer>
          <InfoText>Username</InfoText>
          <SubText>{data?.username ? data?.username : 'N/A'}</SubText>
        </InfoTextContainer>
      </InfoContainer>

      {/* Third View */}
      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_email.png')}
        />

        <InfoTextContainer>
          <InfoText>Email Address</InfoText>
          <SubText>{data?.email ? data?.email : 'N/A'}</SubText>
        </InfoTextContainer>
      </InfoContainer>

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
              source={require('../../assest/Successful.json')}
              autoPlay
              loop={false}
              style={styles.lottieView2}
            />
            <Text style={styles.message2}>Update Saved</Text>
            {/* <Button title="Close" onPress={} /> */}
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default TeacherComponent;
const styles = StyleSheet.create({
  profileWrapper: {
    width: '90%',
    marginBottom: screenHeight * 0.02,
    marginTop: screenHeight * 0.02,
    marginLeft: screenWidth * 0.05,
    flexDirection: 'row',
  },
  profileImage: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: screenWidth * 0.075,
  },
  profileInfoContainer: {
    width: '70%',
    marginLeft: screenWidth * 0.05,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  iconButton: {
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.025,
    backgroundColor: '#2596be',
    borderRadius: screenWidth * 0.1,
    justifyContent: 'center',
    marginHorizontal: screenWidth * 0.01,
    alignItems: 'center',
    width: screenWidth * 0.12,
  },
  iconImage: {
    width: screenWidth * 0.05,
    height: screenWidth * 0.08,
    resizeMode: 'contain',
  },
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
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.01,
  },
  textInput: {
    width: '100%',
    height: screenHeight * 0.05,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.03,
    borderRadius: screenWidth * 0.02,
  },
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lottieModalContainer2: {
    width: screenWidth * 0.7,
    padding: screenWidth * 0.03,
    backgroundColor: 'white',
    borderRadius: screenWidth * 0.04,
    alignItems: 'center',
  },
  lottieView2: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
  },
  message2: {
    marginVertical: screenHeight * 0.02,
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
  },
  okButton: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.04,
  },
});
