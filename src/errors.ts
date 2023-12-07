const ERROR_MESSAGES: { [key: string]: string } = {
  AbortError: 'The operation was aborted.', // Request cancelled
  InvalidStateError: 'The object is in an invalid state.',
  NotAllowedError:
    'The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.',
  NotSupportedError: 'The operation is not supported.',
  SecurityError: 'The operation is insecure.',
};

class ReactNativePaymentsError extends Error {
  constructor(errorMessage: any) {
    super(`[ReactNativePayments] ${errorMessage}`);
  }
}

export class DOMException extends ReactNativePaymentsError {
  constructor(errorType: string) {
    const errorMessage = ERROR_MESSAGES[errorType] || errorType;

    super(`DOMException: ${errorMessage}`);
  }
}

export class TypeError extends ReactNativePaymentsError {
  constructor(errorMessage: any) {
    super(`TypeError: ${errorMessage}`);
  }
}

export class ConstructorError extends ReactNativePaymentsError {
  constructor(errorMessage: any) {
    super(`Failed to construct 'PaymentRequest':  ${errorMessage}`);
  }
}

export class GatewayError extends Error {
  constructor(errorMessage: any) {
    super(`${errorMessage}`);
  }
}
