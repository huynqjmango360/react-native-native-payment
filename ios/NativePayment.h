
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNativePaymentSpec.h"

@interface NativePayment : NSObject <NativeNativePaymentSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NativePayment : NSObject <RCTBridgeModule>
#endif

@end
