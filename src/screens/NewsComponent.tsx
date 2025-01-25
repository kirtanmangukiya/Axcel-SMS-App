import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AssignmentApiResponce, MainStackParamList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NewsInsideData} from '../config/axios';

interface NewsProps {
  data: {
    id: number;
    start: string;
    title: string;
    type: string;
  };
}

type NewsComponentNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'NewsComponent'
>;

const NewsComponent: React.FC<NewsProps> = ({data}) => {
  const {start, title, id} = data; // Destructure data to get start and title
  const navigation = useNavigation<NewsComponentNavigationProp>();
  // console.log(data);
  const [data22, setData] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // console.log(id);

  const loadData = async () => {
    try {
      const data = await NewsInsideData({id: id});
      // console.log('assignment_list_data ', data);

      setData(data);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing indicator
    }
  };

  useEffect(() => {
    loadData(); // Initial data load
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        // navigation.navigate('InsideNewsComponent', {data: data});
        navigation.navigate('InsideNewsComponent', {data: data22})
      }>
      <View style={{marginRight: 5}}>
        <Icon name="megaphone-outline" size={24} color="white" />
      </View>
      <View>
        <View style={styles.wraper}>
          <View style={{marginRight: 5}}>
            <Icon name="time-outline" size={12} color="white" />
          </View>
          <Text style={{color: 'white'}}>{start}</Text>
        </View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  wraper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 17,
    letterSpacing: 0.5,
    fontWeight: '700',
    paddingRight: 12,
    color: 'white',
    lineHeight: 20,
  },
});

export default NewsComponent;
