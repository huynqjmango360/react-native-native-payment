#import "GatewayManager.h"

@import Braintree;

@import Stripe;
@import StripeCore;
@import StripeApplePay;
@import StripePayments;

@implementation GatewayManager

+ (NSArray *)getSupportedGateways
{
    NSMutableArray *supportedGateways = [NSMutableArray array];
    
    [supportedGateways addObject:@"stripe"];

    [supportedGateways addObject:@"braintree"];

    return [supportedGateways copy];
}

- (void)configureGateway:(NSDictionary *_Nonnull)gatewayParameters
      merchantIdentifier:(NSString *_Nonnull)merchantId
{
    if ([gatewayParameters[@"gateway"] isEqualToString:@"stripe"]) {
        [self configureStripeGateway:gatewayParameters merchantIdentifier:merchantId];
    }

    if ([gatewayParameters[@"gateway"] isEqualToString:@"braintree"]) {
        [self configureBraintreeGateway:gatewayParameters];
    }
}

- (void)createTokenWithPayment:(PKPayment *_Nonnull)payment
                    completion:(void (^_Nullable)(NSString * _Nullable token, NSError * _Nullable error))completion
{

// TODO
// Create Stripe payment
//    [self createStripeTokenWithPayment:payment completion:completion];

    [self createBraintreeTokenWithPayment:payment completion:completion];
}

- (void)configureStripeGateway:(NSDictionary *_Nonnull)gatewayParameters
            merchantIdentifier:(NSString *_Nonnull)merchantId
{ 
    NSString *stripePublishableKey = gatewayParameters[@"stripe:publishableKey"];
    [[STPPaymentConfiguration sharedConfiguration] setPublishableKey:stripePublishableKey];
    [[STPPaymentConfiguration sharedConfiguration] setAppleMerchantIdentifier:merchantId];
}

- (void)createStripeTokenWithPayment:(PKPayment *)payment completion:(void (^)(NSString * _Nullable, NSError * _Nullable))completion
{
    [[STPAPIClient sharedClient] createTokenWithPayment:payment completion:^(STPToken * _Nullable token, NSError * _Nullable error)
     {
        if (error) {
            completion(nil, error);
        } else {
            completion(token.tokenId, nil);
        }
    }];
}

- (void)configureBraintreeGateway:(NSDictionary *_Nonnull)gatewayParameters
{
//    NSString *braintreeTokenizationKey = gatewayParameters[@"braintree:tokenizationKey"];
//    self.braintreeClient = [[BTAPIClient alloc] initWithAuthorization:braintreeTokenizationKey];
}

- (void)createBraintreeTokenWithPayment:(PKPayment *_Nonnull)payment
                             completion:(void (^_Nullable)(NSString * _Nullable token, NSError * _Nullable error))completion
{
//    BTApplePayClient *applePayClient = [[BTApplePayClient alloc]
//                                        initWithAPIClient:self.braintreeClient];
//    
//    [applePayClient tokenizeApplePayPayment:payment
//                                 completion:^(BTApplePayCardNonce *tokenizedApplePayPayment,
//                                              NSError *error)
//     {
//        if (error) {
//            completion(nil, error);
//        } else {
//            completion(tokenizedApplePayPayment.nonce, nil);
//        }
//    }];
}

@end
