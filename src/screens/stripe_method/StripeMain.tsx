import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from './PaymentScreen';
import { secretKey } from '../../constant/constant';


const StripeMain: React.FC = () => {
    return (
        <View style={{ flex: 1 }}>
            <StripeProvider
                publishableKey={secretKey}
                merchantIdentifier="merchant.identifier" // required for Apple Pay
                urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            >
                <PaymentScreen />
            </StripeProvider>
        </View>
    );
};

export default StripeMain;

const styles = StyleSheet.create({});
