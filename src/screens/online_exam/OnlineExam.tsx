import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import TopBar from '../../components/TopBar';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import {onlineExamData} from '../../config/axios';
import Toast from 'react-native-toast-message';

const OnlineExam: React.FC = () => {
  const navigation = useNavigation();
  const [onlineExams, setOnlineExams] = useState<any[]>([]); // Adjust type as necessary

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await onlineExamData();
        setOnlineExams(data.onlineExams);
        if (data.onlineExams.length === 0) {
          Toast.show({
            type: 'info',
            text1: 'No Online Exams',
            text2: 'No online exams exist at the moment.',
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  const handleSearchPress = React.useCallback(() => {
    console.log('Search icon pressed');
  }, []);

  const handleRefreshPress = React.useCallback(() => {
    console.log('Refresh icon pressed');
  }, []);

  const handleMenuPress = React.useCallback(() => {
    console.log('Menu icon pressed');
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')} // Replace with your image path
      style={styles.background}>
      <View style={styles.container}>
        <TopBar
          title="Online Exam"
          onSearchPress={handleSearchPress}
          onRefreshPress={handleRefreshPress}
          onMenuPress={handleMenuPress}
        />
        <View style={styles.content}>
          {onlineExams.length === 0 ? (
            <NoDataFound noFoundTitle="NO DATA FOUND" />
          ) : (
            onlineExams.map((exam, index) => (
              <View key={index} style={styles.examItem}>
                <Text>{exam.title}</Text>
                <Text>{exam.description}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' as per your preference
  },
  container: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: Add opacity to overlay
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examItem: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default OnlineExam;
