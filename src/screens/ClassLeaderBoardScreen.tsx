import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';

// Define TypeScript interfaces
interface Student {
  studentName: string;
  points: number;
}

interface ClassDetails {
  'class-code': string;
  'class-name': string;
  classId: number;
  isLeaderBoard: string;
  sectionId: number;
  students: Student[];
  'total-score': string;
}

interface ClassData {
  data: ClassDetails[];
}

const ClassLeaderBoardScreen: React.FC<ClassData> = ({data}) => {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  // Enable LayoutAnimation for Android
  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = useCallback(
    (className: string) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedClass(expandedClass === className ? null : className);
    },
    [expandedClass],
  );

  const renderItem = useCallback(
    ({item}: {item: ClassDetails}) => {
      // console.log('item inside the classdetails ', item);

      return (
        <View key={item.classId}>
          <TouchableOpacity onPress={() => toggleExpand(item['class-name'])}>
            <Text style={styles.className}>
              {item['class-code']}
              {' - '} {item['class-name']}
            </Text>
          </TouchableOpacity>
          {expandedClass === item['class-name'] &&
            item.students.map((student, index) => (
              <View
                key={`${item.classId}-${index}`}
                style={styles.detailContainer}>
                <Text style={styles.detailText}>
                  {`${student.studentName} = ${student.points} points`}
                </Text>
              </View>
            ))}
        </View>
      );
    },

    [expandedClass, toggleExpand],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Class LeaderBoard</Text>
      <View style={{paddingLeft: '5%', paddingBottom: 20}}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.classId.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={21}
          showsVerticalScrollIndicator={false} // Hide the scroll bar
        />
      </View>
    </View>
  );
};

export default ClassLeaderBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: '#fff',
  },
  headerText: {
    color: '#FFFDFA',
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 16,
  },
  className: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFDFA',
    marginVertical: 8,
  },
  detailContainer: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFDFA',
  },
});
