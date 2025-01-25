import React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {subjectsData} from '../../types';

const {width} = Dimensions.get('window');

const Container = styled.View`
  padding: 26px;
  background-color: white;
  border-radius: 12px;
  margin: 8px;
  elevation: 2;
`;

const ProfileImage2 = styled.Image`
  width: ${width * 0.08}px;
  height: ${width * 0.08}px;
  border-radius: ${width * 0.04}px;
  resize-mode: contain;
  overflow: hidden;
`;

const ProfileImage3 = styled.Image`
  width: ${width * 0.08}px;
  height: ${width * 0.08}px;
  border-radius: ${width * 0.04}px;
  resize-mode: contain;
  overflow: hidden;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const InfoTextContainer = styled.View`
  margin-left: 12px;
`;

const InfoText = styled.Text`
  font-size: ${width * 0.04}px;
  font-weight: bold;
  color: #333;
`;

const SubText = styled.Text`
  font-size: ${width * 0.035}px;
  color: #666;
  margin-top: 4px;
`;

interface SubjectData {
  data: subjectsData;
}

const SubjectsComponent: React.FC<SubjectData> = ({data}) => {
  return (
    <Container>
      <Text style={styles.title}>{data?.subjectTitle}</Text>
      <View style={styles.gradeContainer}>
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

const styles = StyleSheet.create({
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SubjectsComponent;