import React from 'react';
import {View, Text, Image, Dimensions} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {subjectsData} from '../../types';

const {width, height} = Dimensions.get('window');

const Container = styled.View`
  padding: 4px;
  background-color: white;
  border-radius: 7px;
  /* margin-left: 0.4%;
  margin-right: 0.4%; */
`;

const ProfileContainer = styled.View`
  align-items: center;
  flex-direction: row;
  /* margin-bottom: 10px; */
  /* padding: 0 2%; */
  justify-content: space-evenly;
`;

const ProfileImage = styled.Image`
  width: ${width * 0.15}px;
  height: ${height * 0.08}px;
  border-radius: 50px;
  margin-bottom: 4px;
`;

const ProfileImage2 = styled.Image`
  width: ${width * 0.08}px;
  height: ${height * 0.04}px;
  margin-right: 12px;
  border-radius: 50px;
`;

const ProfileImage3 = styled.Image`
  width: ${width * 0.05}px;
  height: ${height * 0.05}px;
  margin-right: 12px;
  border-radius: 50px;
  margin-top: 3px;
`;

const NameText = styled.Text`
  font-size: ${width * 0.05}px;
  color: black;
  font-weight: bold;
`;

const ProfileIcon = styled(Icon).attrs({
  name: 'person',
  size: width * 0.05,
})`
  margin-top: 5px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const InfoTextContainer = styled.View`
  flex-direction: column;
  margin-left: 10px;
`;

const InfoText = styled.Text`
  font-size: ${width * 0.045}px;
  font-weight: bold;
  color: black;
`;

const SubText = styled.Text`
  font-size: ${width * 0.04}px;
  color: gray;
`;

const ChildComponent = styled.View`
  flex-direction: column;
  justify-content: space-evenly;
`;

interface SubjectData {
  data: subjectsData;
}

const SubjectsComponent: React.FC<SubjectData> = ({data}) => {
  return (
    <Container>
      <View
        style={{
          width: '95%',
          marginBottom: '4%',
          marginTop: '4%',
          marginLeft: '5%',
          flexDirection: 'row',
        }}>
        <Text
          style={{fontWeight: 'bold', fontSize: width * 0.06, color: 'black'}}>
          {data?.subjectTitle}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}>
        <InfoContainer>
          <ProfileImage2
            source={require('../../assest/icons/icon_pages_pass.png')}
          />
          <InfoTextContainer>
            <InfoText>Pass Grade</InfoText>
            <SubText>{data.passGrade}</SubText>
          </InfoTextContainer>
        </InfoContainer>
        <InfoContainer>
          <ProfileImage3
            source={require('../../assest/icons/icon_pages_final.png')}
          />
          <InfoTextContainer>
            <InfoText>Final Grade</InfoText>
            <SubText>{data?.finalGrade}</SubText>
          </InfoTextContainer>
        </InfoContainer>
      </View>
    </Container>
  );
};

export default SubjectsComponent;
