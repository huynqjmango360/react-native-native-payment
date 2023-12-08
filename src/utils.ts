import type {
  PaymentDetailsInit,
  PaymentItem,
  PaymentMethodData,
  PaymentShippingOption,
} from './types';

import { DOMException, ConstructorError } from './errors';
import validator from 'validator';
import isFloat = validator.isFloat;
import toFloat = validator.toFloat;
import isDecimal = validator.isDecimal;
import isInt = validator.isInt;
import toInt = validator.toInt;

type AmountValue = string | number;

function isNumber(value: any): boolean {
  return typeof value === 'number';
}

function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isValidDecimalMonetaryValue(
  amountValue: AmountValue | any
): boolean {
  if (!isNumber(amountValue) && !isString(amountValue)) {
    return false;
  }

  return isNumber(amountValue) || isValidStringAmount(amountValue);
}

export function isNegative(amountValue: AmountValue): boolean {
  return typeof amountValue === 'number'
    ? amountValue < 0
    : amountValue.startsWith('-');
}

export function isValidStringAmount(stringAmount: string): boolean {
  if (stringAmount.endsWith('.')) {
    return false;
  }

  return isDecimal(stringAmount);
}

export function toNumber(string: string) {
  if (isFloat(string)) {
    return toFloat(string);
  }

  if (isInt(string)) {
    return toInt(string);
  }
}

export function toString(amountValue: AmountValue) {
  return isNumber(amountValue) ? amountValue.toString() : amountValue;
}

export function convertObjectAmountToString(
  objectWithAmount: PaymentItem | PaymentShippingOption
): PaymentItem | PaymentShippingOption {
  return Object.assign({}, objectWithAmount, {
    amount: Object.assign(
      {},
      {
        value: toString(objectWithAmount.amount.value),
        currency: objectWithAmount.amount.currency,
      }
    ),
  });
}

export function convertDetailAmountsToString(
  details: PaymentDetailsInit
): PaymentDetailsInit {
  const nextDetails = Object.keys(details).reduce((acc, key) => {
    if (key === 'total') {
      return Object.assign({}, acc, {
        [key]: convertObjectAmountToString(details[key]),
      });
    }

    if (
      Array.isArray(details[key]) &&
      (key === 'displayItems' || key === 'shippingOptions')
    ) {
      return Object.assign({}, acc, {
        [key]: details[key].map((paymentItemOrShippingOption) =>
          convertObjectAmountToString(paymentItemOrShippingOption)
        ),
      });
    }

    return acc;
  }, {} as PaymentDetailsInit);

  return nextDetails;
}

export function getPlatformMethodData(
  methodData: Array<PaymentMethodData>,
  platformOS: 'ios' | 'android' | 'windows' | 'macos' | 'web'
) {
  const platformSupportedMethod =
    platformOS === 'ios' ? 'apple-pay' : 'android-pay';

  const platformMethod = methodData.find((paymentMethodData) =>
    paymentMethodData.supportedMethods.includes(platformSupportedMethod)
  );

  if (!platformMethod) {
    throw new DOMException('The payment method is not supported');
  }

  return platformMethod.data;
}

// Validators

export function validateTotal(
  total: PaymentItem | undefined,
  errorType = ConstructorError
): void {
  // Should Vailidator take an errorType to prepopulate "Failed to construct 'PaymentRequest'"

  if (total === undefined) {
    throw new errorType(`required member total is undefined.`);
  }

  const hasTotal =
    total &&
    total.amount &&
    (total.amount.value || Number(total.amount.value || 0) === 0);
  // Check that there is a total
  if (!hasTotal) {
    throw new errorType(`Missing required member(s): amount, label.`);
  }

  const totalAmountValue = total.amount.value;

  // Check that total is a valid decimal monetary value.
  if (!isValidDecimalMonetaryValue(totalAmountValue)) {
    throw new errorType(
      `'${totalAmountValue}' is not a valid amount format for total`
    );
  }

  // Check that total isn't negative
  if (isNegative(totalAmountValue)) {
    throw new errorType(`Total amount value should be non-negative`);
  }
}

export function validatePaymentMethods(methodData: PaymentMethodData[]): any[] {
  // Check that at least one payment method is passed in
  if (methodData.length < 1) {
    throw new ConstructorError(`At least one payment method is required`);
  }

  let serializedMethodData: any[] = [];
  // Check that each payment method has at least one payment method identifier
  methodData.forEach((paymentMethod) => {
    if (paymentMethod.supportedMethods === undefined) {
      throw new ConstructorError(
        `required member supportedMethods is undefined.`
      );
    }

    if (!Array.isArray(paymentMethod.supportedMethods)) {
      throw new ConstructorError(
        `required member supportedMethods is not iterable.`
      );
    }

    if (paymentMethod.supportedMethods.length < 1) {
      throw new ConstructorError(
        `Each payment method needs to include at least one payment method identifier`
      );
    }

    const serializedData = paymentMethod.data
      ? JSON.stringify(paymentMethod.data)
      : null;

    serializedMethodData.push([paymentMethod.supportedMethods, serializedData]);
  });

  return serializedMethodData;
}

export function validateDisplayItems(
  displayItems?: PaymentItem[],
  errorType = ConstructorError
): void {
  // Check that the value of each display item is a valid decimal monetary value
  if (displayItems) {
    displayItems.forEach((item: PaymentItem) => {
      const amountValue = item && item.amount && item.amount.value;

      if (!amountValue && Number(amountValue || 0) !== 0) {
        throw new errorType(`required member value is undefined.`);
      }

      if (!isValidDecimalMonetaryValue(amountValue)) {
        throw new errorType(
          `'${amountValue}' is not a valid amount format for display items`
        );
      }
    });
  }
}

export function validateShippingOptions(
  shippingOptions: PaymentShippingOption[] | undefined,
  errorType = ConstructorError
): void {
  if (shippingOptions === undefined) {
    return undefined;
  }

  if (!Array.isArray(shippingOptions)) {
    throw new errorType(`Iterator getter is not callable.`);
  }

  if (shippingOptions) {
    let seenIDs: string[] = [];

    shippingOptions.forEach((shippingOption: PaymentShippingOption) => {
      if (shippingOption.id === undefined) {
        throw new errorType(`required member id is undefined.`);
      }

      // Reproducing how Chrome handlers `null`
      if (shippingOption.id === null) {
        shippingOption.id = 'null';
      }

      // 8.2.3.1 If option.amount.value is not a valid decimal monetary value, then throw a TypeError, optionally informing the developer that the value is invalid.
      const amountValue = shippingOption.amount.value;
      if (!isValidDecimalMonetaryValue(amountValue)) {
        throw new errorType(
          `'${amountValue}' is not a valid amount format for shippingOptions`
        );
      }

      // 8.2.3.2 If seenIDs contains option.id, then set options to an empty sequence and break.
      if (seenIDs.includes(shippingOption.id)) {
        shippingOptions = [];
        console.warn(
          `[ReactNativePayments] Duplicate shipping option identifier '${shippingOption.id}' is treated as an invalid address indicator.`
        );

        return undefined;
      }

      // 8.2.3.3 Append option.id to seenIDs.
      seenIDs.push(shippingOption.id);
    });
  }
}

export function getSelectedShippingOption(
  shippingOptions: PaymentShippingOption[]
) {
  // Return null if shippingOptions isn't an Array
  if (!Array.isArray(shippingOptions)) {
    return null;
  }

  // Return null if shippingOptions is empty
  if (shippingOptions.length === 0) {
    return null;
  }

  const selectedShippingOption = shippingOptions.find(
    (shippingOption) => shippingOption.selected
  );

  // Return selectedShippingOption id
  if (selectedShippingOption) {
    return selectedShippingOption.id;
  }

  // Return first shippingOption if no shippingOption was marked as selected
  return shippingOptions[0]?.id || '';
}

// Gateway helpers
export function hasGatewayConfig(platformMethodData: {
  paymentMethodTokenizationParameters: { parameters: { gateway: any } };
}) {
  if (!platformMethodData) {
    return false;
  }

  if (!platformMethodData.paymentMethodTokenizationParameters) {
    return false;
  }

  if (!platformMethodData.paymentMethodTokenizationParameters.parameters) {
    return false;
  }

  if (
    typeof platformMethodData.paymentMethodTokenizationParameters.parameters !==
    'object'
  ) {
    return false;
  }

  if (
    !platformMethodData.paymentMethodTokenizationParameters.parameters.gateway
  ) {
    return false;
  }

  if (
    typeof platformMethodData.paymentMethodTokenizationParameters.parameters
      .gateway !== 'string'
  ) {
    return false;
  }

  return true;
}

export function getGatewayName(platformMethodData: {
  paymentMethodTokenizationParameters: { parameters: { gateway: any } };
}) {
  return platformMethodData.paymentMethodTokenizationParameters.parameters
    .gateway;
}

export function validateGateway(
  selectedGateway = '',
  supportedGateways: string[] = []
) {
  if (!supportedGateways.includes(selectedGateway)) {
    throw new ConstructorError(
      `"${selectedGateway}" is not a supported gateway. Visit https://goo.gl/fsxSFi for more info.`
    );
  }
}
