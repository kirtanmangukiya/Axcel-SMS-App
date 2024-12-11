import React from 'react';
import {View, Text, Image} from 'react-native';
import styled from 'styled-components/native';
import {gradeItem} from '../../types';
const Container = styled.View`
  padding: 10px;
  padding-left: 20px;
  padding-top: 20px;
  padding-right: 20px;
  background-color: white;
  border-radius: 10px;
  margin: 10px 20px; /* Adds space to left and right */
`;

interface GradeItemss {
  data: gradeItem;
}

const GradeCompoent: React.FC<GradeItemss> = ({data}) => {
  // console.log('check the data here ', data);

  return (
    <Container>
      <View
        style={{
          width: '100%',
          //   backgroundColor: 'red',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{justifyContent: 'space-between'}}>
          <View style={{marginBottom: '10%'}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: 'black',
                marginBottom: '4%',
              }}>
              {data.gradeDescription}
            </Text>
            <Text style={{color: 'black'}}>{data.gradeName}</Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                color: 'black',
                marginBottom: '4%',
              }}>
              From {data.gradeFrom}
            </Text>
            <Text style={{color: 'black'}}>To {data.gradeTo}</Text>
          </View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 33,
              color: 'black',
              marginBottom: '4%',
            }}>
            {data?.gradePoints}
          </Text>
          <Text style={{color: 'black'}}>{data?.gradeDescription}</Text>
        </View>
      </View>
    </Container>
  );
};

export default GradeCompoent;
