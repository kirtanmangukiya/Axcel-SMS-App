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
  /* padding-left: 10px; */
  /* padding-right: 100px; */
  background-color: white;
  border-radius: 10px;

  /* padding-left: 10px; */
  /* margin: 10px 40px; */
`;

const ProfileContainer = styled.View`
  align-items: center;

  flex-direction: row;
  margin-bottom: 20px;
  padding-left: 40px;
  /* padding-right: 15px; */
  margin-top: 10px;
  justify-content: space-evenly;

  /* width: 100; */
`;

const ProfileImage = styled.Image`
  width: 69px;
  height: 45px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const ProfileImage2 = styled.Image`
  width: 28px;
  height: 28px;
  margin-right: 12px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const NameText = styled.Text`
  font-size: 18px;
  bottom: 7px;
  color: black;
  font-weight: bold;
`;

const ProfileIcon = styled(Icon).attrs({
  name: 'person',
  size: 20,
})`
  margin-top: 5px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  /* align-items: center; */
  margin-left: 15px;
  margin-bottom: 20px;
`;

const InfoTextContainer = styled.View`
  flex-direction: column;
  box-flex-group: red;
  /* margin-left: 10px; */
  /* justify-content: space-evenly; */
`;
const MeritListShow = styled.View`
  margin-left: 60px;
  margin-bottom: 10px;
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
const ChildComponent = styled.View`
  flex-direction: column;

  /* background-color: red; */
  justify-content: space-evenly;
`;

interface TeacherProfileProps {
  data: object;
}

const TeacherComponent: React.FC<TeacherProfileProps> = ({data, userRole}) => {
  // console.log('Hello teacher component ', username);
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
          style={{width: 55, height: 58, borderRadius: 100}}
        />
        <View
          style={{
            width: '70%',
            marginLeft: '5%',
            // backgroundColor: 'yellow',
            flexDirection: 'column',
            // alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <NameText>{data?.fullName ? data?.fullName : 'N/A'}</NameText>
          <View>
            <View
              style={
                {
                  // backgroundColor: 'black',
                  // flexDirection: 'row',
                  // justifyContent: 'space-evenly',
                }
              }>
              <TouchableOpacity
                style={{
                  paddingVertical: '3%',
                  paddingHorizontal: 10,
                  backgroundColor: '#2596be',
                  borderRadius: 40,
                  justifyContent: 'center',
                  marginHorizontal: 5,
                  alignItems: 'center',
                  width: '17%',
                }}
                // onPress={() => navigation.navigate('showDataScreen')}
                onPress={handleButtonClick}>
                <Image
                  source={require('../../assest/icons/3rd.png')}
                  style={styles.iconImage}
                />
              </TouchableOpacity>
            </View>
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
          <SubText> {data?.username ? data?.username : 'N/A'}</SubText>
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
      {/* <MeritListShow>
        <SubText> Merit : 0</SubText>
        <SubText> Demerit : 0</SubText>
        <SubText> Attendence : 0</SubText>
        <SubText> Updated</SubText>
      </MeritListShow> */}
      {/* Modal for Input */}
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconImage: {
    width: screenWidth * 0.05,
    height: screenHeight * 0.03,
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
  modalBackground2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  lottieModalContainer2: {
    width: 250, // Increased width
    padding: 10, // Increased padding
    backgroundColor: 'white',
    borderRadius: 15, // Adjusted for larger modal
    alignItems: 'center',
  },
  lottieView2: {
    width: 60, // Adjust size as needed
    height: 60, // Adjust size as needed
  },
  message2: {
    marginVertical: 20, // Increased spacing from the LottieView
    fontSize: 18, // Adjust font size as needed
    fontWeight: 'bold',
  },
  okButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
  lottieView: {
    width: 150,
    height: 150,
  },
});
