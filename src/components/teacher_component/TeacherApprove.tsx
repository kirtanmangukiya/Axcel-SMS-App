import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const Container = styled.View`
  background-color: white;
  border-radius: 10px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  margin-left: 15px;
  margin-bottom: 20px;
`;

const InfoTextContainer = styled.View`
  flex-direction: column;
`;

const InfoText = styled.Text`
  font-size: 16px;
  bottom: 2px;
  font-weight: bold;
  color: black;
`;

const SubText = styled.Text`
  font-size: 14px;
  color: gray;
`;

const NameText = styled.Text`
  font-size: 18px;
  bottom: 7px;
  color: black;
  font-weight: bold;
`;

const ProfileImage2 = styled.Image`
  width: 28px;
  height: 28px;
  margin-right: 12px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

interface TeacherProfileProps {
  data: object;
}

const TeacherApprove: React.FC<TeacherProfileProps> = ({data}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaderboardMessage, setLeaderboardMessage] = useState('');
  const [showLottie, setShowLottie] = useState(false);

  const handleButtonClick = () => {
    setIsModalVisible(true);
  };

  const handleOkClick = () => {
    setIsModalVisible(false);
    setShowLottie(true);
    setTimeout(() => setShowLottie(false), 3000); // Hide Lottie after 3 seconds
  };

  const handleAccept = () => {
    // Handle accept action
    console.log('Accept button clicked');
  };

  const handleDelete = () => {
    // Handle delete action
    console.log('Delete button clicked');
  };

  return (
    <Container>
      <View
        style={{
          width: '90%',
          marginBottom: '4%',
          marginTop: '4%',
          marginLeft: '5%',
          flexDirection: 'row',
        }}>
        <Image
          source={require('../../assest/icons/download.jpg')}
          style={{width: 55, height: 58, borderRadius: 100}}
        />
        <View
          style={{
            width: '70%',
            marginLeft: '5%',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}>
          <NameText>N/A</NameText>
          <View>
            <View>
              <TouchableOpacity
                style={{
                  width: '18%',
                  marginLeft: '4%',
                  paddingVertical: '5%',
                  paddingHorizontal: 10,
                  backgroundColor: '#2596be',
                  borderRadius: 40,
                  justifyContent: 'center',
                  marginHorizontal: 5,
                  alignItems: 'center',
                }}
                onPress={handleButtonClick}>
                <Image
                  source={require('../../assest/icons/3rd.png')}
                  style={{
                    height: 15,
                    width: 15,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_user.png')}
        />

        <InfoTextContainer>
          <InfoText>Username</InfoText>
          <SubText>N/A</SubText>
        </InfoTextContainer>
      </InfoContainer>

      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_email.png')}
        />

        <InfoTextContainer>
          <InfoText>Email Address</InfoText>
          <SubText>Teacher</SubText>
        </InfoTextContainer>
      </InfoContainer>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

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

      <Modal visible={showLottie} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.lottieModalContainer}>
            <LottieView
              source={require('../../assest/Successful.json')}
              autoPlay
              loop={false}
              style={styles.lottieView}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default TeacherApprove;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  lottieModalContainer: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  okButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
  lottieView: {
    width: 150,
    height: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2596be',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
