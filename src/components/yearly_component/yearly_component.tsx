import React from 'react';
import {View, Text, Image} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ClassAssignment} from '../../types';

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
  margin-right: 10px;
  /* border-radius: 50px; */
  margin-bottom: 7px;
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

export interface YearData {
  data: ClassAssignment;
}

const YearlyComponent: React.FC<YearData> = ({data}) => {
  console.log(data);

  return (
    <Container>
      <View
        style={{
          width: '95%',
          // backgroundColor: 'red',
          marginBottom: '4%',
          marginTop: '4%',
          marginLeft: '5%',
          flexDirection: 'row',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>{data.className}</Text>
      </View>

      {/* Second View */}
      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_teacher.png')}
        />

        <InfoTextContainer>
          <InfoText>Teacher</InfoText>
          <SubText>{data.classTeacher ? 'NO TEACHER' : null}</SubText>
        </InfoTextContainer>
      </InfoContainer>

      {/* Third View */}
      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_hostel.png')}
        />

        <InfoTextContainer>
          <InfoText>Dormitories</InfoText>
          <SubText>{data.dormitoryId ? data?.dormitoryId : 'N/A'}</SubText>
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

export default YearlyComponent;
