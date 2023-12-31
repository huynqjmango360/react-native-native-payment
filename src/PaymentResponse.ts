// @flow

// Types
import type {
  PaymentCompleteStatus,
  PaymentDetailsInit,
  PaymentAddress,
} from './types';

// Modules
import { NativePayment } from './NativePayment';

export default class PaymentResponse {
  // Internal Slots
  _requestId: string;
  _methodName: string;
  _details: PaymentDetailsInit;
  _shippingAddress: null | PaymentAddress;
  _shippingOption: null | string;
  _payerName: null | string;
  _payerPhone: null | string;
  _payerEmail: null | string;
  _completeCalled: boolean;

  constructor(paymentResponse: {
    requestId: string;
    methodName: string;
    details: PaymentDetailsInit;
    shippingAddress: PaymentAddress | null;
    shippingOption: string | null;
    payerName: string | null;
    payerPhone: string | null;
    payerEmail: string | null;
  }) {
    // Set properties as readOnly
    this._requestId = paymentResponse.requestId;
    this._methodName = paymentResponse.methodName;
    this._details = paymentResponse.details;
    this._shippingAddress = paymentResponse.shippingAddress;
    this._shippingOption = paymentResponse.shippingOption;
    this._payerName = paymentResponse.payerName;
    this._payerPhone = paymentResponse.payerPhone;
    this._payerEmail = paymentResponse.payerEmail;

    // Internal Slots
    this._completeCalled = false;
  }

  // https://www.w3.org/TR/payment-request/#requestid-attribute
  get requestId(): string {
    return this._requestId;
  }

  // https://www.w3.org/TR/payment-request/#methodname-attribute
  get methodName(): string {
    return this._methodName;
  }

  // https://www.w3.org/TR/payment-request/#details-attribute
  get details(): PaymentDetailsInit {
    return this._details;
  }

  // https://www.w3.org/TR/payment-request/#shippingaddress-attribute-1
  get shippingAddress(): null | PaymentAddress {
    return this._shippingAddress;
  }

  // https://www.w3.org/TR/payment-request/#shippingoption-attribute-1
  get shippingOption(): null | string {
    return this._shippingOption;
  }

  // https://www.w3.org/TR/payment-request/#payername-attribute
  get payerName(): null | string {
    return this._payerName;
  }

  // https://www.w3.org/TR/payment-request/#payerphone-attribute
  get payerPhone(): null | string {
    return this._payerPhone;
  }

  // https://www.w3.org/TR/payment-request/#payeremail-attribute
  get payerEmail(): null | string {
    return this._payerEmail;
  }

  // https://www.w3.org/TR/payment-request/#complete-method
  complete(paymentStatus: PaymentCompleteStatus) {
    if (this._completeCalled === true) {
      throw new Error('InvalidStateError');
    }

    this._completeCalled = true;

    return new Promise((resolve, reject) => {
      return NativePayment.complete(paymentStatus, () => {
        return resolve(undefined);
      });
    });
  }
}
