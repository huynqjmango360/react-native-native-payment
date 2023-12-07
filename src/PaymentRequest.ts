import type {
  PaymentMethodData,
  PaymentDetailsInit,
  PaymentDetailsBase,
  PaymentDetailsUpdate,
  PaymentOptions,
  PaymentShippingOption,
  PaymentItem,
  PaymentAddress,
  PaymentShippingType,
  PaymentDetailsIOS,
  PaymentDetailsIOSRaw,
} from './types';
import type PaymentResponseType from './PaymentResponse';
import { DeviceEventEmitter, Platform } from 'react-native';
import uuid from 'uuid/v1';
import NativePayments from '../NativeBridge';
import PaymentResponse from './PaymentResponse';
import PaymentRequestUpdateEvent from './PaymentRequestUpdateEvent';
import {
  isValidDecimalMonetaryValue,
  isNegative,
  convertDetailAmountsToString,
  getPlatformMethodData,
  validateTotal,
  validatePaymentMethods,
  validateDisplayItems,
  validateShippingOptions,
  getSelectedShippingOption,
  hasGatewayConfig,
  getGatewayName,
  validateGateway,
} from './helpers';
import { ConstructorError, GatewayError } from './errors';
import {
  MODULE_SCOPING,
  SHIPPING_ADDRESS_CHANGE_EVENT,
  SHIPPING_OPTION_CHANGE_EVENT,
  INTERNAL_SHIPPING_ADDRESS_CHANGE_EVENT,
  INTERNAL_SHIPPING_OPTION_CHANGE_EVENT,
  USER_DISMISS_EVENT,
  USER_ACCEPT_EVENT,
  GATEWAY_ERROR_EVENT,
  SUPPORTED_METHOD_NAME,
} from './constants';

const noop = () => {};
const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

export default class PaymentRequest {
  private _id: string;
  private _shippingAddress: PaymentAddress | null;
  private _shippingOption: string | null;
  private _shippingType: PaymentShippingType | null;
  private _serializedMethodData: string;
  private _serializedModifierData: string;
  private _details: PaymentDetailsBase;
  private _options: PaymentOptions;
  private _state: 'created' | 'interactive' | 'closed';
  private _updating: boolean;
  private _acceptPromise: Promise<any>;
  private _acceptPromiseResolver: (value: any) => void;
  private _acceptPromiseRejecter: (reason: any) => void;
  private _shippingAddressChangeSubscription: any; // TODO: add proper type annotation
  private _shippingOptionChangeSubscription: any; // TODO: add proper type annotation
  private _userDismissSubscription: any; // TODO: add proper type annotation
  private _userAcceptSubscription: any; // TODO: add proper type annotation
  private _gatewayErrorSubscription: any; // TODO: add proper type annotation
  private _shippingAddressChangesCount: number;
  private _shippingAddressChangeFn: (event: PaymentRequestUpdateEvent) => void; // function provided by user
  private _shippingOptionChangeFn: (event: PaymentRequestUpdateEvent) => void; // function provided by user

  constructor(
    methodData: PaymentMethodData[] = [],
    details?: PaymentDetailsInit = {},
    options?: PaymentOptions = {}
  ) {
    // Constructor implementation...
  }

  // Method implementations...

  // Getter and setter implementations...
}
