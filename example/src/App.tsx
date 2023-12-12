import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import {
  NativePayment,
  type PaymentDetailsInit,
  PaymentRequest,
} from 'react-native-native-payment';

const METHOD_DATA = [
  {
    supportedMethods: ['apple-pay'],
    data: {
      merchantIdentifier: 'merchant.com.your-app.namespace',
      supportedNetworks: ['visa', 'mastercard', 'amex'],
      countryCode: 'US',
      currencyCode: 'USD',
    },
  },
];

const DETAILS: PaymentDetailsInit = {
  displayItems: [
    {
      label: 'Movie Ticket',
      amount: { currency: 'USD', value: '15.00' },
    },
  ],
  total: {
    label: 'Merchant Name',
    amount: { currency: 'USD', value: '15.00' },
  },
};

export default function App() {
  const showPaymentSheet = () => {
    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
    paymentRequest.show();
  };

  const onPress = () => {
    NativePayment.createPaymentRequest(
      {
        // supportedMethods: ['apple_pay'],
        // data: {
        version: 3,
        merchantIdentifier: 'merchant.au.com.jmango360.bigcommer',
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['visa', 'mastercard'],
        countryCode: 'US',
        currencyCode: 'USD',
        requiredBillingContactFields: ['postalAddress', 'name'],
        requiredShippingContactFields: [
          'postalAddress',
          'name',
          'phone',
          'email',
        ],
        paymentMethodTokenizationParameters: {
          parameters: {
            gateway: 'braintree',
            braintree: {
              tokenizationKey: 'sandbox_rzqjhfv6_mxtqjkx82q8zy799',
            },
          },
        },
        // },
      },
      {
        id: 'super-store-order-123-12312',
        displayItems: [
          {
            label: 'Sub-total',
            amount: { currency: 'GBP', value: '55.00' },
          },
          {
            label: 'Value-Added Tax (VAT)',
            amount: { currency: 'GBP', value: '5.00' },
          },
          {
            label: 'Standard shipping',
            amount: { currency: 'GBP', value: '5.00' },
          },
        ],
        total: {
          label: 'Total due',
          // The total is GBP£65.00 here because we need to
          // add tax and shipping.
          amount: { currency: 'GBP', value: '65.00' },
        },
      },
      {}
    );
    // NativePayment.show();
  };

  const showApplePaySheet = () => {
    NativePayment.show();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 200,
          height: 50,
          borderRadius: 10,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          ApplePay
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={showPaymentSheet}
        style={{
          width: 200,
          height: 50,
          borderRadius: 10,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          Show ApplePay sheet
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
