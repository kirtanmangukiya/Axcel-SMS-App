import { useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-native';

const PaymentScreen: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const amountVar = 2000;
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const API_URL = 'https://sms.psleprimary.com/api';

  const fetchPaymentSheetParams = async () => {
    const currency = 'USD';
    const amount = amountVar;

    const response = await fetch(`https://sms.psleprimary.com/api/process-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "parentId":770
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });

    if (!error) {
      setLoading(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const { error, paymentIntent } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else if (paymentIntent) {
      const { status, amount, currency, customer } = paymentIntent;
      const timestamp = new Date().toISOString();

      console.log('Payment Status:', status);
      console.log('Payment Amount:', amount);
      console.log('Payment Currency:', currency);
      console.log('Customer:', customer);
      console.log('Timestamp:', timestamp);

      const transactionData = {
        status,
        amount,
        currency,
        customer,
        timestamp,
      };

      sendTransactionData(transactionData);
      Alert.alert('Success', 'Your order is confirmed!');
    } else {
      Alert.alert('Payment Canceled', 'Your payment process was canceled.');
    }
  };

  const sendTransactionData = async (data: Record<string, any>) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to send transaction data');
      }
    } catch (error) {
      console.error('Error sending transaction data:', error);
    }
  };

  return (
    <Button
      variant="primary"
      disabled={!loading}
      title="Checkout"
      onPress={openPaymentSheet}
    />
  );
};

export default PaymentScreen;
