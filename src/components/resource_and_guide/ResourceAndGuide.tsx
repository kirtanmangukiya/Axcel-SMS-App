import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';
import { MainStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface NewsBoardProps {
  data: any;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Container = styled.TouchableOpacity`
  padding: ${screenHeight * 0.02}px;
  background-color: white;
  border-radius: 10px;
  margin: ${screenHeight * 0.01}px ${screenWidth * 0.05}px;
`;

const HeaderText = styled.Text`
  font-size: ${screenHeight * 0.025}px;
  font-weight: bold;
  color: black;
  margin-bottom: ${screenHeight * 0.01}px;
`;

const SubHeaderText = styled.Text`
  font-size: ${screenHeight * 0.018}px;
  margin-bottom: ${screenHeight * 0.02}px;
`;

const Row = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const ImageView = styled.Image`
  width: ${screenWidth * 0.09}px;
  height: ${screenHeight * 0.04}px;
  margin-right: ${screenWidth * 0.05}px;
`;

const DateView = styled.View`
  flex-direction: column;
  flex: 1;
`;

const AboveDateText = styled.Text`
  font-size: ${screenHeight * 0.022}px;
  font-weight: bold;
  margin-bottom: ${screenHeight * 0.005}px;
  color: black;
`;

const CurrentDateText = styled.Text`
  font-size: ${screenHeight * 0.018}px;
`;

const DownloadButton = styled.TouchableOpacity`
  background-color: #c2bdbd;
  padding: ${screenHeight * 0.01}px;
  margin-bottom: ${screenHeight * 0.005}px;
  align-items: center;
`;

const styles = StyleSheet.create({
  pdfContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  closeButton: {
    backgroundColor: '#c2bdbd',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
});

type NewsBoardScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'NewsBoardComponent'
>;

const ResourceAndGuide: React.FC<NewsBoardProps> = ({ data }) => {
  const navigation = useNavigation<NewsBoardScreenNavigationProp>();

  const pdfUrls = [
    data?.newsImage,
    data?.newsImage2,
    data?.newsImage3,
    data?.newsImage4,
    data?.newsImage5,
    data?.newsImage6,
    data?.newsImage7,
    data?.newsImage8,
    data?.newsImage9,
    data?.newsImage10,
  ].filter((url) => url && url.endsWith('.pdf'));

  const handlePress = () => {
    navigation.navigate('InsideNewsComponent', { data: data });
  };

  const openPdf = (url: string) => {
    navigation.navigate('PdfShowComponent', { pdfUrl: url });
  };

  return (
    <Container onPress={handlePress}>
      <HeaderText>{data?.newsTitle}</HeaderText>
      <SubHeaderText>{data?.newsText.slice(0, 100)}...</SubHeaderText>
      <Row>
        <ImageView source={require('../../assest/icons/icon_pages_date.png')} />
        <DateView>
          <AboveDateText>Book Author</AboveDateText>
          <CurrentDateText>{data?.newsDate}</CurrentDateText>
        </DateView>
        <View>
          {pdfUrls.map((url, index) => (
            <DownloadButton key={index} onPress={() => openPdf(url)}>
              <Text>Download</Text>
            </DownloadButton>
          ))}
        </View>
      </Row>
    </Container>
  );
};

export default ResourceAndGuide;
