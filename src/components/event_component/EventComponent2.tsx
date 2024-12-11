import {StackActions, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import styled from 'styled-components/native';
import {Event} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../types';

const Container = styled(TouchableOpacity)<{width: number}>`
  background-color: white;
  border-radius: 10px;
  margin: ${({width}) => width * 0.015}px ${({width}) => width * -0.01}px;
`;

const ProfileContainer = styled.View<{width: number}>`
  margin-top: ${({width}) => width * 0.025}px;
  margin-left: ${({width}) => width * 0.05}px;
  margin-bottom: ${({width}) => width * 0.025}px;
  flex-direction: column;
`;

const ProfileImage2 = styled.Image<{width: number}>`
  width: ${({width}) => width * 0.045}px;
  height: ${({width}) => width * 0.07}px;
  margin-right: ${({width}) => width * 0.03}px;
  border-radius: 50px;
  margin-bottom: ${({width}) => width * 0.025}px;
`;

const ProfileImage3 = styled.Image<{width: number}>`
  width: ${({width}) => width * 0.065}px;
  height: ${({width}) => width * 0.0575}px;
  margin-right: ${({width}) => width * 0.025}px;
  margin-bottom: ${({width}) => width * 0.025}px;
`;

const NameText = styled.Text<{width: number}>`
  font-size: ${({width}) => width * 0.045}px;
  margin-bottom: ${({width}) => width * 0.015}px;
  color: black;
  font-weight: bold;
`;

const InfoContainer = styled.View<{width: number}>`
  flex-direction: row;
  margin-left: ${({width}) => width * 0.0625}px;
  margin-bottom: ${({width}) => width * 0.025}px;
`;

const InfoTextContainer = styled.View`
  flex-direction: column;
`;

const InfoText = styled.Text<{width: number}>`
  font-size: ${({width}) => width * 0.045}px;
  margin-bottom: ${({width}) => width * 0.0125}px;
  font-weight: bold;
  color: black;
`;

const SubText = styled.Text<{width: number}>`
  font-size: ${({width}) => width * 0.035}px;
  color: gray;
`;

const ChildComponent = styled.View`
  flex-direction: column;
  justify-content: space-evenly;
`;

type EventScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'InsideEventComponent'
>;

interface EventComponentProps {
  data: Event;
}

const EventComponent2: React.FC<EventComponentProps> = ({data}) => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation<EventScreenNavigationProp>();

  // console.log(data);

  const handlePress = () => {
    const pushAction = StackActions.push('InsideEventComponent', {data});
    navigation.dispatch(pushAction);
  };

  return (
    <Container  width={width}>
      <ProfileContainer width={width}>
        <ChildComponent>
          <NameText width={width}>
            {data?.eventTitle ? data?.eventTitle : 'N/A'}
          </NameText>
        </ChildComponent>
        <View>
          {/* <Text>{data?.eventDescription ? data.eventDescription : 'N/A'}</Text> */}
        </View>
      </ProfileContainer>
      <InfoContainer width={width}>
        <ProfileImage2
          source={require('../../assest/icons/icon_pages_location.png')}
          width={width}
        />
        <InfoTextContainer>
          <InfoText width={width}>Event Place</InfoText>
          <SubText width={width}>
            {data.eventPlace ? data.eventPlace : 'N/A'}
          </SubText>
        </InfoTextContainer>
      </InfoContainer>
      <InfoContainer width={width}>
        <ProfileImage3
          source={require('../../assest/icons/icon_pages_date.png')}
          width={width}
        />
        <InfoTextContainer>
          <InfoText width={width}>Date</InfoText>
          <SubText width={width}>{data.eventDate}</SubText>
        </InfoTextContainer>
      </InfoContainer>
    </Container>
  );
};

export default EventComponent2;
