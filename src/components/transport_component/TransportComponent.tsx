import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {transportItem} from '../../types';

export interface transportItemData {
  data: transportItem;
}

const TransportComponent: React.FC<transportItemData> = ({data}) => {
  const transportTitle = data.transportTitle;
  const openParenIndex = transportTitle.indexOf('(');
  const closeParenIndex = transportTitle.indexOf(')', openParenIndex);

  const transportTitleBefore =
    openParenIndex !== -1
      ? transportTitle.substring(0, openParenIndex).trim()
      : transportTitle;
  const transportTitleAfter =
    openParenIndex !== -1
      ? transportTitle.substring(openParenIndex).trim()
      : '';

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={{width: '60%'}}>
          <Text style={styles.invoiceNumber}>{transportTitleBefore}</Text>
        </View>
        <View style={{width: '90%'}}>
          <Text style={styles.invoiceNumber}>{transportTitleAfter}</Text>
        </View>

        <Text style={{color: '#666', fontSize: 16, fontWeight: '500'}}>
          {data.routeDetails}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Fare {data.transportFare}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          {/* <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingTop: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    // marginBottom: 15,
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftSection: {
    flex: 1,
    // backgroundColor: 'red',
    width: '80%',
  },
  rightSection: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  invoiceNumber: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  studentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: '5%',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 10,
    marginLeft: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  studentName: {
    fontSize: 14,
    // fontWeight: 'bold',
  },
  dueDateSection: {
    flexDirection: 'row',
    marginLeft: '5%',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  dueDateInfo: {
    flex: 1,
  },
  dueDateLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  dueDate: {
    fontSize: 14,
    // fontWeight: 'bold',
  },

  amountContainer: {
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
  },
  amountLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  paidContainer: {
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
  },
  paidLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  paid: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paidStatus: {
    color: 'red',
  },
  unpaidStatus: {
    color: 'red',
  },
  button: {
    backgroundColor: '#f00',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f00',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 7,
  },
});

export default TransportComponent;
