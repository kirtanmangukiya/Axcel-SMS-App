import {ClassAssignment, invoices2} from '../../types';
import {Image, Text, View} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import styled from 'styled-components/native';

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
  border-radius: 50px;
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
  data: invoices2;
}

const CreditComponent: React.FC<YearData> = ({data}) => {
  // console.log(
  //   'NSIDE THE RENDER ',
  //   data?.invoicePyaments?.[0]?.paymentDescription,
  // );

  // console.log(data?.id);
  const imageUrl = `https://axcel.schoolmgmtsys.com/dashboard/profileImage/${data?.id}`;

  return (
    <Container>
      <View
        style={{
          width: '95%',
          // backgroundColor: 'red',
          justifyContent: 'space-between',
          marginBottom: '4%',
          marginTop: '4%',
          marginLeft: '5%',
          flexDirection: 'row',
        }}>
        <View>
          <SubText style={{fontWeight: 'bold', fontSize: 20}}>
            {data?.invoicePyaments?.[0].paymentTitle}
          </SubText>
        </View>
        <View
          style={{
            marginRight: '6%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fc0b0b',
            padding: '2%',
            borderRadius: 14,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 10, color: 'white'}}>
            Amount {data?.invoicePyaments?.[0]?.paymentDiscounted}
          </Text>
        </View>
      </View>
      <View style={{marginLeft: '5%', marginBottom: '5%', width: '60%'}}>
        <SubText>{data?.invoicePyaments?.[0]?.paymentDescription}</SubText>
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
          <InfoText>Student</InfoText>
          <SubText>{data?.fullName ? data?.fullName : 'N/A'}</SubText>
        </InfoTextContainer>
      </InfoContainer>

      {/* Third View */}
      <InfoContainer>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_date.png')}
        />

        <InfoTextContainer>
          <InfoText>Due Date</InfoText>
          <SubText>{data?.dueDate ? data?.dueDate : 'N/A'}</SubText>
        </InfoTextContainer>
      </InfoContainer>
    </Container>
  );
};

export default CreditComponent;
