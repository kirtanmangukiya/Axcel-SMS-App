import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {MainStackParamList} from '../../types';
import TopBar from '../../components/TopBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {updatePaymentStatus} from '../../config/axios';

// Get screen dimensions for responsive sizing
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

type ReceiptRouteProp = RouteProp<MainStackParamList, 'PaymentReceipt'>;

const PaymentReceiptComponent: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ReceiptRouteProp>();
  const {paymentId, amount, currency, date, invoiceId, paymentTitle} =
    route.params || {};
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const formattedDate = new Date(date || Date.now()).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  useEffect(() => {
    const confirmPaymentStatus = async () => {
      try {
        setIsUpdating(true);
        const success = await updatePaymentStatus(invoiceId);
        if (success) {
          setStatusUpdated(true);
        } else {
          Alert.alert(
            'Warning',
            'Your payment was successful, but we could not update the payment status in our system. Please contact support.',
          );
        }
      } catch (error) {
        console.error('Failed to update payment status:', error);
        Alert.alert(
          'Warning',
          'Your payment was successful, but we could not update the payment status in our system. Please contact support.',
        );
      } finally {
        setIsUpdating(false);
      }
    };

    confirmPaymentStatus();
  }, [invoiceId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Payment Receipt\n\nInvoice: ${paymentTitle}\nAmount: ${amount} ${currency?.toUpperCase()}\nDate: ${formattedDate}\nPayment ID: ${paymentId}\nInvoice ID: ${invoiceId}`,
        title: 'Payment Receipt',
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  const handleDone = () => {
    navigation.navigate('RouteDueInvoiceScreen');
  };

  return (
    <ImageBackground
      source={require('../../assest/icons/SideBarBg.jpg')}
      style={styles.background}>
      <SafeAreaView style={styles.container}>
        <TopBar title="Payment Receipt" onMenuPress={handleDone} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.receiptContainer}>
            <Text style={styles.title}>Payment Receipt</Text>

            <View style={styles.receiptHeader}>
              <Text style={styles.receiptHeaderText}>
                Axcel International School
              </Text>
              <Text style={styles.receiptDate}>{formattedDate}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Invoice:</Text>
              <Text
                style={styles.receiptValue}
                numberOfLines={2}
                ellipsizeMode="tail">
                {paymentTitle}
              </Text>
            </View>

            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Invoice ID:</Text>
              <Text style={styles.receiptValue}>#{invoiceId}</Text>
            </View>

            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Payment ID:</Text>
              <Text
                style={styles.receiptValue}
                numberOfLines={1}
                ellipsizeMode="middle">
                {paymentId}
              </Text>
            </View>

            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Amount:</Text>
              <Text style={styles.receiptValue}>
                {amount} {currency?.toUpperCase()}
              </Text>
            </View>

            <View style={styles.receiptItem}>
              <Text style={styles.receiptLabel}>Status:</Text>
              <View style={styles.statusContainer}>
                <Text style={[styles.receiptValue, styles.statusPaid]}>
                  Paid
                </Text>
                {isUpdating && (
                  <ActivityIndicator
                    size="small"
                    color="#4CAF50"
                    style={styles.statusIndicator}
                  />
                )}
                {statusUpdated && !isUpdating && (
                  <Icon
                    name="check-circle"
                    size={16}
                    color="#4CAF50"
                    style={styles.statusIcon}
                  />
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.thankYouText}>Thank you for your payment!</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleShare}>
                <Icon
                  name="share"
                  size={20}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Share Receipt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.doneButton]}
                onPress={handleDone}>
                <Icon
                  name="check"
                  size={20}
                  color="white"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

// Calculate responsive sizes
const responsiveSize = (size: number) => {
  const baseWidth = 375; // Base width (iPhone X)
  const scaleFactor = screenWidth / baseWidth;
  return Math.round(size * scaleFactor);
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: responsiveSize(16),
    paddingBottom: responsiveSize(30), // Extra padding at bottom
  },
  receiptContainer: {
    backgroundColor: 'white',
    borderRadius: responsiveSize(10),
    padding: responsiveSize(20),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    alignSelf: 'center',
    maxWidth: 500, // Maximum width on larger screens
  },
  title: {
    fontSize: responsiveSize(22),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: responsiveSize(20),
    textAlign: 'center',
  },
  receiptHeader: {
    marginBottom: responsiveSize(15),
  },
  receiptHeaderText: {
    fontSize: responsiveSize(18),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: responsiveSize(5),
  },
  receiptDate: {
    fontSize: responsiveSize(14),
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: responsiveSize(15),
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveSize(12),
    flexWrap: 'wrap', // Allow wrapping for long content
  },
  receiptLabel: {
    fontSize: responsiveSize(16),
    color: '#666',
    flex: 1, // Take up 1 part of the space
    marginRight: responsiveSize(8),
  },
  receiptValue: {
    fontSize: responsiveSize(16),
    fontWeight: '600',
    color: 'black',
    flex: 2, // Take up 2 parts of the space
    textAlign: 'right',
  },
  statusContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statusPaid: {
    color: 'green',
  },
  statusIndicator: {
    marginLeft: responsiveSize(5),
  },
  statusIcon: {
    marginLeft: responsiveSize(5),
  },
  thankYouText: {
    fontSize: responsiveSize(16),
    color: 'black',
    textAlign: 'center',
    marginVertical: responsiveSize(15),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveSize(20),
    flexWrap: 'wrap', // Allow wrapping on very small screens
  },
  button: {
    flex: 1,
    height: responsiveSize(50),
    borderRadius: responsiveSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    marginRight: responsiveSize(5),
    marginBottom: responsiveSize(10), // Add margin bottom for wrapped buttons
    minWidth: responsiveSize(130), // Ensure minimum width
    flexDirection: 'row',
  },
  doneButton: {
    backgroundColor: '#d9534f',
    marginLeft: responsiveSize(5),
    marginRight: 0,
  },
  buttonText: {
    fontSize: responsiveSize(15),
    fontWeight: 'bold',
    color: 'white',
  },
  buttonIcon: {
    marginRight: responsiveSize(8),
  },
});

export default PaymentReceiptComponent;
