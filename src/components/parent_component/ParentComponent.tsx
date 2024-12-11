import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ParentProfileProps} from '../../types';

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

interface teacherComponentData {
  data: ParentProfileProps;
}

const ParentComponent: React.FC<teacherComponentData> = ({data}) => {
  // console.log(data);
  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${data?.id}`;

  return (
    <Container>
      {/* First View */}
      <View
        style={{
          width: '90%',
          // backgroundColor: 'red',
          marginBottom: '4%',
          marginTop: '4%',
          marginLeft: '10%',
          flexDirection: 'row',
        }}>
        <Image
          source={
            data?.id
              ? {uri: imageUrl}
              : require('../../assest/icons/SideBarBg.jpg')
          }
          style={{width: 55, height: 58, borderRadius: 100}}
        />
        <View
          style={{
            width: '70%',
            // backgroundColor: 'yellow',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <NameText>{data.fullName ? data.fullName : 'N/A'}</NameText>
          <View>
            <View
              style={{
                // backgroundColor: 'black',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={{
                  paddingVertical: '5%',
                  paddingHorizontal: 10,
                  backgroundColor: 'white',
                  borderRadius: 40,
                  justifyContent: 'center',
                  marginHorizontal: 5,
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('showDataScreen')}>
                <Image
                  source={require('../../assest/icons/menu_user.png')}
                  style={{height: 15, width: 15}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Second View */}
      <InfoContainer>
        <ProfileImage2
          source={
            data?.id
              ? {uri: imageUrl}
              : require('../../assest/icons/SideBarBg.jpg')
          }
        />

        <InfoTextContainer>
          <InfoText>Username</InfoText>
          <SubText> {data.username}</SubText>
        </InfoTextContainer>
      </InfoContainer>

      {/* Third View */}
      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_email.png')}
        />

        <InfoTextContainer>
          <InfoText>Email Address</InfoText>
          <SubText>{data.email}</SubText>
        </InfoTextContainer>
      </InfoContainer>
      {/* <MeritListShow>
        <SubText> Merit : 0</SubText>
        <SubText> Demerit : 0</SubText>
        <SubText> Attendence : 0</SubText>
        <SubText> Updated</SubText>
      </MeritListShow> */}
    </Container>
  );
};

export default ParentComponent;
