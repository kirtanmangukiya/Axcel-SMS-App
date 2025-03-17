import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  BackHandler,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import {MainStackParamList} from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TopBar from '../../components/TopBar';
import {
  StripeProvider,
  CardField,
  useStripe,
  CardFieldInput,
} from '@stripe/stripe-react-native';
import {
  createPaymentIntentData,
  initializeAuthToken,
  getStripeConfig,
} from '../../config/axios';

type StripePaymentRouteProp = RouteProp<MainStackParamList, 'StripePayment'>;

const StripePaymentComponent: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<StripePaymentRouteProp>();
  const cardFieldRef = useRef(null);

  const {
    amount,
    currency = 'usd',
    description,
    invoiceId,
    studentId,
    paymentTitle,
  } = route.params || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(
    null,
  );
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [stripeKey, setStripeKey] = useState<string>('');
  const [stripeEnabled, setStripeEnabled] = useState<boolean>(false);

  const {confirmPayment} = useStripe();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('RouteDueInvoiceScreen');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('loginData');
        if (userDataString) {
          const parsedData = JSON.parse(userDataString);
          setUserData(parsedData);
        }
      } catch (error) {}
    };

    loadUserData();
    loadStripeConfig();
  }, []);

  const loadStripeConfig = async () => {
    try {
      setIsProcessing(true);
      const config = await getStripeConfig();
      setStripeEnabled(config.stripeEnabled);
      setStripeKey(config.stripePublishableKey);

      if (!config.stripeEnabled) {
        Alert.alert(
          'Payment Disabled',
          'Payment is disabled by admin.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('RouteDueInvoiceScreen');
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }

      setTimeout(() => {
        createPaymentIntent();
      }, 500);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const createPaymentIntent = async () => {
    try {
      setIsProcessing(true);
      setApiError(null);

      await initializeAuthToken();

      if (!amount || amount <= 0) {
        throw new Error('Invalid amount provided');
      }

      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out after 30 seconds'));
        }, 30000);
      });

      const apiCallPromise = createPaymentIntentData(
        amount,
        currency,
        description || 'Invoice payment',
        invoiceId,
        studentId,
      );

      const responseData = await Promise.race([apiCallPromise, timeoutPromise]);

      if (responseData.paymentEnabled === false) {
        Alert.alert(
          'Payment Disabled',
          'Payment is disabled by admin.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('RouteDueInvoiceScreen');
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }

      if (!responseData) {
        throw new Error('Empty response received from payment service');
      }

      if (responseData.clientSecret) {
        setClientSecret(responseData.clientSecret);
        setPaymentIntentId(responseData.paymentIntentId);
      } else {
        setApiError('No client secret returned from server');
        Alert.alert(
          'Error',
          'Failed to create payment intent: No client secret returned',
        );
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApiError = (error: any) => {
    if (error instanceof Error) {
      if (error.message.includes('Network request failed')) {
        setApiError(
          'Network connection error. Please check your internet connection.',
        );
        Alert.alert(
          'Network Error',
          'Unable to connect to payment service. Please check your internet connection and try again.',
        );
      } else if (error.message.includes('timed out')) {
        setApiError('Request timed out. Server may be busy.');
        Alert.alert(
          'Timeout Error',
          'The payment service is taking too long to respond. Please try again later.',
        );
      } else if (
        error.message.includes('Session expired') ||
        error.message.includes('JSON parse error') ||
        error.message.includes('Unexpected character')
      ) {
        setApiError('Your session has expired. Please log in again.');
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please log in again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.clear();
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              },
            },
          ],
        );
      } else {
        setApiError(error.message);
        Alert.alert(
          'Error',
          `There was a problem setting up the payment: ${error.message}`,
        );
      }
    } else {
      setApiError('An unknown error occurred');
      Alert.alert(
        'Error',
        'An unexpected error occurred while setting up the payment. Please try again.',
      );
    }
  };

  const handlePayment = async () => {
    if (!clientSecret) {
      Alert.alert('Error', 'Payment not ready. Please try again.');
      return;
    }

    if (!cardDetails) {
      setCardError('Card information is missing');
      return;
    }

    if (!cardDetails.complete) {
      setCardError('Please enter complete card information');
      return;
    }

    try {
      setIsProcessing(true);

      await new Promise(resolve => setTimeout(resolve, 300));

      const {error, paymentIntent} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: userData?.user?.email,
          },
        },
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        navigation.navigate('PaymentReceipt', {
          paymentId: paymentIntent.id,
          amount: amount,
          currency: currency,
          date: new Date().toISOString(),
          invoiceId: invoiceId,
          paymentTitle: paymentTitle,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'There was a problem processing your payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    navigation.navigate('RouteDueInvoiceScreen');
  };

  const handleRetry = () => {
    createPaymentIntent();
  };

  if (!stripeEnabled) {
    return (
      <ImageBackground
        source={require('../../assest/icons/SideBarBg.jpg')}
        style={styles.background}>
        <SafeAreaView style={styles.container}>
          <TopBar title="Payment" onMenuPress={handleCancel} />
          <View style={styles.disabledContainer}>
            <Text style={styles.disabledText}>
              Payment is currently disabled by the administrator.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('RouteDueInvoiceScreen')}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <StripeProvider publishableKey={stripeKey || ''}>
      <ImageBackground
        source={require('../../assest/icons/SideBarBg.jpg')}
        style={styles.background}>
        <SafeAreaView style={styles.container}>
          <TopBar title="Payment" onMenuPress={handleCancel} />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.paymentContainer}>
              <Text style={styles.title}>Complete Your Payment</Text>

              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Amount:</Text>
                <Text style={styles.amount}>
                  {amount} {currency.toUpperCase()}
                </Text>
              </View>

              <View style={styles.invoiceContainer}>
                <Text style={styles.invoiceLabel}>Invoice:</Text>
                <Text style={styles.invoiceValue}>{paymentTitle}</Text>
              </View>

              {description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Description:</Text>
                  <Text style={styles.description}>{description}</Text>
                </View>
              )}

              {apiError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorTitle}>
                    Error Setting Up Payment
                  </Text>
                  <Text style={styles.errorText}>{apiError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRetry}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>Card Information</Text>
                <CardField
                  postalCodeEnabled={true}
                  placeholder={{
                    number: '4242 4242 4242 4242',
                    expiration: 'MM/YY',
                    cvc: 'CVC',
                    postalCode: '12345',
                  }}
                  cardStyle={{
                    backgroundColor: '#f9f9f9',
                    textColor: '#000000',
                    borderRadius: 8,
                  }}
                  style={styles.cardField}
                  onCardChange={cardDetails => {
                    setCardDetails(cardDetails);
                    if (cardDetails.complete) {
                      setCardError(null);
                    } else if (cardDetails.number) {
                      if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
                        setCardError('Please enter the expiration date');
                      } else if (!cardDetails.cvc) {
                        setCardError('Please enter the CVC code');
                      } else {
                        setCardError('Please complete all card details');
                      }
                    }
                  }}
                  ref={cardFieldRef}
                />
                {cardError && <Text style={styles.errorText}>{cardError}</Text>}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={isProcessing}>
                  <Text style={[styles.buttonText, {color: '#333'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.payButton,
                    (isProcessing || !cardDetails?.complete || !clientSecret) &&
                      styles.disabledButton,
                  ]}
                  onPress={handlePayment}
                  disabled={
                    isProcessing || !cardDetails?.complete || !clientSecret
                  }>
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Pay Now</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.securePaymentContainer}>
                <Icon
                  name="lock"
                  size={16}
                  color="#888"
                  style={styles.secureIcon}
                />
                <Text style={styles.secureText}>
                  Secure payment powered by Stripe
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </StripeProvider>
  );
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
    padding: 20,
  },
  paymentContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  amountLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d9534f',
  },
  invoiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  invoiceLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  invoiceValue: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  descriptionContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: 'black',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#d9534f',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 5,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 14,
    marginTop: 5,
  },
  retryButton: {
    backgroundColor: '#d9534f',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardContainer: {
    marginVertical: 20,
  },
  cardLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    marginBottom: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  payButton: {
    backgroundColor: '#d9534f',
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  securePaymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  secureIcon: {
    marginRight: 8,
  },
  secureText: {
    fontSize: 12,
    color: '#888',
  },
  disabledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  disabledText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default StripePaymentComponent;
